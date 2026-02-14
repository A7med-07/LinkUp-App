import axios from "axios"

export async function createMyComment(content , id) {

    try {

        const { data } = await axios.post(`https://linked-posts.routemisr.com/comments`, {
            content:content ,
            post:id
        }, {
            headers: {
                token: localStorage.getItem('token')
            }
        })
        return data

    } catch (error) {
        return error
    }

    return <>

    </>
}



export async function DeleteMyComment(id) {

    try {

        const { data } = await axios.delete(`https://linked-posts.routemisr.com/comments/${id}`, {
            headers: {
                token: localStorage.getItem('token')
            }
        })
        return data

    } catch (error) {
        
        return error
    }

    return <>

    </>
}


// https://linked-posts.routemisr.com/comments/664d47ffbc90df274cc45b00


export async function updateMyComment(id, content) { 
    try {
        const { data } = await axios.put(`https://linked-posts.routemisr.com/comments/${id}`, 
        {
            content: content  
        }, 
        {
            headers: {
                token: localStorage.getItem('token')
            }
        })
        return data

    } catch (error) {
        return error
    }
   
}