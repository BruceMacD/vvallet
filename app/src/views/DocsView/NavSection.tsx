import { FC } from "react"
import { docLink, DocSectionMetadata } from "types/docs"

const NavSectionPage: FC<{ name: string, link: string, activePage: string }> = ({ name, link, activePage }) => {
    let className = name === activePage ? 'active' : ''

    return (
        <li key={name}>
            {/* TODO: link, active */}
            <a className={className} href={link} >{name}</a>
        </li>
    )
}

export const NavSection: FC<{ sectionMetadata: DocSectionMetadata, activePage: string }> = ({ sectionMetadata, activePage }) => {
    const navPages: JSX.Element[] = sectionMetadata.pages.map(page => <NavSectionPage name={page} link={docLink(sectionMetadata.name, page)} activePage={activePage} />)
    return (
        <>
            <li className="menu-title" key={sectionMetadata.name}>
                <span>{sectionMetadata.name}</span>
            </li>
            {navPages}
        </>
    )
}