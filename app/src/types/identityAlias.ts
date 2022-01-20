import { PublicKey } from '@solana/web3.js'

export type IdentityAlias = {
  owner: PublicKey
  alias: string
}

export type IdResponse = {
  identity: IdentityAlias
  isLoading: boolean
  isError: Error
}
