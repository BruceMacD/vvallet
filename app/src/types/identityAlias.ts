export type IdentityAlias = {
  owner: string // b58 encoded public key
  alias: string
}

export type IdResponse = {
  identity: IdentityAlias
  isLoading: boolean
  error: Error
}

export type OwnerProof = {
  owner: string // b58 encoded public key
  kind: string
  proof: string
}

export type ProofResponse = {
  proofs: OwnerProof[]
  isLoading: boolean
  error: Error
}
