import { useMemo } from 'react'
import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { Provider, Program, web3, Idl } from '@project-serum/anchor'
import bs58 from 'bs58'

import { generateAliasKeypair } from 'utils/crypto'
import idl from 'idl/vvallet.json'
import ReadOnlyWallet from './ReadOnlyWallet'
import { IdentityAlias } from 'types/identityAlias'

// VVallet wraps the program connection for interactions with vvallet on chain
export interface VVallet {
  local: AnchorWallet
  connection: Connection
  provider: Provider
  programID: PublicKey
  program: Program
}

export function useReadOnlyVVallet(): VVallet {
  const clusterURL: string = process.env.NEXT_PUBLIC_CLUSTER_URL
    ? process.env.NEXT_PUBLIC_CLUSTER_URL
    : 'http://127.0.0.1:8899' // default to local

  const keypair = Keypair.generate()
  const local = new ReadOnlyWallet(keypair)
  const connection = new Connection(clusterURL)
  const provider = new Provider(connection, local, Provider.defaultOptions())
  const programID = new PublicKey(idl.metadata.address)
  // @ts-ignore
  const program = new Program(idl, programID, provider)

  return { local, connection, provider, programID, program }
}

export function useVVallet(): VVallet | undefined {
  const clusterURL: string = process.env.NEXT_PUBLIC_CLUSTER_URL
    ? process.env.NEXT_PUBLIC_CLUSTER_URL
    : 'http://127.0.0.1:8899' // default to local

  const local = useAnchorWallet()!
  const connection = new Connection(clusterURL)
  const provider = new Provider(connection, local, Provider.defaultOptions())
  const programID = new PublicKey(idl.metadata.address)
  // @ts-ignore
  const program = new Program(idl, programID, provider)

  return useMemo(
    () => (local ? { local, connection, provider, programID, program } : undefined),
    [local],
  )
}

// used for testing
export const airdropToWallet = async (wallet: VVallet) => {
  if (wallet.local) {
    const signature = await wallet.connection.requestAirdrop(
      wallet.local.publicKey,
      1000000000,
    )

    let resp = await wallet.connection.confirmTransaction(signature)
    console.log('air drop complete')
    console.log(resp)
  }
}

export const registerAccount = async (wallet: VVallet, alias: string) => {
  if (wallet.local) {
    let aliasKeys = generateAliasKeypair(alias)

    console.log(wallet.local.publicKey.toString())

    await wallet.program.rpc.register(alias, {
      accounts: {
        identity: aliasKeys.publicKey,
        owner: wallet.local.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
      signers: [aliasKeys], // wallet is automatically added as a signer
    })
  }
}

const aliasFilter = (alias: string) => ({
  memcmp: {
    offset:
      8 + // discriminator
      32 + // public key
      4, // alias string prefix
    bytes: bs58.encode(Buffer.from(alias)),
  },
})

export const fetchIdentitiesByAlias = async (wallet: VVallet, alias: string) => {
  let filters = [aliasFilter(alias)]
  if (wallet.local) {
    const accounts = await wallet.program.account.identity.all(filters)

    console.log(accounts)
  }
}

export const fetchIdentity = async (
  wallet: VVallet,
  alias: string,
): Promise<IdentityAlias> => {
  if (!wallet.local) {
    Promise.reject('local wallet not defined')
  }

  let keypair = generateAliasKeypair(alias)
  const resp = await wallet.program.account.identity.fetch(keypair.publicKey)

  const idAlias: IdentityAlias = {
    owner: resp.owner,
    alias: resp.alias,
  }

  return idAlias
}

export const fetchAllIdentities = async (wallet: VVallet) => {
  if (wallet.local) {
    const accounts = await wallet.program.account.identity.all()

    console.log(accounts)
  }
}

export const isAliasRegistered = async (
  wallet: VVallet,
  alias: string,
): Promise<boolean> => {
  if (wallet.local) {
    // TODO: look up on chain
    return true
  }
  return true // no real sane default here
}

export const isKeyRegistered = (pub: PublicKey): boolean => {
  // TODO
  return false
}
