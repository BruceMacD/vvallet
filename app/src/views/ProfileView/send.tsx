import React, { FC, useCallback } from "react"
import Image from 'next/image'
import { WalletNotConnectedError } from "@solana/wallet-adapter-base"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { Connection, LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js"

export const Send: FC<{ sendToAddress: string }> = ({
  sendToAddress,
}) => {
  const { publicKey, sendTransaction } = useWallet();

  const readWalletBalance = async () => {
    const clusterURL = process.env.NEXT_PUBLIC_CLUSTER_URL
    if (clusterURL != undefined && publicKey != undefined) {
      console.log(clusterURL)
      const connection = new Connection(clusterURL, "confirmed");
      const walletBalance = await connection.getBalance(publicKey)
      console.log(
        `Wallet balance is ${walletBalance / LAMPORTS_PER_SOL} SOL`
      );
    }
  }
  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    const clusterURL = process.env.NEXT_PUBLIC_CLUSTER_URL

    if (clusterURL != undefined && publicKey != undefined) {
      console.log(clusterURL)
      const connection = new Connection(clusterURL, "confirmed");
      console.log(
        `Sending ${10_000_000 / LAMPORTS_PER_SOL} SOL`
      );

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(sendToAddress), //TODO: is this the issue?
          lamports: 10_000_000,
        })
      );

      const signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction(signature, "processed")
    }

    ;
  }, [publicKey, sendTransaction]);

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
        <label htmlFor="add-proof-modal" className="modal-box">
            <div className="text-center hero-content">
              <h3 className="font-bold text-xl">Send SOL</h3>
            </div>
            <div className="hero-content orb"><Image
                src="/img/sol.png"
                className="max-w-lg rounded-lg shadow-2xl"
                alt="vvallet.me account connection web"
                width={60}
                height={60}
              />
            </div>
          <div className="modal-action">
            <div>
              <label htmlFor="add-proof-modal" className="btn btn-primary mr-3" onClick={() => console.log("wow")}>
                ↗ Send
              </label>
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
