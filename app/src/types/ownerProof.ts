export type OwnerProof = {
  owner: string // b58 encoded public key
  kind: string
  proof: string
}

export type ProofsResponse = {
  proofs: OwnerProof[]
  isLoading: boolean
  error: Error
}
