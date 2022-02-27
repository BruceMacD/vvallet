import { getIcon } from 'components/Icon'
import Link from 'next/link'
import { FC } from 'react'
import { OwnerProof } from 'types/ownerProof'
import { useProofValidator } from 'utils/fetcher'
import { parseProfileLink, parseUsername } from 'utils/parser'
import { validateProofHasExpectedOwner } from 'utils/validator'

export const Proof: FC<{ proof: OwnerProof, owner: string }> = ({ proof, owner }) => {
  const { proofValidation, isLoading, error } = useProofValidator(proof)

  const displayValidity = (): JSX.Element => {
    if (isLoading) {
      return (
        <div className="badge ml-2 badge-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="animate-spin inline-block w-4 h-4 mr-2 stroke-current"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          loading...
        </div>
      )
    }

    if (proofValidation != undefined && proofValidation.valid) {
      // a double check to make sure the server isn't returning invalid proof validations
      proofValidation.valid = validateProofHasExpectedOwner(proofValidation, owner)
    }

    if (proofValidation != undefined && proofValidation.valid) {
      return (
        <div className="badge ml-2 badge-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block w-4 h-4 mr-2 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          valid
        </div>
      )
    }

    // not valid
    if (proofValidation && proofValidation.error != '') {
      console.log("Proof validation for " + proofValidation.proof + " failed: " + proofValidation.error)
    }

    if (error) {
      console.log(error)
    }

    return (
      <div className="badge badge-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block w-4 h-4 mr-2 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
        invalid
      </div>
    )
  }

  const username = parseUsername(proof.kind, proof.proof)
  const profileLink = parseProfileLink(proof.kind, proof.proof)

  return (
    <div className="mt-3 collapse w-96 border rounded-box border-base-300 collapse-arrow">
      <input type="checkbox" />
      <div className="collapse-title text-sm font-medium">
        {getIcon(proof.kind)}
        {proof.kind}
        <div className="text-lg mt-5">
          {username}
          {displayValidity()}
        </div>
      </div>
      <div className="collapse-content">
        <div>
          <Link href={profileLink}>
            <a className="text-base link link-primary">{profileLink}</a>
          </Link>
        </div>
        <div className="mt-3">
          <p className="font-bold">Proof:</p>
          <Link href={proof.proof}>
            <a className="text-sm link link-primary">link</a>
          </Link>
        </div>
        <div className="mt-3">
          <p className="font-bold">Validation:</p>
          <p className="text-sm">{proofValidation?.byProxy ? 'proxy' : 'local'}</p>
        </div>
      </div>
    </div>
  )
}
