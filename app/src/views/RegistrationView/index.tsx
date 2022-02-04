import Link from 'next/link'
import { FC, useMemo, useState } from 'react'
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import styles from './index.module.css'
import {
  airdropToWallet,
  fetchAllIdentities,
  fetchProofsByOwner,
  isKeyRegistered,
  registerAccount,
  registerProof,
  useVVallet,
} from 'lib/VVallet'

export const RegistrationView: FC = () => {
  const [isWaiting, setIsWaiting] = useState(false)
  const wallet = useVVallet()

  const airdrop = async () => {
    if (wallet) {
      setIsWaiting(true)
      await airdropToWallet(wallet)
      setIsWaiting(false)
    }
  }

  const register = async () => {
    if (wallet) {
      setIsWaiting(true)
      await registerAccount(wallet, 'bruce')
      setIsWaiting(false)
    }
  }

  const identities = async () => {
    if (wallet) {
      setIsWaiting(true)
      await fetchAllIdentities(wallet)
      setIsWaiting(false)
    }
  }

  const getProof = async () => {
    if (wallet) {
      setIsWaiting(true)
      // TODO: set these from input
      await fetchProofsByOwner(wallet, wallet.local.publicKey.toBase58())
      setIsWaiting(false)
    }
  }

  if (!wallet) {
    return (
      <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
        <div className={styles.container}></div>
        <div className="text-center">
          <div className="hero min-h-16">
            <div className="text-center hero-content">
              <div className="max-w-lg">
                <Link href="/">
                  <a className="logo text-7xl">vvallet</a>
                </Link>
                <div className="hero-content pt-10">
                  <WalletMultiButton className="btn btn-ghost" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
        <div className={styles.container}>
          <div className="navbar mb-2 shadow-lg text-neutral-content rounded-box">
            <div className="flex-none">
              <WalletDisconnectButton />
            </div>
            <div className="flex-1 px-2 mx-2" />
          </div>
  
          <div className="flex mb-16">
            <div className="mr-4">
              <div>
                {wallet?.local?.publicKey ? (
                  <>Your address: {wallet.local.publicKey.toBase58()}</>
                ) : null}
              </div>
              <div>
                <button className="btn" onClick={airdrop}>
                  air drop
                </button>
                <button className="btn" onClick={register}>
                  register alias "bruce"
                </button>
                <button className="btn" onClick={identities}>
                  get vvallet identities
                </button>
                <button className="btn" onClick={getProof}>
                  get proofs for wallet
                </button>
                <div>
                  {isWaiting ? (
                    <button className="btn btn-lg loading">loading</button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
