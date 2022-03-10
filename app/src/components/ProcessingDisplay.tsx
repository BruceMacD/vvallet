import { FC } from 'react'
import { Loader } from './Loader'

export const ProcessingDisplay: FC = () => {
  return (
    <div className='flex-1'>
      <Loader noText={true} />
      <span className='m-3'>Transaction in progress...</span>
    </div>
  )
}
