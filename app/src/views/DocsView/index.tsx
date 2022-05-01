import Link from 'next/link'

import styles from './index.module.css'
import { DocPage, DocSectionMetadata } from 'types/docs'
import { NavSection } from './NavSection'
import { Footer } from 'components/Footer'

type Props = {
  content: string
  page: DocPage
  metadata: DocSectionMetadata[]
}

export const DocsView = ({ content, page, metadata }: Props) => {

  const navDisplay: JSX.Element[] = metadata.map(section => <NavSection sectionMetadata={section} activePage={page.title} />)

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
        </div>
      </div>

      <div className="flex flex-wrap">
        <ul className="menu bg-base-100 w-2/6 p-2 rounded-box" key="nav">
          {navDisplay}
        </ul>

        <div className="card w-4/6 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{page?.title}</h2>
            <div className={styles['markdown']} dangerouslySetInnerHTML={{ __html: content }}/>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
