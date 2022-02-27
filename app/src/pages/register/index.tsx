import type { NextPage } from 'next'
import Head from 'next/head'
import { RegistrationView } from '../../views'

const Register: NextPage = props => {
  return (
    <div>
      <Head>
        <title>Register | vvallet.me</title>
        <meta name="description" content="vvallet - decentralized proof of identity" />
      </Head>
      <RegistrationView />
    </div>
  )
}

export default Register
