import Link from 'next/link'
import Router from 'next/router'
import Image from 'next/image'
import { FC, useMemo } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import styles from './index.module.css'
import { isKeyRegistered, useVVallet } from 'contexts/VVallet'

export const HomeView: FC = ({}) => {
  const app = useVVallet()

  useMemo(() => {
    if (app?.connectedWallet?.publicKey) {
      isKeyRegistered(app, app.connectedWallet.publicKey).then((registered: boolean) => {
        if (!registered) {
          Router.push('/register')
        }
      })
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
            <div className="px-2">docs</div>
            <div className="px-2">blog</div>
          </div>
        </div>

        <div className="text-center">
          <div className="hero min-h-16">
            <div className="text-center hero-content">
              <div className="max-w-lg">
                <h1 className="fancy text-7xl">prove your online identity</h1>
                <div className="hero-content">
                  <video loop autoPlay muted poster="/spinning_wallet_poster.png">
                    <source src="/spinning_wallet.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="hero-content">
                  <WalletMultiButton className="btn btn-ghost" />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-24 stats bg-neutral text-primary-content stat w-96">
            <div className="stat bg-neutral">
              <div className="stat-title">featured profile</div>
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
              <img
                src="/bidirectrional_identity_diagram.png"
                className="max-w-lg rounded-lg shadow-2xl"
                alt="vvallet.me account connection web"
              />
            </div>
          </div>
        </div>
      </div>

      <footer className="footer px-10 py-4 border-t bg-base-200 text-base-content border-base-300 mt-6">
        <div className="items-center grid-flow-col">
          <p>Trust0 HQ © {(new Date().getFullYear())}</p>
        </div>
        <div className="md:place-self-center md:justify-self-end">
          <div className="grid grid-flow-col gap-4">
            <a href="https://twitter.com/vvalletdotme">
              <svg
                fill="none"
                className="inline-block w-6 h-6 mr-2 stroke-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                />
              </svg>
            </a>
            <a href="https://github.com/trust0hq/vvallet">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24"
                fill='white'
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
