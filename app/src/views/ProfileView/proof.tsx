import { SuccessDisplay } from 'components'
import { ErrorDisplay } from 'components/ErrorDisplay'
import { getIcon } from 'components/Icon'
import { deleteProof, useVVallet } from 'contexts/VVallet'
import Link from 'next/link'
import { FC, useState } from 'react'
import { Constants } from 'types/constants'
import { IdentityAlias } from 'types/identityAlias'
import { OwnerProof } from 'types/ownerProof'
import { useProofValidator } from 'utils/fetcher'
import { parseProfileLink, parseUsername } from 'utils/parser'
import { validateProofHasExpectedOwner } from 'utils/validator'

export const Proof: FC<{ proof: OwnerProof; identity: IdentityAlias }> = ({ proof, identity }) => {
  const app = useVVallet()
  const [proofDeleted, setProofDeleted] = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [confirmationMsg, setConfirmationMsg] = useState('')
  const { proofValidation, isLoading, error } = useProofValidator(proof, identity.alias)

  const requestDeleteProof = async () => {
    if (app) {
      await deleteProof(app, proof)
        .then(() => {
          setConfirmationMsg(
            'Request submitted, please allow it a few minutes to process.',
          )
          setProofDeleted(true)
        })
        .catch((err: Error) => {
          setErrMsg(err.message)
        })
    }
  }

  const proofToLink = (kind: string, proof: string): string => {
    switch (kind) {
      case Constants.ENS:
        return "https://app.ens.domains/name/" + proof + "/details"
      default:
        return proof
    }
  }

  const kindToTitle = (kind: string): string => {
    switch (kind) {
      case Constants.DNS:
        return "domain name"
      case Constants.ENS:
        return "ethereum name service"
      default:
        return kind
    }
  }

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
      proofValidation.valid = validateProofHasExpectedOwner(proofValidation, identity.owner)
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
      console.log(
        'Proof validation for ' +
          proofValidation.proof +
          ' failed: ' +
          proofValidation.error,
      )
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
    <div className="mt-3 collapse md:w-96 border rounded-box border-base-300 collapse-arrow">
      <input type="checkbox" />
      <div className="collapse-title text-sm font-medium">
        <div className="flex">
          {getIcon(proof.kind)}
          <span className="ml-2 align-middle" > {kindToTitle(proof.kind)} </span>
        </div>
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
          <Link href={proofToLink(proof.kind, proof.proof)}>
            <a className="text-sm link link-primary">link</a>
          </Link>
        </div>

        <div className="mt-3">
          <p className="font-bold">Validation:</p>
          <p className="text-sm">{proofValidation?.byProxy ? 'proxy' : 'local'}</p>
        </div>

        <div className="grid place-items-center">
          {app?.connectedWallet?.publicKey &&
          proof.owner == app.connectedWallet.publicKey.toBase58() &&
          !proofDeleted ? (
            <button
              className="btn btn-error btn-outline w-64 mt-6"
              onClick={requestDeleteProof}
            >
              delete
            </button>
          ) : null}

          {errMsg != '' && (
            <div className="alert alert-error w-64 mt-6">
              <ErrorDisplay message={errMsg} />
              <button className="btn btn-outline ml-1" onClick={() => setErrMsg('')}>
                ok
              </button>
            </div>
          )}

          {proofDeleted && confirmationMsg != '' && (
            <div className="alert alert-success w-64 mt-6">
              <SuccessDisplay message={confirmationMsg} />
              <button
                className="btn btn-outline ml-1"
                onClick={() => setConfirmationMsg('')}
              >
                ok
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
