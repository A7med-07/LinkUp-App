import { Button, Input, Select, SelectItem, user } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod';
import { sub } from 'framer-motion/client';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as zod from "zod"

import { signIn } from '../../services/loginApi';

import { Link, useNavigate } from 'react-router-dom';
import { schemaLogin } from '../../schema/SchemaLogin';

import { AuthContext } from '../../context/authContext';

export default function Login() {
 let {setuserToken }= useContext(AuthContext)

 const navigate= useNavigate()

const [apiError, setapiError] = useState(null)
const [isLoading, setisLoading] = useState(false)


let {handleSubmit , register , formState:{errors , touchedFields}}= useForm({
  defaultValues:{
    
   
    email:"",
    password:"",
    

  } ,
  resolver:zodResolver(schemaLogin) ,
  mode:'onBlur' ,
  reValidateMode:'onBlur'
  
})




 async function submitForm(userData){
  setisLoading(true)
  
  console.log('submit' , userData);
// call api 
const response= await signIn (userData)

console.log(response);

if(response.message=='success'){

  // login  => token
  localStorage.setItem('token' , response.token)
  setuserToken(response.token)
  navigate('/home')
}
else{
  // error 
    setapiError(response.error)
}

  
setisLoading(false)

}





  return <>
  <div className="bg-[#1a1f2e] min-h-screen text-center  flex justify-center items-center">

    <div className="w-1/3 m-auto p-5 bg-white shadow rounded-2xl ">
    <h2 className='text-2xl my-4 font-bold text-sky-700'>Login Now </h2>
    <form onSubmit={handleSubmit(submitForm)}  >
   
 <div className="flex flex-col gap-6">
      <Input isInvalid={Boolean(errors.email && touchedFields.email)}  errorMessage={errors.email?.message} {...register('email')} label="Email" type="email" />
       <Input  isInvalid={Boolean(errors.password  && touchedFields.password)} errorMessage={errors.password?.message}  {...register('password')} label="Password" type="password" />
    
 </div>

 {apiError ? <p className='text-red-500 py-2'>{apiError}</p>
:null}

 <Button isLoading={isLoading} type='submit' className='w-full my-4' color="primary" variant="shadow">
        Submit
      </Button>
      <p>Dosn't you have an account ? <Link className='text-sky-600' to='/register'>Sign up</Link></p>

    </form>
    </div>

  </div>


  
  </>
}
