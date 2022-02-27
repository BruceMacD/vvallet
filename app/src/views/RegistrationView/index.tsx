import Link from 'next/link'
import { FC, useState } from 'react'
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'

import styles from './index.module.css'
import { fetchIdentitiesByOwner, isAliasRegistered, isKeyRegistered, registerAccount, useVVallet } from 'contexts/VVallet'
import { SolanaLogo } from 'components'
import { IdentityAlias } from 'types/identityAlias'

export const RegistrationView: FC = () => {
  const [isWaiting, setIsWaiting] = useState(false)
  const [alias, setAlias] = useState('')
  const [disableRegistration, setDisableRegistration] = useState(true)
  const [disableAliasInput, setDisableAliasInput] = useState(false)
  const [aliasMessage, setAliasMessage] = useState('Please enter an alias')
  const [aliasPlaceholder, setAliasPlaceholder] = useState('alias')
  const app = useVVallet()

  const register = async () => {
    if (app) {
      setIsWaiting(true)
      await registerAccount(app, alias)
      setIsWaiting(false)
    }
  }

  const updateAliasValidation = async (inputAlias: string) => {
    if (inputAlias === '') {
      setAliasMessage('Please enter an alias')
      setDisableRegistration(true)
      return
    }

    if (inputAlias.length > 50) {
      setAliasMessage('Alias must be less than 50 characters')
      setDisableRegistration(true)
      return
    }

    if (app) {
      isAliasRegistered(app, inputAlias).then((registered: boolean) => {
        if (registered) {
          setAliasMessage('This alias is already claimed')
          setDisableRegistration(true)
          return
        }
      })

      setAliasMessage('This alias is available')
      setDisableRegistration(false)
      return
    }

    setAliasMessage('Please select an alias')
    setDisableRegistration(true)
  }

  const validateAndSetAlias = (e: React.FormEvent<HTMLInputElement>) => {
    const inputAlias = e.currentTarget.value.trim()
    setAlias(inputAlias)
    console.log(inputAlias)
    updateAliasValidation(inputAlias)
  }

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
  } else {
    if (app) {
      // check if this wallet is already registered
      // if they are don't let them register again
      isKeyRegistered(app, app.connectedWallet.publicKey).then((registered: boolean) => {
        if (registered) {
          fetchIdentitiesByOwner(app, app.connectedWallet.publicKey.toBase58())
            .then((identities: IdentityAlias[]) => {
              // assume they only have one alias registed in this case
              let id = identities[0]
              setAliasPlaceholder(id.alias)
              setAliasMessage("You're already registered")
              setDisableAliasInput(true)
              setDisableRegistration(true)
            })
        }
      })
    }

    return (
      <div className="container mx-auto max-w-6xl p-8 2xl:px-0">
        <div className={styles.container}>
          <div className="text-center">
            <div className="hero min-h-16">
              <div className="hero-content">
                <div className="max-w-lg">
                  <span className="logo text-7xl">vvallet</span>
                  <div className="hero-content pt-10">
                    <WalletDisconnectButton />
                  </div>
                  <div className="flex w-auto space-x-10 flex-nowrap">
                    <div className="artboard phone-1 id-card overflow-hidden">
                      <div className="m-4 mt-8 text-5xl text-left">
                        <span className="fancy">vvallet</span>
                      </div>
                      <div className="w-64 h-64">
                        <img src="/placeholder_card_background.png" />
                      </div>
                      <div className="w-32 h-32 ml-16 -mt-48">
                        <img src="/qr-code.png" />
                      </div>
                      <div className="mt-16 ml-4 pb-1 underline card-body text-left">
                        member
                      </div>
                      <div className="form-control ml-3">
                        <input
                          type="text"
                          placeholder={aliasPlaceholder}
                          className="input input-info input-bordered w-56 mt-3"
                          disabled={disableAliasInput}
                          onChange={validateAndSetAlias}
                        />
                        <label className="label">
                          <span className="label-text-alt">{aliasMessage}</span>
                        </label>
                      </div>
                      <div className="absolute left-2 bottom-4 w-4 h-4 opacity-75">
                        <SolanaLogo />
                      </div>
                      <div className="card-stripe card-key-font	h-16 rounded-tr-2xl absolute ml-80 left-0 bottom-0 origin-bottom-left -rotate-90">
                        <div className="badge h-6 ml-12 mr-12 mt-5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1"
                              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                          </svg>
                          {app.connectedWallet.publicKey.toBase58()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {isWaiting ? (
                      <button className="btn btn-primary btn-accent border-base-300 mt-3 loading" />
                    ) : (
                      <button
                        className="btn btn-primary btn-accent border-base-300 mt-3"
                        disabled={disableRegistration}
                        onClick={register}
                      >
                        register now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
