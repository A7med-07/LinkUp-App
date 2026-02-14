import React, { useState } from 'react'
import { CreateMyPost } from '../../Pages/postApi'
import { Button } from '@heroui/react'
import { MapPin, Smile, Image as ImageIcon, X } from 'lucide-react'

export default function CreatPost({callback}) {

    const [postBody, setpostBody] = useState('')
    const [image, setimage] = useState('')
    const [imgurl, setimgurl] = useState('')
    const [isloading, setisloading] = useState(false)

    async function AddPost(e) {
        setisloading(true)
        e.preventDefault()
        console.log('add', postBody);

        const formData = new FormData()
        formData.append('body', postBody ?? '')
        if (image) {
            formData.append('image', image ?? '')
        }

        const response = await CreateMyPost(formData)
        console.log(response);

        if(response.message == 'success'){
            await callback()
            setpostBody('')
            setimage('')
            setimgurl('')
        }
        setisloading(false)
    }


    function handleImg(e) {
        const file = e.target.files[0];
        console.log(file);

        if (file) {
            setimage(file)
            setimgurl(URL.createObjectURL(file))
        }
    }


    return <>

        <form onSubmit={AddPost}>
            <div className="editor mt-5 py-6 mx-auto bg-[#1a1f2e] flex flex-col text-gray-200 border border-gray-800 p-6 shadow-2xl max-w-3xl rounded-2xl hover:border-gray-700 transition-all duration-300">

                <h2 className='mb-6 font-bold text-center text-2xl text-white'>New Post</h2>
                
                <input 
                    value={postBody} 
                    onChange={(e) => { setpostBody(e.target.value) }} 
                    className="title bg-[#242938] border border-gray-700 text-gray-200 placeholder-gray-500 p-3 mb-4 outline-none rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all" 
                    spellCheck="false" 
                    placeholder="Add your Post" 
                    type="text" 
                />
                
                {imgurl && <div className='relative mb-4 rounded-xl overflow-hidden group'>
                    <img className='w-full rounded-xl' src={imgurl} alt="post img" />
                    <button
                        type="button"
                        onClick={() => setimgurl('')}
                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>}
                
                <input onChange={handleImg} type="file" id='postImg' className='hidden' accept="image/*" />
                
                <div className="icons flex text-gray-400 mb-4 pb-4 border-b border-gray-800">
                    <button type="button" className="mr-3 cursor-pointer hover:text-purple-400 hover:bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 rounded-full p-2 transition-all duration-300">
                        <MapPin className="w-5 h-5" />
                    </button>
                    
                    <button type="button" className="mr-3 cursor-pointer hover:text-purple-400 hover:bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 rounded-full p-2 transition-all duration-300">
                        <Smile className="w-5 h-5" />
                    </button>
                    
                    <label htmlFor="postImg" className="cursor-pointer hover:text-purple-400 hover:bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 rounded-full p-2 transition-all duration-300">
                        <ImageIcon className="w-5 h-5" />
                    </label>
                    
                    <div className="count ml-auto text-gray-500 text-sm font-semibold flex items-center">
                        {postBody.length}/300
                    </div>
                </div>
                
                {/* buttons */}
                <div className="buttons flex justify-end">
                    <Button 
                        isLoading={isloading} 
                        type='submit' 
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 p-2 px-6 font-semibold cursor-pointer text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Post
                    </Button>
                </div>
            </div>

        </form>

    </>
}