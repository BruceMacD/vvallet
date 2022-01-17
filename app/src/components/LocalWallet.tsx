import { useMemo } from 'react'
import Router from 'next/router'
import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { Provider, Program, Idl, web3 } from '@project-serum/anchor'
import bs58 from 'bs58'

import { generateAliasKey } from 'utils/crypto'
import idl from '../../../target/idl/vvallet.json' // TODO: this will only work locally

// LocalWallet wraps the anchor wallet connection for interactions with vvallet on chain
export interface LocalWallet {
  local: AnchorWallet
  connection: Connection
  provider: Provider
  programID: PublicKey
  program: Program

  // signTransaction(transaction: Transaction): Promise<Transaction>;
  // signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
}

export function useLocalWallet(): LocalWallet | undefined {
  const local = useAnchorWallet()!
  const connection = new Connection('http://127.0.0.1:8899')
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
export const airdropToWallet = async (wallet: LocalWallet) => {
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

export const registerAccount = async (wallet: LocalWallet, alias: string) => {
  if (wallet.local) {
    let aliasKeys = generateAliasKey(alias)

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

export const fetchIdentities = async (wallet: LocalWallet) => {
  // TODO: set the alias
  let filters = [aliasFilter('test')]
  if (wallet.local) {
    const accounts = await wallet.program.account.identity.all(filters)
    console.log(accounts)
  }
}

export const isAliasRegistered = async (
  wallet: LocalWallet,
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
