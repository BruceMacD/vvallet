import { FC, useState } from 'react'
import { IdentityAlias } from 'types/identityAlias'
import { useProofs } from 'utils/fetcher'
import { Proof } from './proof'

// The proofs view gets all proofs for an identity then validates them
export const Proofs: FC<{ identity: IdentityAlias }> = ({ identity }) => {
  const { proofs, isLoading, error } = useProofs(identity.owner)

  const proofsDisplay: JSX.Element[] = proofs?.map((proof) => 
    <Proof proof={proof} key={proof.proof} />
  )

  if (isLoading)
    return (
      <div className="hero min-h-screen">
        <div className="text-center hero-content">
          <div className="max-w-md">
            <button className="btn btn-lg loading">loading</button>
          </div>
        </div>
      </div>
    )
  else if (error)
    return (
      <div className="hero min-h-screen">
        <div className="text-center hero-content">
          <div className="max-w-md">
            <button className="btn btn-lg">{error}</button>
          </div>
        </div>
      </div>
    )
  else
    return (
      <div>
        {proofsDisplay}
      </div>
    )
}
