import Link from 'next/link'
import Router from 'next/router'
import { FC, useMemo, useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import styles from './index.module.css'
import { isKeyRegistered, registerProof, useVVallet } from 'lib/VVallet'
import { IdCard } from './idCard'
import { useIdentity } from 'utils/fetcher'
import { Proofs } from './proofs'

export const ProfileView: FC<{ alias: string }> = ({ alias }) => {
  const { identity, isLoading, error } = useIdentity(alias)
  const [isWaiting, setIsWaiting] = useState(false)
  const wallet = useVVallet()

  useMemo(() => {
    if (wallet?.local?.publicKey && !isKeyRegistered(wallet.local.publicKey)) {
      Router.push('/register')
    }
  }, [wallet])

  const addProof = async () => {
    if (wallet) {
      setIsWaiting(true)
      // TODO: set these from input
      await registerProof(wallet, 'twitter', 'https://twitter.com/vvalletdotme/status/1488510691359268870')
      setIsWaiting(false)
    }
  }

  if (isLoading)
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

          <div className="hero min-h-screen">
            <div className="text-center hero-content">
              <div className="max-w-md">
                <h1 className="mb-5 text-5xl">💽</h1>
                <button className="btn btn-lg loading">loading</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  else if (error) {
    console.log(error)
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

          <div className="hero min-h-screen">
            <div className="text-center hero-content">
              <div className="max-w-md">
                <h1 className="mb-5 text-5xl">💽</h1>
                <h1 className="mb-5 text-3xl">identity not found</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  else
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
            </div>
          </div>

          <div className="flex flex-row">
            <div className="basis-1/2">
              <IdCard identity={identity} />
            </div>

            <div className="basis-1/2 ml-4">
              {wallet?.local?.publicKey && identity.owner == wallet.local.publicKey.toBase58() ? (
                  <div>
                    <button className="btn btn-outline btn-accent border-base-300 w-96" onClick={addProof}>
                      + add a proof
                    </button>
                    <div>
                      {isWaiting ? (
                        <button className="btn btn-lg loading">loading</button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              <Proofs identity={identity} />
            </div>
          </div>
        </div>
      </div>
    )
}
