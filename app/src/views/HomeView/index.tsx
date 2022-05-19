import Link from 'next/link'
import Router from 'next/router'
import Image from 'next/image'
import { FC, useMemo, useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import styles from './index.module.css'
import { useVVallet } from 'contexts/VVallet'
import { IdentityAlias } from 'types/identityAlias'
import { Footer } from 'components/Footer'
import { fetchKeyIdentities } from 'utils/fetcher'

export const HomeView: FC = ({}) => {
  const app = useVVallet()
  const [walletConnectedOnLoad, setWalletConnectedOnLoad] = useState(app !== undefined)

  useMemo(() => {
    if (app?.connectedWallet?.publicKey && !walletConnectedOnLoad) {
      fetchKeyIdentities(app.connectedWallet.publicKey).then(
        (identities: IdentityAlias[]) => {
          if (identities.length == 0) {
            // they need to register
            Router.push('/register')
          } else {
            Router.push('/im/' + identities[0].alias)
          }
        },
      )
    }
  }, [app])

  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
        <div className="navbar mb-2 shadow-lg text-neutral-content rounded-box">
          <div className="flex-none">
            <span className="logo text-4xl">vvallet</span>
          </div>
          <div className="flex-1 px-2 mx-2" />

          <div className="text-center text-xl grid grid-cols-2 divide-x">
            <Link href="/docs/getting-started/overview">
              <a className="px-2 hover:underline">docs</a>
            </Link>
            <Link href="https://mirror.xyz/bmacd.eth">
              <a className="px-2 hover:underline">blog</a>
            </Link>
          </div>
        </div>

        <div className="text-center">
          <div className="hero min-h-16">
            <div className="text-center hero-content">
              <div className="max-w-lg">
                <h1 className="fancy text-7xl">prove your online identity</h1>
                <div className="hero-content">
                  <video
                    loop
                    autoPlay
                    muted
                    playsInline
                    poster="/spinning_wallet_poster.png"
                  >
                    <source src="/spinning_wallet.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="hero-content">
                  <WalletMultiButton className="btn btn-ghost" />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-24 stats bg-neutral text-primary-content stat">
            <div className="stat bg-neutral">
              <div className="stat-title">Featured Profile</div>
              <div className="stat-value">
                <Link href="/im/bruce">
                  <a className="mb-5 text-2xl font-bold hover:underline">💳 Bruce</a>
                </Link>
              </div>
              <div className="stat-desc">Creator of vvallet.me</div>
            </div>
          </div>

          <div className="inline-block hero-content lg:flex-row mt-24">
            <h1 className="fancy pb-8 text-3xl">
              use your cryptocurrency wallet to link your distributed accounts
            </h1>
            <div className="hero-content">
              <Image
                src="/bidirectrional_identity_diagram.png"
                className="max-w-lg rounded-lg shadow-2xl"
                alt="vvallet.me account connection web"
                width={500}
                height={500}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
