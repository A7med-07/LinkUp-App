import axios from 'axios'
import React from 'react'

export default async function getAllPosts() {

    try {

        const { data } = await axios.get('https://linked-posts.routemisr.com/posts', {
            headers: {
                token: localStorage.getItem('token')
            },
            params:{
                limit:15 ,
                sort:'-createdAt'
            }
        })
        return data

    } catch (error) {
        return error
    }

    return <>

    </>
}




export async function getSinglePost(id) {

    try {

        const { data } = await axios.get(`https://linked-posts.routemisr.com/posts/${id}`, {
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





export async function CreateMyPost(formData) {

    try {

        const { data } = await axios.post(`https://linked-posts.routemisr.com/posts` ,formData , {
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


// https://linked-posts.routemisr.com/posts/66875b3b006c4ff191a61a89




export async function updateMyPost( formData, postId) {

    try {

        const { data } = await axios.put(`https://linked-posts.routemisr.com/posts/${postId}` ,formData , {
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


// https://linked-posts.routemisr.com/posts/66875b3b006c4ff191a61a89

export async function deletePost(id) {

    try {

        const { data } = await axios.delete(`https://linked-posts.routemisr.com/posts/${id}` , {
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