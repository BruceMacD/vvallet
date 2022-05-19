import Head from 'next/head'
import html from 'remark-html'

import { Params } from 'next/dist/server/router'
import { remark } from 'remark'
import { DocPage, DocSectionMetadata } from 'types/docs'
import { getDocPage, getDocPaths, getDocsMetadata } from 'utils/doc_reader'
import { DocsView } from '../../../views'

type Props = {
  content: string
  page: DocPage
  metadata: DocSectionMetadata[]
}

const Docs = ({ content, page, metadata }: Props) => {
  return (
    <div>
      <Head>
        <title>Documentation | vvallet.me</title>
        <meta name="description" content="vvallet - decentralized proof of identity" />
      </Head>
      <DocsView content={content} page={page} metadata={metadata} />
    </div>
  )
}

export default Docs

export const getStaticProps = async ({ params }: Params) => {
  let page = getDocPage(params.section, params.slug)
  let metadata = getDocsMetadata()

  // need to load html from markdown content here because it is async
  const content = await remark().use(html).process(page.content)

  return {
    props: {
      content: content.toString(),
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
