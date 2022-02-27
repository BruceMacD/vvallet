import { Keypair, PublicKey, Transaction } from '@solana/web3.js'
import { AnchorWallet } from '@solana/wallet-adapter-react'

/**
 * ReadOnlyWallet for querying the vvallet chain from the API
 * Does not store funds or commit transactions
 * This stub is needed for use with Anchor
 */
export default class ReadOnlyWallet implements AnchorWallet {
  constructor(readonly keypair: Keypair) {}

  async signTransaction(tx: Transaction): Promise<Transaction> {
    throw new Error('Cannot sign transaction using read-only wallet')
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    throw new Error('Cannot sign transactions using read-only wallet')
  }

  get publicKey(): PublicKey {
    return this.keypair.publicKey
  }
}
