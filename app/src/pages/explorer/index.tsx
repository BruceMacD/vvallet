import type { NextPage } from 'next'
import Head from 'next/head'
import { ExplorerView } from '../../views'

// Explorer is currently only for running debug queries against the deployed program
const Explorer: NextPage = props => {
  return (
    <div>
      <Head>
        <title>Explorer | vvallet.me</title>
        <meta name="description" content="vvallet - decentralized proof of identity" />
      </Head>
      <ExplorerView />
    </div>
  )
}

export default Explorer
