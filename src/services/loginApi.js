import axios from "axios";

export async function signIn(userData){
try {
    const {data}= await   axios.post('https://linked-posts.routemisr.com/users/signin' , userData)
 

 return data


} catch (error) {

    

    return error.response.data
    
    
}
 
}



// https://linked-posts.routemisr.com/users/profile-data

export async function getLoggedUser(){
try {
    const {data}= await   axios.get('https://linked-posts.routemisr.com/users/profile-data' , {
        headers:{
            token : localStorage.getItem('token')
        }
    })
 

 return data


} catch (error) {

    

    return error
    
    
}
 
}