import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Connection, LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import { SolanaLogo } from "components";
import React, { FC, useCallback } from "react";

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
    <input type="checkbox" id="add-proof-modal" className="modal-toggle" disabled={true}/>
    <div className="modal">
      <div className="modal-box">
        Coming soon
      </div>
    </div>
  </div>
  );
};
