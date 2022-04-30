import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import { DocPage, DocSectionMetadata } from 'types/docs'

const docsDirectory = path.join(process.cwd(), './public/docs')

function readDocSections(): string[] {
  // read the directory structure in the docs folder
  // each directory is a docs section
  // files in the root docs directory are ignored
  let docSections: string[] = []

  const docDirContents = fs.readdirSync(docsDirectory)

  docDirContents.forEach(item => {
    let maybeDir = path.join(docsDirectory, item)
    if (fs.statSync(maybeDir).isDirectory()) {
      docSections.push(item)
    }
  })

  return docSections
}

function readSectionPages(sections: string[]): string[] {
  let sectionPages: string[] = []

  sections.forEach(section => {
    let sectionPath = path.join(docsDirectory, section)
    const pages = fs.readdirSync(sectionPath)

    pages.forEach(page => {
      // the dir path and the page name with the '.md' extension removed
      sectionPages.push('/' + path.join('docs', section, page.slice(0, -3)))
    })
  })

  return sectionPages
}

function readDocPage(docPath: string): DocPage {
  const fileContents = fs.readFileSync(docPath, 'utf8')
  const matterResult = matter(fileContents)

  return {
    content: matterResult.content,
    title: matterResult.data.title,
  }
}

export function getDocsMetadata(): DocSectionMetadata[] {
  const metadata = fs.readFileSync(path.join(docsDirectory, 'metadata.json'), 'utf8')
  return JSON.parse(metadata)
}

// getDocPaths parses the docs directory to convert the doc files into addressable paths
export function getDocPaths(): string[] {
  let sections = readDocSections()
  return readSectionPages(sections)
}

// getDocPage loads the doc page at a path
export function getDocPage(section: string, page: string): DocPage {
  return readDocPage(path.join(docsDirectory, section, page + '.md'))
}
