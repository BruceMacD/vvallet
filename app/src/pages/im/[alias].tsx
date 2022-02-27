import type { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import { ProfileView } from '../../views'

const Profile: NextPage = props => {
  const router = useRouter()
  const query = router.query['alias']
  const alias: string = query as string

  return (
    <div>
      <Head>
        <title>{query} | vvallet.me</title>
        <meta name="description" content="vvallet.me - decentralized proof of identity" />
      </Head>
      <ProfileView alias={alias} />
    </div>
  )
}

export default Profile
