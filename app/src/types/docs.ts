export type DocPage = {
  content: string
  title: string
}

// metadata to display doc pages in a stable order
export type DocSectionMetadata = {
  name: string
  pages: string[]
}
