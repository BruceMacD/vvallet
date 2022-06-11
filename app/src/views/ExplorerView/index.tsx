import Link from 'next/link'
import { FC } from 'react'

import styles from './index.module.css'
import { useVVallet } from 'contexts/VVallet'
import { Footer } from 'components/Footer'
import { fetchAllIdentities } from 'utils/fetcher'

export const ExplorerView: FC = ({}) => {
  const logAllIdentities = async () => {
    let identities = await fetchAllIdentities().catch((err: Error) => {
      console.log(err)
    })

    console.log(identities)
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

          <div className="text-center text-xl grid grid-cols-2 divide-x">
            <Link href="/docs/getting-started/overview">
              <a className="px-2 hover:underline">docs</a>
            </Link>
            <Link href="https://mirror.xyz/myvvallet.eth">
              <a className="px-2 hover:underline">blog</a>
            </Link>
          </div>
        </div>

        <div className="text-center">
          <div className="alert alert-info shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current flex-shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span className="ml-2">
                This is a top-secret page. Keep it between us, ok?
              </span>
            </div>
          </div>
          <button className="btn mt-2" onClick={logAllIdentities}>
            Log All Identities
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
