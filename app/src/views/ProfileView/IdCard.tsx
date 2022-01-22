import { FC } from 'react'
import { IdentityAlias } from 'types/identityAlias'

export const IdCard: FC<{ identity: IdentityAlias }> = ({ identity }) => {
  return (
    <div className="flex flex-col justify-center items-center text-xl font-light">
      <div className="top">
        <div className="logo">vvallet</div>
        <div className="info">
          <div className="title">ESTEEMED MEMBER</div>
          <div className="alias">{identity.alias}</div>
        </div>
      </div>

      <div className="banner">TODO</div>

      <div className="key">{identity.owner}</div>

      <div className="stats">TODO</div>

      <div className="qr">QR code</div>

      <div className="crest">vvallet bottom crest of authenticity</div>
    </div>
  )
}
