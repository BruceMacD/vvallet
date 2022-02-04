import { useMemo } from 'react'
import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { Provider, Program, web3 } from '@project-serum/anchor'
import bs58 from 'bs58'

import { generateAliasKeypair } from 'utils/crypto'
import idl from 'idl/vvallet.json'
import ReadOnlyWallet from './ReadOnlyWallet'
import { IdentityAlias } from 'types/identityAlias'
import { OwnerProof } from 'types/ownerProof'

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

const identityAliasFilter = (alias: string) => ({
  memcmp: {
    offset:
      8 + // discriminator
      32 + // owner public key
      4, // alias string prefix
    bytes: bs58.encode(Buffer.from(alias)),
  },
})

export const fetchIdentitiesByAlias = async (wallet: VVallet, alias: string) => {
  if (wallet.local) {
    let filters = [identityAliasFilter(alias)]
    const accounts = await wallet.program.account.identity.all(filters)

    console.log(accounts)
  }
}

const identityOwnerFilter = (owner: string) => ({
  memcmp: {
    offset: 8, // discriminator
    bytes: owner,
  },
})

export const fetchIdentitiesByOwner = async (wallet: VVallet, owner: string): Promise<IdentityAlias[]> => {
  const ownerIdentities: IdentityAlias[] = []
  if (wallet.local) {
    let filters = [identityOwnerFilter(owner)]
    const identities = await wallet.program.account.identity.all(filters)

    identities.every(identity => {
      const ownerIdentity: IdentityAlias = {
        owner: identity.account.owner.toBase58(),
        alias: identity.account.alias,
      }
      ownerIdentities.push(ownerIdentity)
    })
  }

  return ownerIdentities
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
    owner: resp.owner.toBase58(),
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
  return true
}

export const registerProof = async (wallet: VVallet, kind: string, proof: string) => {
  if (wallet.local) {
    // we don't need to regenerate this, so random is fine
    const keypair = web3.Keypair.generate()

    await wallet.program.rpc.addProof(kind, proof, {
      accounts: {
        proof: keypair.publicKey,
        owner: wallet.local.publicKey,
        systemProgram: web3.SystemProgram.programId,
      },
      signers: [keypair], // wallet (owner) is automatically added as a signer
    })

    console.log('added proof')
  }
}

const proofOwnerFilter = (owner: string) => ({
  memcmp: {
    offset: 8, // discriminator
    bytes: owner,
  },
})

export const fetchProofsByOwner = async (
  wallet: VVallet,
  owner: string,
): Promise<OwnerProof[]> => {
  const ownerProofs: OwnerProof[] = []

  if (wallet.local) {
    let filters = [proofOwnerFilter(owner)]
    const proofs = await wallet.program.account.proof.all(filters)

    proofs.every(proof => {
      let ownerProof: OwnerProof = {
        id: proof.publicKey.toBase58(),
        owner: proof.account.owner.toBase58(),
        kind: proof.account.kind,
        proof: proof.account.proof,
      }
      ownerProofs.push(ownerProof)
    })
  }

  return ownerProofs
}

export const fetchProof = async (
  wallet: VVallet,
  publicKey: string, // the public key of the proof account, not the owner
): Promise<OwnerProof> => {
  if (!wallet.local) {
    Promise.reject('local wallet not defined')
  }
  const proof = await wallet.program.account.proof.fetch(publicKey)

  return {
    id: publicKey,
    owner: proof.owner.toBase58(),
    kind: proof.kind,
    proof: proof.proof,
  }
}
