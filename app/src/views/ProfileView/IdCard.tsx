import { FC } from 'react'
import { IdentityAlias } from 'types/identityAlias'

export const IdCard: FC<{ identity: IdentityAlias }> = ({ identity }) => {

  const memberAliasStyling = (): string => {
    let len = identity.alias.length

    switch (true) {
      case (len > 43):
        return 'text-[0.35rem] ml-12  mr-4 mt-4 mt-0'
      case (len > 40):
        return 'text-[0.4rem] ml-12 mt-4 mr-4 mt-0'
      case (len > 35):
        return 'text-[0.45rem] ml-12 mt-4 mr-4 mt-0'
      case (len > 30):
        return 'text-[0.5rem] ml-12 mt-4 mr-4 mt-0'
      case (len > 25):
        return 'text-[0.6rem] ml-12 mt-4 mr-4 mt-0'
      case (len > 20):
        return 'text-[0.75rem] ml-12 mt-4 mr-4 mt-0'
      case (len > 15):
        return 'text-[0.95rem] ml-12 mt-4 mr-4 mt-0'
    }

    return 'text-[1.3rem] ml-12 mt-4 mr-4 mt-0'
  }

  return (
    <div className="flex w-auto space-x-10 flex-nowrap">
      <div className="animate-linger artboard phone-1 id-card overflow-hidden">
          <div className="m-4 mt-8 text-5xl">
            <span className="fancy">vvallet</span>
          </div>
          <div className="w-64 h-64">
            <img src="/placeholder_card_background.png" />
          </div>
          <div className="w-32 h-32 ml-16 -mt-48">
            <img src="/qr-code.png" />
          </div>
          <div className="mt-16 ml-4 pb-1 underline card-body">
            member
          </div>
          <div className={memberAliasStyling()}>
              {identity.alias}
          </div>
          <div className="card-stripe card-key-font	h-16 rounded-tr-2xl absolute ml-80 left-0 bottom-0 origin-bottom-left -rotate-90">
            <div className="badge h-6 ml-12 mr-12 mt-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              {identity.owner}
            </div> 
          </div>
        </div> 
      </div>
  )
}
