import { Params } from 'next/dist/server/router'
import Head from 'next/head'
import { DocPage, DocSectionMetadata } from 'types/docs'
import { getDocPage, getDocPaths, getDocsMetadata } from 'utils/doc_reader'
import { DocsView } from '../../../views'

type Props = {
  page: DocPage
  metadata: DocSectionMetadata[]
}

const Docs = ({ page, metadata }: Props) => {
  return (
    <div>
      <Head>
        <title>Documentation | vvallet.me</title>
        <meta name="description" content="vvallet - decentralized proof of identity" />
      </Head>
      <DocsView page={page} metadata={metadata} />
    </div>
  )
}

export default Docs

export const getStaticProps = async ({ params }: Params) => {
  let page = getDocPage(params.section, params.slug)
  let metadata = getDocsMetadata()

  return {
    props: {
      page: page,
      metadata: metadata,
    },
  }
}

export const getStaticPaths = async () => {
  let docPages = getDocPaths()

  return {
    paths: docPages,
    fallback: false,
  }
}
