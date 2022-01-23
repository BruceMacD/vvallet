import { FC, useState } from 'react'
import { IdentityAlias } from 'types/identityAlias'
import { useProofs } from 'utils/fetcher'

// The proofs view gets all proofs for an identity then validates them
export const Proofs: FC<{ identity: IdentityAlias }> = ({ identity }) => {
  const { proofs, isLoading, error } = useProofs(identity.owner)

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
      <div className="hero min-h-screen">
        <div className="text-center hero-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl">{proofs[0].proof}</h1>
          </div>
        </div>
      </div>
    )
}
