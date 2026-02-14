import React, { useState } from 'react'
import { 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem, 
  Button, 
  Spinner, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Input,
  useDisclosure 
} from "@heroui/react";
import { DeleteMyComment, updateMyComment } from '../../services/commentApi';
import { MoreVertical } from 'lucide-react';

export default function CommentDropDown({ CommentId, callback }) {
  const [isLoading, setisLoading] = useState(false);
  const [newContent, setNewContent] = useState(""); 
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  async function deleteComment() {
    setisLoading(true)
    const response = await DeleteMyComment(CommentId)
    if (response.message === 'success') { 
      await callback()
    }
    setisLoading(false)
  }

 
  async function handleUpdate() {
    setisLoading(true);
    const response = await updateMyComment(CommentId, newContent);
    
    if (response.message === 'success') {
      await callback(); 
      onOpenChange(false); 
      setNewContent(""); 
    }
    setisLoading(false);
  }

  return (
    <>
      <Dropdown className='p-0'>
        <DropdownTrigger>
          <Button className='bg-transparent text-gray-400 hover:text-white hover:bg-gray-800/50 p-2 min-w-0 rounded-lg transition-all'>
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Comment Actions" className="bg-[#1a1f2e] border border-gray-800">
          <DropdownItem 
            onClick={onOpen} 
            key="edit"
            className="text-gray-300 hover:text-white hover:bg-gray-800"
          >
            Update Comment
          </DropdownItem>
          
          <DropdownItem 
            onClick={deleteComment} 
            key="delete" 
            className="text-danger" 
            color="danger"
          >
            {isLoading ? <Spinner size="sm" color="current" /> : 'Delete Comment'}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

     
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center" className="bg-[#1a1f2e]">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-white border-b border-gray-800">
                Edit Your Comment
              </ModalHeader>
              <ModalBody className="py-6">
                <Input
                  autoFocus
                  label="Comment"
                  placeholder="Enter your new comment"
                  variant="bordered"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  classNames={{
                    input: "bg-[#242938] text-gray-200",
                    inputWrapper: "bg-[#242938] border-gray-700 hover:border-purple-500 focus-within:border-purple-500"
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button 
                  color="danger" 
                  variant="flat" 
                  onPress={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  onPress={handleUpdate}
                  isLoading={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}