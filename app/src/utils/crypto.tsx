import { createHash } from 'crypto'
import * as anchor from '@project-serum/anchor'

// generateAliasKey converts an alias string into the key used to look up an alias owner keypair
export const generateAliasKey = (alias: string): anchor.web3.Keypair => {
  let hash: Uint8Array = createHash('sha256').update(alias).digest()
  return anchor.web3.Keypair.fromSeed(hash)
}
