import Link from 'next/link'
import Router from 'next/router'
import { FC, useMemo } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import styles from './index.module.css'
import { useVVallet } from 'contexts/VVallet'
import { fetchKeyIdentities, useIdentity } from 'utils/fetcher'
import { Proofs } from './proofs'
import { IdCard, Loader } from 'components'
import { AddProof } from './addProof'
import { Footer } from 'components/Footer'
import { IdentityAlias } from 'types/identityAlias'

export const ProfileView: FC<{ alias: string }> = ({ alias }) => {
  const { identity, isLoading, error } = useIdentity(alias)
  const app = useVVallet()

  useMemo(() => {
    if (app?.connectedWallet?.publicKey) {
      fetchKeyIdentities(app.connectedWallet.publicKey).then((identities: IdentityAlias[]) => {
        if (identities.length == 0) {
          // they need to register
          Router.push('/register')
        }
      })
    }
  }, [app])

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

          <div className="flex flex-wrap mt-16">
            <div>
              <IdCard identity={identity} registration={false} />
            </div>

            <div className="md:ml-24">
              {app?.connectedWallet?.publicKey &&
              identity.owner == app.connectedWallet.publicKey.toBase58() ? (
                <AddProof app={app} identity={identity} />
              ) : null}
              <Proofs identity={identity} />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
}
