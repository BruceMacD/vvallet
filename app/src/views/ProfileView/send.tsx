import React, { FC, useCallback, useState } from "react"
import Image from 'next/image'
import { WalletNotConnectedError } from "@solana/wallet-adapter-base"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { Connection, LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js"
import { IdentityAlias } from "types/identityAlias"

export const Send: FC<{ identity: IdentityAlias }> = ({
  identity,
}) => {
  const [sendAmount, setSendAmount] = useState("")
  const [loadingMax, setLoadingMax] = useState(false)
  const { publicKey, sendTransaction } = useWallet()

  const setSendAmountMax = async () => {
    const clusterURL = process.env.NEXT_PUBLIC_CLUSTER_URL
    if (clusterURL != undefined && publicKey != undefined) {
      setLoadingMax(true)
      // read the amount in the connected wallet
      const connection = new Connection(clusterURL, "confirmed")
      const walletBalance = await connection.getBalance(publicKey)
      // convert lamports to SOL
      const solBalance = walletBalance / LAMPORTS_PER_SOL
      // set the displayed amount
      setSendAmount(solBalance.toString())
      setLoadingMax(false)
    } else {
      console.log("wallet not connected")
    }
  }

  const setSendAmountInput = (e: React.FormEvent<HTMLInputElement>) => {
    // check that the amount is only numbers and a decimal
    var isValid = /^^[0-9]*.?[0-9]*$/.test(e.currentTarget.value)
    if (isValid) {
      setSendAmount(e.currentTarget.value)
    }
  }

  const sendPayment = async () => {
    if (!publicKey) throw new WalletNotConnectedError()

    const clusterURL = process.env.NEXT_PUBLIC_CLUSTER_URL

    if (clusterURL != undefined && publicKey != undefined && sendAmount != "") {
      const connection = new Connection(clusterURL, "confirmed")

      const sol = parseFloat(sendAmount)
      
      const lamports = sol * LAMPORTS_PER_SOL 

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(identity.owner),
          lamports: lamports,
        })
      )

      try {
        const signature = await sendTransaction(transaction, connection)
        await connection.confirmTransaction(signature, "processed")
      } catch (err: any) {
        if (err.message?.includes('rejected the request')) {
          // the user cancelled the transaction, this is fine
          console.log(err)
        } else {
          // something unexpected happened
          throw err
        }
      }
    } else {
      console.log("unable to send, either the cluster URL, send amount, or public key are not set")
    }
  }

  return (
    <div>
      <label
        htmlFor="add-proof-modal"
        className="btn btn-outline btn-accent border-base-300 w-80 mt-3 modal-button"
      >
        ↗ Send payment
      </label>
      <input type="checkbox" id="add-proof-modal" className="modal-toggle" />
      <label htmlFor="add-proof-modal" className="modal">
        <label htmlFor="add-proof-modal" className="modal-box m-3">
            <div className="mb-6 text-center hero-content">
              <h3 className="font-bold text-xl">Send SOL</h3>
            </div>
            <div className="hero-content orb">
              <Image
                src="/img/sol.png"
                className="max-w-lg rounded-lg shadow-2xl"
                alt="vvallet.me account connection web"
                width={60}
                height={60}
              />
            </div>
          <div className="mt-8 stats shadow w-full text-center">
            <div className="stat">
              <div className="stat-title">recipient</div>
              <div className="stat-value">{identity.alias}</div>
              <div className="stat-desc">{identity.owner.slice(0, 6)}...{identity.owner.slice(identity.owner.length - 6, identity.owner.length)}</div>
            </div>
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">amount</span>
              <span className="label-text-alt badge badge-primary cursor-pointer" onClick={setSendAmountMax}>
                {loadingMax ? 
                  "loading..." 
                  : "max" 
                }
              </span>
            </label>
            <input type="text" placeholder="$SOL" className="input input-bordered w-full" value={sendAmount} onChange={setSendAmountInput}/>
            <label className="label">
              <span className="label-text-alt">the transaction will be confirmed before any funds are sent</span>
            </label>
          </div>
          <div className="modal-action">
            <div>
              {sendAmount != "" &&
                <label htmlFor="add-proof-modal" className="btn btn-primary mr-3" onClick={sendPayment}>
                  ↗ Send
                </label>
              }
              <label htmlFor="add-proof-modal" className="btn">
                Cancel
              </label>
            </div>
          </div>
        </label>
      </label>
    </div>
  );
};
