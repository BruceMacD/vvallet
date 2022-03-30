import { FC, useState } from 'react'
import { ErrorDisplay, SuccessDisplay, ProcessingDisplay, ProofInput } from 'components'
import { fetchProof, registerProof, VVallet } from 'contexts/VVallet'
import { IdentityAlias } from 'types/identityAlias'
import { Keypair } from '@solana/web3.js'
import { waitUntilTrue } from 'utils/timer'
import { Constants } from 'types/constants'

export const AddProof: FC<{ app: VVallet; identity: IdentityAlias }> = ({
  app,
  identity,
}) => {
  const [isWaiting, setIsWaiting] = useState(false)
  const [proofType, setProofType] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [confirmationMsg, setConfirmationMsg] = useState('')

  const ensProofText = identity
    ? 'http://vvallet.me/im/' +
      identity.alias
    : ''
  
  const twitterProofText = identity
    ? 'Verifying my @vvalletdotme alias is ' +
      identity.alias +
      ': http://vvallet.me/im/' +
      identity.alias
    : ''

  const setProofTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.currentTarget.value
    setProofType(selectedType)
  }


  const addProof = async (proof: string) => {
    if (app) {
      // remove and tracking query parameters from copying the URL
      let proofParts = proof.split('?')

      setIsWaiting(true)
      await registerProof(app, proofType, proofParts[0])
        .then((registered: Keypair | undefined) => {
          if (registered !== undefined) {
            const proofRegistered = async (): Promise<boolean> => {
              let isRegistered = false
              await fetchProof(app, registered.publicKey.toBase58())
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
            <div className="modal">
              <div className="modal-box">
                <select
                  className="select select-bordered m-3"
                  defaultValue={'DEFAULT'}
                  onChange={setProofTypeSelect}
                >
                  <option value="DEFAULT" disabled>
                    Select the type of proof...
                  </option>
                  <option value={Constants.ENS}>Ethereum Name Service (ENS)</option>
                  <option value={Constants.TWITTER}>Twitter</option>
                </select>
                {proofType == Constants.ENS && (
                  <ProofInput info='Add this link to your ENS text records.' proofText={ensProofText} placeholder='example.eth' prompt='Enter your .eth name' addProofCallback={addProof}/>
                )}
                {proofType == Constants.TWITTER && (
                  <ProofInput info='Tweet this.' proofText={twitterProofText} placeholder='https://twitter.com/.../status/...' prompt='Enter a publicly accessible link to your proof' addProofCallback={addProof}/>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
