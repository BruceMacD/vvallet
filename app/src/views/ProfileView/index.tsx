import Link from 'next/link'
import Router from 'next/router'
import { FC, useEffect, useMemo, useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { AnchorWallet, useAnchorWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { Provider, Program, Idl, web3 } from '@project-serum/anchor'
import bs58 from 'bs58'

import idl from '../../../../target/idl/vvallet.json' // TODO: this will only work locally
import { generateAliasKey } from 'utils/crypto'
import styles from './index.module.css'

export const ProfileView: FC<{ alias: string }> = ({ alias }) => {
  const [isWaiting, setIsWaiting] = useState(false)
  const wallet: AnchorWallet = useAnchorWallet()!
  const connection = new Connection('http://127.0.0.1:8899')
  const provider = new Provider(connection, wallet, Provider.defaultOptions())
  const programID = new PublicKey(idl.metadata.address)
  // @ts-ignore
  const program = new Program(idl, programID, provider)

  const isRegistered = (pub: PublicKey): boolean => {
    return false
  }

  useMemo(() => {
    if (wallet?.publicKey && !isRegistered(wallet.publicKey)) {
      console.log("redirect to registration")
      // Router.push('/')
    }
  }, [wallet]);

  const airdropToWallet = async () => {
    if (wallet) {
      setIsWaiting(true)
      const signature = await connection.requestAirdrop(wallet.publicKey, 1000000000)

      await connection.confirmTransaction(signature)
      setIsWaiting(false)
    }
  }

  const registerAccount = async () => {
    if (wallet) {
      let alias = 'test'

      let aliasKeys = generateAliasKey(alias)

      await program.rpc.register(alias, {
        accounts: {
          identity: aliasKeys.publicKey,
          owner: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        },
        signers: [aliasKeys], // wallet is automatically added as a signer
      })
    }
  }

  const aliasFilter = (alias: string) => ({
    memcmp: {
      offset:
        8 + // discriminator
        32 + // public key
        4, // alias string prefix
      bytes: bs58.encode(Buffer.from(alias)),
    },
  })

  const fetchIdentities = async () => {
    let filters = [aliasFilter('test')]
    if (wallet) {
      const accounts = await program.account.identity.all(filters)
      console.log(accounts)
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
              {wallet?.publicKey ? (
                <>Your address: {wallet.publicKey.toBase58()}</>
              ) : null}
            </div>
            <div>
              <button className="btn" onClick={airdropToWallet}>
                air drop
              </button>
              <button className="btn" onClick={registerAccount}>
                register "alias"
              </button>
              <button className="btn" onClick={fetchIdentities}>
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
