import { FC } from 'react'
import { IdentityAlias } from 'types/identityAlias'
import { useProofs } from 'utils/fetcher'
import { Proof } from './proof'

// The proofs view gets all proofs for an identity then validates them
export const Proofs: FC<{ identity: IdentityAlias }> = ({ identity }) => {
  const { proofs, isLoading, error } = useProofs(identity.owner)

  const proofsDisplay: JSX.Element[] = proofs
    ?.sort()
    .map(proof => <Proof proof={proof} identity={identity} key={proof.id} />)

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
            <button className="btn btn-lg">{error.message}</button>
          </div>
        </div>
      </div>
    )
  else {
    if (proofs.length == 0) {
      return (
        <div className="alert alert-info shadow-lg mt-2">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current flex-shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span className="ml-2">
              This user has not added any proofs.
              <div />
              They must prefer to keep an air of mystery.
            </span>
          </div>
        </div>
      )
    } else {
      return <div>{proofsDisplay}</div>
    }
  }
}
