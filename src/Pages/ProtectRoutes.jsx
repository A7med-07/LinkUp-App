import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectRoutes({children}) {

    if(localStorage.getItem('token')!=null){
        // leh token => home 
        return children 
    }else{
       return <Navigate to='/' />
    }
 
}
