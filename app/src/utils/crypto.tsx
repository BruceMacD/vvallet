import { createHash } from 'crypto'
import * as anchor from '@project-serum/anchor'

// generateAliasKeypair converts a string into a keypair that is used to store accounts on chain
// this is useful to ensure uniqueness and (maybe) make look ups faster
export const generateAliasKeypair = (alias: string): anchor.web3.Keypair => {
  let hash: Uint8Array = createHash('sha256').update(alias).digest()
  return anchor.web3.Keypair.fromSeed(hash)
}
