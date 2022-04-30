import { FC } from "react"
import { DocSectionMetadata } from "types/docs"

const NavSectionPage: FC<{ name: string }> = ({ name }) => {
    return (
        <li key={name}>
            {/* TODO: link, active */}
            <a>{name}</a>
        </li>
    )
}

export const NavSection: FC<{ sectionMetadata: DocSectionMetadata }> = ({ sectionMetadata }) => {
    const navPages: JSX.Element[] = sectionMetadata.pages.map(page => <NavSectionPage name={page} />)

    return (
        <>
            <li className="menu-title" key={sectionMetadata.name}>
                <span>{sectionMetadata.name}</span>
            </li>
            {navPages}
        </>
    )
}