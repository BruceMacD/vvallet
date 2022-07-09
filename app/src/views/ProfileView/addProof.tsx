import { FC, useState } from 'react'
import { ErrorDisplay, SuccessDisplay, ProcessingDisplay, ProofInput } from 'components'
import { registerProof, VVallet } from 'contexts/VVallet'
import { IdentityAlias } from 'types/identityAlias'
import { Keypair } from '@solana/web3.js'
import { waitUntilTrue } from 'utils/timer'
import { Constants } from 'types/constants'
import { fetchKeyProof } from 'utils/fetcher'

export const AddProof: FC<{ app: VVallet; identity: IdentityAlias }> = ({
  app,
  identity,
}) => {
  const [isWaiting, setIsWaiting] = useState(false)
  const [proofType, setProofType] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [confirmationMsg, setConfirmationMsg] = useState('')

  const linkProofText = identity ? 'vvallet.me/im/' + identity.alias : ''

  const postProofText = identity
    ? 'This post connects my Reddit account to my decentralized identity: ' +
      'vvallet.me/im/' +
      identity.alias
    : ''

  const verifyingProofText = identity
    ? 'Verifying my @vvalletdotme alias is ' +
      identity.alias +
      ': vvallet.me/im/' +
      identity.alias
    : ''

  const setProofTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.currentTarget.value
    setProofType(selectedType)
  }

  const addProof = async (proof: string) => {
    if (app) {
      // remove tracking query parameters from copying the URL
      let proofParts = proof.split('?')

      setIsWaiting(true)
      await registerProof(app, proofType, proofParts[0])
        .then((registered: Keypair | undefined) => {
          if (registered !== undefined) {
            const proofRegistered = async (): Promise<boolean> => {
              let isRegistered = false
              await fetchKeyProof(registered.publicKey)
                .then(() => {
                  // if it doesn't exist an error would have been thrown
                  isRegistered = true
                })
                .catch((err: Error) => {
                  console.log(err)
                })
              return isRegistered
            }

            waitUntilTrue(proofRegistered).then(() => {
              setIsWaiting(false)
              setConfirmationMsg('Success, your proof has been recorded.')
            })
          }
        })
        .catch((err: Error) => {
          setIsWaiting(false)
          setErrMsg(err.message)
        })
    }
  }

  return (
    <div>
      {isWaiting && (
        <div className="alert alert-info w-64 mt-3 w-96">
          <ProcessingDisplay />
          <button className="btn btn-outline" onClick={() => setIsWaiting(false)}>
            dismiss
          </button>
        </div>
      )}

      {errMsg != '' && (
        <div className="alert alert-error md:w-96">
          <ErrorDisplay message={errMsg} />
          <button className="btn btn-outline" onClick={() => setErrMsg('')}>
            ok
          </button>
        </div>
      )}

      {confirmationMsg != '' && (
        <div className="alert alert-success w-96">
          <SuccessDisplay message={confirmationMsg} />
          <button className="btn btn-outline ml-1" onClick={() => setConfirmationMsg('')}>
            ok
          </button>
        </div>
      )}

      <div>
        {isWaiting ? (
          <button className="btn btn-outline btn-accent border-base-300 md:w-96 mt-3 loading" />
        ) : (
          <div>
            <label
              htmlFor="add-proof-modal"
              className="btn btn-outline btn-accent border-base-300 w-80 sm:w-96 mt-3 modal-button"
            >
              + add a proof
            </label>
            <input type="checkbox" id="add-proof-modal" className="modal-toggle" />
            <label htmlFor="add-proof-modal" className="modal">
              <label className="modal-box">
                <select
                  className="select select-bordered m-3"
                  defaultValue={'DEFAULT'}
                  onChange={setProofTypeSelect}
                >
                  <option value="DEFAULT" disabled>
                    Select the type of proof...
                  </option>
                  <option value={Constants.DNS}>Domain Name Service (DNS)</option>
                  <option value={Constants.ENS}>Ethereum Name Service (ENS)</option>
                  <option value={Constants.MASTODON}>Mastodon</option>
                  <option value={Constants.REDDIT}>Reddit</option>
                  <option value={Constants.TWITTER}>Twitter</option>
                </select>
                {proofType == Constants.DNS && (
                  <ProofInput
                    info="Add this TXT record to the DNS record of your domain."
                    proofText={linkProofText}
                    placeholder="example.com"
                    prompt="Enter your domain"
                    addProofCallback={addProof}
                  />
                )}
                {proofType == Constants.ENS && (
                  <ProofInput
                    info="Add this link to your ENS text records."
                    proofText={linkProofText}
                    placeholder="example.eth"
                    prompt="Enter your .eth name"
                    addProofCallback={addProof}
                  />
                )}
                {proofType == Constants.MASTODON && (
                  <ProofInput
                    info="Post this."
                    proofText={verifyingProofText}
                    placeholder="https://mastodon.social/web/@..."
                    prompt="Enter a publicly accessible link to your proof"
                    addProofCallback={addProof}
                  />
                )}
                {proofType == Constants.REDDIT && (
                  <ProofInput
                    info="Create a submission on Reddit with this text."
                    proofText={postProofText}
                    placeholder="https://www.reddit.com/user/.../comments/.../vvalletme_proof"
                    prompt="Enter a publicly accessible link to your proof"
                    addProofCallback={addProof}
                  />
                )}
                {proofType == Constants.TWITTER && (
                  <ProofInput
                    info="Tweet this."
                    proofText={verifyingProofText}
                    placeholder="https://twitter.com/.../status/..."
                    prompt="Enter a publicly accessible link to your proof"
                    addProofCallback={addProof}
                  />
                )}
              </label>
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
