import { FC } from 'react'
import { IdentityAlias } from 'types/identityAlias'

export const IdCard: FC<{ identity: IdentityAlias }> = ({ identity }) => {
  return (
    <div className="flex w-auto space-x-10 flex-nowrap">
      <div className="animate-linger artboard phone-1 id-card overflow-hidden">
          <div className="m-4 text-4xl">
            <span className="fancy">vvallet</span>
          </div>
          {/* <div className="fancy ml-2 mt-2 text-3xl">vvallet</div>
          <div className="info">
            <div className="title">ESTEEMED MEMBER</div>
            <div className="alias">{identity.alias}</div>
          </div> */}
          <div className="w-32 h-32">
            <img src="/qr-code.png" />
          </div>
          <div className="card-stripe card-font	h-16 rounded-tr-2xl absolute ml-80 left-0 bottom-0 origin-bottom-left -rotate-90">
            <div className="badge h-6 ml-20 mr-20 mt-5">{identity.owner}</div> 
          </div>
        </div> 
      </div>
      
    // <div className="flex flex-col justify-center items-center text-xl font-light">
    //   <div className="top">
    //     <div className="logo">vvallet</div>
    //     <div className="info">
    //       <div className="title">ESTEEMED MEMBER</div>
    //       <div className="alias">{identity.alias}</div>
    //     </div>
    //   </div>

    //   <div className="banner">TODO</div>

    //   <div className="key">{identity.owner}</div>

    //   <div className="stats">TODO</div>

    //   <div className="qr">QR code</div>

    //   <div className="crest">vvallet bottom crest of authenticity</div>
    // </div>
  )
}
