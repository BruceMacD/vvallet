import Link from 'next/link'
import { FC } from 'react'
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'

import styles from './index.module.css'
import { useVVallet } from 'contexts/VVallet'
import { IdCard } from 'components'
import { IdentityAlias } from 'types/identityAlias'

export const RegistrationView: FC = () => {
  const app = useVVallet()

  if (!app) {
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
  }

  const idAlias: IdentityAlias = {
    owner: app.connectedWallet.publicKey.toBase58(),
    alias: '',
  }

  return (
    <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
      <div className={styles.container}>
        <div className="text-center content-center">
          <div className="hero min-h-16">
            <div className="hero-content">
              <div className="max-w-lg">
                <span className="logo text-7xl">vvallet</span>
                <div className="hero-content pt-10">
                  <WalletDisconnectButton />
                </div>
                <IdCard identity={idAlias} registration={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
