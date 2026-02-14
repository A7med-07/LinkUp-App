import React, { useState } from 'react'
import { updateMyPost, deletePost } from '../../Pages/postApi'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { MoreVertical, MapPin, Smile, Image as ImageIcon, X } from 'lucide-react'

export default function PostDropDown({ postId, callback }) {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [postBody, setpostBody] = useState('')
  const [image, setimage] = useState('')
  const [imgurl, setimgurl] = useState('')
  const [isloading, setisloading] = useState(false)

  async function updatePost(e) {
    setisloading(true)
    e.preventDefault()
    console.log('add', postBody);

    const formData = new FormData()
    formData.append('body', postBody ?? '')
    if (image) {
      formData.append('image', image ?? '')
    }

    const response = await updateMyPost(formData, postId)
    console.log(response);

    if (response.message == 'success') {
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

async function handleDelete(){
  const response = await deletePost(postId);
  if (response.message === 'success'){
    callback()
  }
}
  return <>
    <Dropdown className='p-0'>
      <DropdownTrigger>
        <Button className='bg-transparent text-gray-400 hover:text-white hover:bg-gray-800/50 p-2 min-w-0 rounded-lg transition-all'>
          <MoreVertical className="w-5 h-5" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" className="bg-[#1a1f2e] border border-gray-800">

        <DropdownItem
          key="edit"
          textValue="Edit Post"
          onPress={onOpen}
          className="text-gray-300 hover:text-white hover:bg-gray-800"
        >
          Edit Post
        </DropdownItem>
        <DropdownItem
          key="delete"
          textValue="Delete Post"
          className="text-danger"
          color="danger"
          onPress={handleDelete}
        >
          Delete Post
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>




    <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="bg-[#1a1f2e]">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-white border-b border-gray-800">Update Post</ModalHeader>
            <ModalBody className="py-6">
              <form onSubmit={updatePost}>
                <div className="flex flex-col text-gray-200">

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
                  
                  <input onChange={handleImg} type="file" id={postId} className='hidden' accept="image/*" />
                  
                  <div className="icons flex text-gray-400 mb-4 pb-4 border-b border-gray-800">
                    <button type="button" className="mr-3 cursor-pointer hover:text-purple-400 hover:bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 rounded-full p-2 transition-all duration-300">
                      <MapPin className="w-5 h-5" />
                    </button>
                    
                    <button type="button" className="mr-3 cursor-pointer hover:text-purple-400 hover:bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 rounded-full p-2 transition-all duration-300">
                      <Smile className="w-5 h-5" />
                    </button>
                    
                    <label htmlFor={postId} className="cursor-pointer hover:text-purple-400 hover:bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 rounded-full p-2 transition-all duration-300">
                      <ImageIcon className="w-5 h-5" />
                    </label>
                    
                    <div className="count ml-auto text-gray-500 text-sm font-semibold flex items-center">
                      {postBody.length}/300
                    </div>
                  </div>
                  
                  {/* buttons */}
                  <div className="buttons flex justify-end gap-3">
                    <Button 
                      isLoading={isloading} 
                      type='submit' 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 rounded-xl shadow-lg transition-all"
                    >
                      Update
                    </Button>
                  </div>
                </div>

              </form>
            </ModalBody>
            <ModalFooter className="border-t border-gray-800">
              <Button 
                color="danger" 
                variant="light" 
                onPress={onClose}
                className="text-gray-400 hover:text-white"
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>


  </>
}