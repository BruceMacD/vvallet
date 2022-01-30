import { FC } from 'react'
import { OwnerProof } from 'types/ownerProof'
import { useProofValidator } from 'utils/fetcher'

export const Proof: FC<{ proof: OwnerProof }> = ({ proof }) => {
  const { proofValidation, isLoading, error } = useProofValidator(proof)

  console.log(proofValidation)
  // TODO: confirm validated proof owner matches expected
  return (
    <button className="btn btn-accent">
      {proof.kind}
      <div className="badge ml-2 badge-success">valid</div>
    </button>
  )
}
