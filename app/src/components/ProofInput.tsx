import { FC, useState } from 'react'

export const ProofInput: FC<{
  info: string
  proofText: string
  placeholder: string
  prompt: string
  addProofCallback: (proof: string) => any
}> = ({ info, proofText, placeholder, prompt, addProofCallback }) => {
  const [isCopied, setIsCopied] = useState(false)
  const [proof, setProof] = useState('')

  const copyProofText = () => {
    navigator.clipboard.writeText(proofText)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 3000)
  }

  const setProofInput = (e: React.FormEvent<HTMLInputElement>) => {
    const inputProof = e.currentTarget.value
    setProof(inputProof)
  }

  const addProof = () => {
    addProofCallback(proof)
  }

  return (
    <div>
      <div className="alert alert-info shadow-lg">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current flex-shrink-0 w-6 h-6 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>{info}</span>
        </div>
      </div>
      <div className="card bg-primary m-3">
        <div className="card-body text-black">
          <p className="text-black">{proofText}</p>
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
          placeholder={placeholder}
          className="input input-info input-bordered mt-3"
          onChange={setProofInput}
        />
        <label className="label">
          <span className="label-text-alt">{prompt}</span>
        </label>
      </div>
      <div className="modal-action">
        <label htmlFor="add-proof-modal" className="btn btn-primary" onClick={addProof}>
          Submit
        </label>
        <label htmlFor="add-proof-modal" className="btn">
          Close
        </label>
      </div>
    </div>
  )
}
