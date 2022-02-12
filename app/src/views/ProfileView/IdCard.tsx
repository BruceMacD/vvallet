import { FC } from 'react'
import { IdentityAlias } from 'types/identityAlias'

export const IdCard: FC<{ identity: IdentityAlias }> = ({ identity }) => {
  return (
    <div className="flex w-auto space-x-10 flex-nowrap">
      <div className="animate-linger artboard phone-1 id-card overflow-hidden">
          <div className="m-4 mt-8 text-5xl">
            <span className="fancy">vvallet</span>
          </div>
          {/* <div className="fancy ml-2 mt-2 text-3xl">vvallet</div>
          <div className="info">
            <div className="title">ESTEEMED MEMBER</div>
            <div className="alias">{identity.alias}</div>
          </div> */}
          <div className="w-64 h-64">
            <img src="/placeholder_card_background.png" />
          </div>
          <div className="w-32 h-32 ml-16 -mt-48">
            <img src="/qr-code.png" />
          </div>
          <div className="mt-16 ml-4 card-body">
            <div className="underline">
              member
            </div>
            <div className='text-sm'>
              {/* {identity.alias} */}
              PNEUMONOULTRAMICROSCOPICSILICOVOLCANOCONIOSIS
            </div>
          </div>
          <div className="card-stripe card-key-font	h-16 rounded-tr-2xl absolute ml-80 left-0 bottom-0 origin-bottom-left -rotate-90">
            <div className="badge h-6 ml-12 mr-12 mt-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              {identity.owner}
            </div> 
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
