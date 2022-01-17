import { FC } from 'react'

export const IdCard: FC = () => {
  return (
    <div className="flex flex-col justify-center items-center text-xl font-light">
      <div className="top">
        <div className="logo">
          vvallet
        </div>
        <div className="info">
          <div className="title">
            ESTEEMED MEMBER
          </div>
          <div className="alias">
            bruce
          </div>
        </div>
      </div>

      <div className="banner">
        TODO
      </div>

      <div className="stats">
        TODO
      </div>

      <div className="qr">
        QR code
      </div>

      <div className="crest">
        vvallet bottom crest of authenticity
      </div>

    </div>
  )
}
