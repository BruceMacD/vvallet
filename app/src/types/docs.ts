export type DocPage = {
  content: string
  title: string
}

// metadata to display doc pages in a stable order
export type DocSectionMetadata = {
  name: string
  pages: string[]
}

export function docLink(sectionTitle: string, pageTitle: string, ): string {
    const section = sectionTitle.replace(/\s/g, '-').toLowerCase()
    const page = pageTitle.replace(/\s/g, '-').replace('.', '-').replace('?', '').toLowerCase()

    return '/docs/' + section + '/' + page
}
