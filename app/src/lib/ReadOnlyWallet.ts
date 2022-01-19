import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { AnchorWallet } from '@solana/wallet-adapter-react'

/**
 * ReadOnlyWallet for querying the vvallet chain
 * Does not store funds or commit transactions
 * This stub is needed for use with Anchor
 */
export default class ReadOnlyWallet implements AnchorWallet {
  constructor(readonly keypair: Keypair) {}

  async signTransaction(tx: Transaction): Promise<Transaction> {
    tx.partialSign(this.keypair);
    return tx;
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    return txs.map((t) => {
      t.partialSign(this.keypair);
      return t;
    });
  }

  get publicKey(): PublicKey {
    return this.keypair.publicKey;
  }
}
