import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function AdminPrivateWrapper({children}) {

    const userRole = useSelector((state)=>state.user.role)

    if(userRole === 'admin'){
        return (
          <>
              {children}
          </>
        )


    }else{
        return <Navigate to={'*'} />
    }
    
}
