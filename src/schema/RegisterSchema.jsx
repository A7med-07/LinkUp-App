  import * as zod from "zod"
export  const schema= zod.object({
    name : zod.string().nonempty('Name is Required')
    .min(3 , 'Name min 3 char').max(5 , 'Name max 5 char') ,


    email:zod.string().nonempty('Email is required')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , 'Invalid Email') ,

    password:zod.string().nonempty('Password is required')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ , 'Invalid')  ,

    rePassword:zod.string().nonempty('rePassword is required') ,
    gender:zod.string().nonempty('Gender is required') , 

    dateOfBirth:zod.coerce.date('Date is Required')
    .refine((value)=>{
      let year= value.getFullYear()   // 2000
      let dateNow= new Date().getFullYear()  // 2025
      let userAge= dateNow - year
      return userAge >= 20

    } , 'Age less than 20')

  }).refine((data)=> data.password === data.rePassword  , {path:['rePassword'] , message:'Invalid Repassword'} )