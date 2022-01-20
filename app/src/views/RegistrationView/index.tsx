import Link from 'next/link'
import { FC, useMemo, useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import styles from './index.module.css'
import {
  airdropToWallet,
  fetchAllIdentities,
  isKeyRegistered,
  registerAccount,
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

  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
        <div className="navbar mb-2 shadow-lg text-neutral-content rounded-box">
          <div className="flex-none">
            <Link href="/">
              <a className="logo text-4xl">vvallet</a>
            </Link>
          </div>
          <div className="flex-1 px-2 mx-2" />

          <div className="flex-none">
            <WalletMultiButton className="btn btn-ghost" />
          </div>
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
                register "alias"
              </button>
              <button className="btn" onClick={identities}>
                get vvallet identities
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
