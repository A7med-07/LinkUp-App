import { Button, Input, Select, SelectItem, user } from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod';
import { sub } from 'framer-motion/client';
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as zod from "zod"
import { schema } from '../../schema/RegisterSchema';
import { signUp } from '../../services/registerApi';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {

 const navigate= useNavigate()

const [apiError, setapiError] = useState(null)
const [isLoading, setisLoading] = useState(false)


let {handleSubmit , register , formState:{errors , touchedFields}}= useForm({
  defaultValues:{
    
    name: '',
    email:"",
    password:"",
    rePassword:"",
    dateOfBirth:"",
    gender:""

  } ,
  resolver:zodResolver(schema) ,
  mode:'onBlur' ,
  reValidateMode:'onBlur'
  
})




 async function submitForm(userData){
  setisLoading(true)
  
  console.log('submit' , userData);
// call api 
const response= await signUp(userData)

console.log(response);

if(response.message=='success'){
  // login  => token
  navigate('/')
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
    <h2 className='text-2xl my-4 font-bold text-sky-700'>Register Now </h2>
    <form onSubmit={handleSubmit(submitForm)}  >
   
 <div className="flex flex-col gap-6">
      <Input  isInvalid={Boolean(errors.name && touchedFields.name)} errorMessage={errors.name?.message} {...register('name' )}  label="Name" type="text" />
      {/* <p className=' bg-red-300 '>{errors.name?.message}</p> */}
      <Input isInvalid={Boolean(errors.email && touchedFields.email)}  errorMessage={errors.email?.message} {...register('email')} label="Email" type="email" />
      {/* <p className=' bg-red-300 '>{errors.email?.message}</p> */}
       <Input  isInvalid={Boolean(errors.password  && touchedFields.password)} errorMessage={errors.password?.message}  {...register('password')} label="Password" type="password" />
        <Input isInvalid={Boolean(errors.rePassword && touchedFields.rePassword)} errorMessage={errors.rePassword?.message}  {...register('rePassword')} label="rePassword" type="password" />
       <div className="flex gap-3">
          <Input isInvalid={Boolean(errors.dateOfBirth && touchedFields.dateOfBirth)} errorMessage={errors.dateOfBirth?.message}  {...register('dateOfBirth')} label="DateOfBirth" type="date" />

           <Select isInvalid={Boolean(errors.gender && touchedFields.gender)} errorMessage={errors.password?.message}  {...register('gender')} className="max-w-xs" label="Select Gender">
        
          <SelectItem key={'male'}>Male</SelectItem>
           <SelectItem key={'female'}>Female</SelectItem>
      
      </Select>
       </div>
 </div>

 {apiError ? <p className='text-red-500 py-2'>{apiError}</p>
:null}

 <Button isLoading={isLoading} type='submit' className='w-full my-4' color="primary" variant="shadow">
        Submit
      </Button>
      <p>Do you have an account ? <Link className='text-sky-600' to='/'>Sign in</Link></p>

    </form>
    </div>

  </div>


  
  </>
}
