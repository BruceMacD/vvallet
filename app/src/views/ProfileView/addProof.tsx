import { ErrorDisplay } from 'components/ErrorDisplay'
import { registerProof, VVallet } from 'contexts/VVallet'
import { FC, useState } from 'react'
import { IdentityAlias } from 'types/identityAlias'

export const AddProof: FC<{ app: VVallet; identity: IdentityAlias }> = ({
  app,
  identity,
}) => {
  const [isWaiting, setIsWaiting] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [proofType, setProofType] = useState('')
  const [proof, setProof] = useState('')
  const [errMsg, setErrMsg] = useState('')

  const twitterProofText = identity
    ? 'Verifying my @vvalletdotme alias is ' +
      identity.alias +
      ': http://vvallet.me/im/' +
      identity.alias
    : ''

  const copyProofText = () => {
    navigator.clipboard.writeText(twitterProofText)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 3000)
  }

  const setProofTypeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.currentTarget.value
    setProofType(selectedType)
    console.log(selectedType)
  }

  const setProofInput = (e: React.FormEvent<HTMLInputElement>) => {
    const inputProof = e.currentTarget.value
    setProof(inputProof)
  }

  const addProof = async () => {
    if (app) {
      setIsWaiting(true)
      await registerProof(app, proofType, proof).catch((err: Error) => {
        setErrMsg(err.message)
      })
      setIsWaiting(false)
    }
  }

  return (
    <div>
      {errMsg != '' && (
        <div className="alert alert-error w-96">
          <ErrorDisplay message={errMsg} />
          <button className="btn btn-outline" onClick={() => setErrMsg('')}>
            ok
          </button>
        </div>
      )}

      <div>
        {isWaiting ? (
          <button className="btn btn-outline btn-accent border-base-300 w-96 mt-3 loading" />
        ) : (
          <div>
            <label
              htmlFor="add-proof-modal"
              className="btn btn-outline btn-accent border-base-300 w-96 mt-3 modal-button"
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
                  <option value="ens">Ethereum Name Service (ENS)</option>
                  <option value="twitter">Twitter</option>
                </select>
                <div className="card bg-primary m-3">
                  <div className="card-body text-black">
                    <p className="text-black">{twitterProofText}</p>
                    <div className="justify-end card-actions">
                      {isCopied && <span className="badge mt-5">copied!</span>}
                      <button className="btn" onClick={copyProofText}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-control m-3">
                  <input
                    type="text"
                    placeholder="https://twitter.com/.../status/..."
                    className="input input-info input-bordered mt-3"
                    onChange={setProofInput}
                  />
                  <label className="label">
                    <span className="label-text-alt">
                      Enter a publicly accessible link to your proof
                    </span>
                  </label>
                </div>
                <div className="modal-action">
                  <label
                    htmlFor="add-proof-modal"
                    className="btn btn-primary"
                    onClick={addProof}
                  >
                    Submit
                  </label>
                  <label htmlFor="add-proof-modal" className="btn">
                    Close
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
