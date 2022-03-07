import { FC } from 'react'

export const SuccessDisplay: FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex-1">
      {/* TODO: SVG */}
      <label>{message}</label>
    </div>
  )
}
