import { FC } from 'react'
import { OwnerProof } from 'types/ownerProof'

export const Proof: FC<{ proof: OwnerProof }> = ({ proof }) => {
  return (
    <button className="btn btn-accent">
      {proof.kind}
      <div className="badge ml-2 badge-outline">validated</div>
    </button>
  )
}
