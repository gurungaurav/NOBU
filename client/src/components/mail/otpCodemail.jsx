import React from 'react'
import { useParams } from 'react-router-dom'

export default function OtpCodemail() {

    const code = useParams()

  return (
    <>
        <div>
            <p>{code.otp}</p>
        </div>
      
    </>
  )
}
