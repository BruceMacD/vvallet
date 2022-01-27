export type OwnerProof = {
  id: string // b58 encoded public key
  owner: string // b58 encoded public key
  kind: string
  proof: string
}

export type ProofsResponse = {
  proofs: OwnerProof[]
  isLoading: boolean
  error: Error
}

export type ValidateProofRequest = {
  id: string // public key of the proof account
}

export type ProofValidation = {
  owner: string // b58 encoded public key
  proof: string
  valid: boolean
  byProxy: boolean
}

export type ProofValidationResponse = {
  proofValidation: ProofValidation
  isLoading: boolean
  error: Error
}
