import axios from "axios";

export async function signUp(userData){
try {
    const {data}= await   axios.post('https://linked-posts.routemisr.com/users/signup' , userData)

 return data


} catch (error) {

    return error.response.data
      
}
 
}