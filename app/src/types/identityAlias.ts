import { PublicKey } from '@solana/web3.js'

export type IdentityAlias = {
  owner: string // b58 encoded public key
  alias: string
}

export type IdResponse = {
  identity: IdentityAlias
  isLoading: boolean
  error: Error
}
