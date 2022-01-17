import Link from 'next/link'
import { FC } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

import styles from './index.module.css'

export const HomeView: FC = ({}) => {
  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
        <div className="navbar mb-2 shadow-lg text-neutral-content rounded-box">
          <div className="flex-none">
            <button className="btn btn-square btn-ghost">
              <span className="logo text-4xl">vvallet</span>
            </button>
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
                  <video loop autoPlay muted>
                    <source src="/placeholder.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="hero-content pt-0">
                  <WalletMultiButton className="btn btn-ghost" />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h1 className="fancy mb-5 pb-8 text-4xl pt-24">featured</h1>
            <ul className="text-center leading-10">
              <li>
                <Link href="/im/bruce">
                  <a className="mb-5 text-2xl font-bold hover:underline">👤 Bruce</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
