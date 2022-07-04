import Link from 'next/link'
import Router from 'next/router'
import { FC, useMemo, useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import styles from './index.module.css'
import { useVVallet } from 'contexts/VVallet'
import { fetchKeyIdentities, useIdentity } from 'utils/fetcher'
import { Proofs } from './proofs'
import { IdCard, Loader } from 'components'
import { AddProof } from './addProof'
import { Footer } from 'components/Footer'
import { IdentityAlias } from 'types/identityAlias'
import { Send } from './send'

export const ProfileView: FC<{ alias: string }> = ({ alias }) => {
  const { identity, isLoading, error } = useIdentity(alias)
  const [isCopied, setIsCopied] = useState(false)
  const app = useVVallet()

  useMemo(() => {
    if (app?.connectedWallet?.publicKey) {
      fetchKeyIdentities(app.connectedWallet.publicKey).then(
        (identities: IdentityAlias[]) => {
          if (identities.length == 0) {
            // they need to register
            Router.push('/register')
          }
        },
      )
    }
  }, [app])

  const copyKeyToClipboard = () => {
    navigator.clipboard.writeText(identity.owner)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 3000)
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
              <Loader />
            </div>
          </div>
        </div>

        <Footer />
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

        <Footer />
      </div>
    )
  } else
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

          <div className="flex flex-wrap mt-4">
            <div>
              <IdCard identity={identity} registration={false} />
              <div className="card-body pb-0">
                <div className="btn w-80" onClick={copyKeyToClipboard}>
                  {identity.owner.slice(0, 6)}...{identity.owner.slice(identity.owner.length - 6, identity.owner.length)}
                  {!isCopied &&
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-1"
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
                  }
                  {isCopied && <span className="badge-xs ml-1">copied!</span>}
                </div>
                {/* {app?.connectedWallet?.publicKey &&
                  identity.owner !== app.connectedWallet.publicKey.toBase58() &&
                  <Send sendToAddress={identity.owner} />
                }
                {!app?.connectedWallet?.publicKey &&
                  <button className="btn btn-outline btn-accent border-base-300 w-80 mt-0" disabled={true}>
                    ↗ Send payment
                  </button>
                } */}
              </div>
            </div>

            <div className="md:ml-24">
              {app?.connectedWallet?.publicKey &&
                identity.owner == app.connectedWallet.publicKey.toBase58() &&
                <AddProof app={app} identity={identity} />
              }
              <Proofs identity={identity} />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
}
