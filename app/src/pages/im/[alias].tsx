import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { SolanaTweeterView } from "../../views";

const Profile: NextPage = (props) => {
  const router = useRouter()
  const { alias } = router.query
  
  return (
    <div>
      <Head>
        <title>{alias}</title>
        <meta name="description" content="vvallet - decentralized proof of identity" />
      </Head>
      <SolanaTweeterView />
    </div>
  );
};

export default Profile;
