import { FC, useState } from 'react'
import Image from 'next/image'
import Router from 'next/router'

import { SolanaLogo, SuccessDisplay } from 'components'
import { registerAccount, useVVallet } from 'contexts/VVallet'
import { IdentityAlias } from 'types/identityAlias'
import { fetchAliasIdentity, fetchKeyIdentities } from 'utils/fetcher'
import { waitUntilTrue } from 'utils/timer'

export const IdCard: FC<{ identity: IdentityAlias; registration: boolean }> = ({
  identity,
  registration,
}) => {
  const URL_SAFE_CHARS = "^[A-Za-z0-9._ ~()'!*:@,;+-]*$"

  const [isWaiting, setIsWaiting] = useState(false)
  const [alias, setAlias] = useState('')
  const [disableRegistration, setDisableRegistration] = useState(true)
  const [disableAliasInput, setDisableAliasInput] = useState(false)
  const [aliasMessage, setAliasMessage] = useState('Please enter an alias')
  const [aliasPlaceholder, setAliasPlaceholder] = useState('alias')
  const [errMsg, setErrMsg] = useState('')
  const [confirmationMsg, setConfirmationMsg] = useState('')

  const app = useVVallet()

  const cardStyling = (): string => {
    if (registration) {
      return 'artboard phone-1 id-card overflow-hidden'
    }

    return 'animate-linger artboard phone-1 id-card overflow-hidden'
  }

  const qrStyle = {
    backgroundImage: 'url(/placeholder_card_background.png)',
    backgroundSize: 'cover',
  }

  const memberAliasStyling = (): string => {
    let len = identity.alias.length

    switch (true) {
      case len > 43:
        return 'text-[0.35rem] ml-12  mr-4 mt-4 mt-0'
      case len > 40:
        return 'text-[0.4rem] ml-12 mt-4 mr-4 mt-0'
      case len > 35:
        return 'text-[0.45rem] ml-12 mt-4 mr-4 mt-0'
      case len > 30:
        return 'text-[0.5rem] ml-12 mt-4 mr-4 mt-0'
      case len > 25:
        return 'text-[0.6rem] ml-12 mt-4 mr-4 mt-0'
      case len > 20:
        return 'text-[0.75rem] ml-12 mt-4 mr-4 mt-0'
      case len > 15:
        return 'text-[0.95rem] ml-12 mt-4 mr-4 mt-0'
    }

    return 'text-[1.3rem] ml-12 mt-4 mr-4 mt-0'
  }

  // start registration functions

  const register = async () => {
    if (app) {
      setDisableRegistration(true)
      setIsWaiting(true)
      await registerAccount(app, alias).catch((err: Error) => {
        setErrMsg(err.message)
      })

      const aliasRegistered = async (): Promise<boolean> => {
        let isRegistered = false
        await fetchAliasIdentity(alias)
          .then(() => {
            // if it doesn't exist an error would have been thrown
            isRegistered = true
          })
          .catch((err: Error) => {
            console.log(err)
          })
        return isRegistered
      }

      waitUntilTrue(aliasRegistered).then(() => {
        setIsWaiting(false)
        setConfirmationMsg('Success, your alias has been recorded.')
      })
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

    const validChars = inputAlias.match(URL_SAFE_CHARS)
    if (validChars === null || validChars.length !== 1) {
      // contains characters which are not URL safe
      setAliasMessage('Alias contains invalid characters')
      setDisableRegistration(true)
      return
    }

    try {
      await fetchAliasIdentity(inputAlias)
      // if the response is not nil, this alias is registered
      setAliasMessage('This alias is already claimed')
      setDisableRegistration(true)
      return
    } catch (err: any) {
      // this alias has not been registered yet, this is fine
      console.log(err)
    }

    if (app) {
      fetchKeyIdentities(app.connectedWallet.publicKey).then(
        (identities: IdentityAlias[]) => {
          if (identities.length != 0) {
            setAliasPlaceholder(identities[0].alias)
            setAliasMessage("You're already registered")
            setDisableAliasInput(true)
            setDisableRegistration(true)
            return
          }
        },
      )

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
    updateAliasValidation(inputAlias)
  }

  if (app && registration) {
    // check if this wallet is already registered
    // if they are, don't let them register again
    fetchKeyIdentities(app.connectedWallet.publicKey).then(
      (identities: IdentityAlias[]) => {
        if (identities.length > 0) {
          // assume they only have one alias registed in this case
          let id = identities[0]
          setAliasPlaceholder(id.alias)
          setAliasMessage("You're already registered")
          setDisableAliasInput(true)
          setDisableRegistration(true)
        }
      },
    )
  }

  // end registration functions

  return (
    <div className="text-left">
      <div className="hero">
        <div className={cardStyling()}>
          <div className="m-4 mt-8 text-5xl">
            <span className="fancy">vvallet</span>
          </div>

          <div style={qrStyle} className="w-64 h-64">
            <div className="w-32 h-32 ml-16 pt-16">
              <Image
                src="/qr-code.png"
                alt="vvallet.me QR code"
                width={500}
                height={500}
              />
            </div>
          </div>

          <div className="ml-4 mt-4 pb-1 underline card-body">member</div>
          {registration ? (
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
          ) : (
            <div className={memberAliasStyling()}>{identity.alias}</div>
          )}
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
              {identity.owner}
            </div>
          </div>
        </div>
      </div>
      {registration && (
        <div>
          <button
            className="btn btn-primary btn-accent border-base-300 mt-3 flex items-center mx-auto"
            disabled={disableRegistration}
            onClick={register}
          >
            register now
          </button>
          {isWaiting && (
            <button className="btn btn-primary btn-accent border-base-300 mt-3 loading flex items-center mx-auto" />
          )}
          {errMsg != '' && (
            <div className="alert alert-error w-80 mt-3">
              <div className="flex-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 mx-2 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  ></path>
                </svg>
                <label>{errMsg}</label>
              </div>
              <button className="btn btn-outline" onClick={() => setErrMsg('')}>
                ok
              </button>
            </div>
          )}
          {confirmationMsg != '' && (
            <div className="alert alert-success w-96">
              <SuccessDisplay message={confirmationMsg} />
              <button
                className="btn btn-outline ml-1"
                onClick={() => Router.push('/im/' + alias)}
              >
                ok
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
