import useSWR from 'swr'
import { IdResponse } from 'types/identityAlias'
import { ProofsResponse, ProofValidationResponse, ValidateProofRequest } from 'types/ownerProof'

export const fetcher = async (url: string): Promise<any> => {
  const res = await fetch(url)

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    // Attach extra info to the error object.
    const info = await res.json()
    ;(error as any).status = res.status

    console.warn(url, '\nAn error occured while fetching:\n', info)

    throw error
  }

  return res.json()
}

export const useIdentity = (id: string): IdResponse => {
  const { data, error } = useSWR(`/api/im/${id}`, fetcher)

  return {
    identity: data,
    isLoading: !error && !data,
    error: error,
  }
}

export const useProofs = (owner: string): ProofsResponse => {
  const { data, error } = useSWR(`/api/proofs/${owner}`, fetcher)

  return {
    proofs: data,
    isLoading: !error && !data,
    error: error,
  }
}

export const useProofValidator = (req: ValidateProofRequest): ProofValidationResponse => {
  const { data, error } = useSWR(`/api/${req.id}/valid`, fetcher)

  return {
    proofValidation: data,
    isLoading: !error && !data,
    error: error,
  }
}
