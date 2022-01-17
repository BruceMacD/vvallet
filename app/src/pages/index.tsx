import type { NextPage } from 'next'
import Head from 'next/head'
import { HomeView } from '../views'

const Home: NextPage = props => {
  return (
    <div>
      <link
        rel="preload"
        href="/fonts/Quinlliyk/Quinlliyk.ttf"
        as="font"
        crossOrigin=""
      />
      <Head>
        <title>vvallet</title>
        <meta name="description" content="vvallet - decentralized proof of identity" />
      </Head>
      <HomeView />
    </div>
  )
}

export default Home
