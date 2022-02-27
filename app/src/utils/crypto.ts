import { createHash } from 'crypto'
import * as anchor from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'

// generateAliasKeypair converts a string into a keypair that is used to store accounts on chain
// this is useful to ensure uniqueness and (maybe) make look ups faster
export const generateAliasKeypair = (alias: string): anchor.web3.Keypair => {
  let hash: Uint8Array = createHash('sha256').update(alias).digest()
  return anchor.web3.Keypair.fromSeed(hash)
}

export const abbreviated = (pub: PublicKey): string => {
  const key = pub.toBase58()
  return key.slice(0, 16) + '...' + key.slice(-16)
}
