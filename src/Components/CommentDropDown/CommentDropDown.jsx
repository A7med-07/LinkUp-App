import { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, useDisclosure } from "@heroui/react";
import { MoreHorizontal } from "lucide-react";
import { updateComment, deleteComment } from "../../services/api";

export default function CommentDropDown({ commentId, postId, callback }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleDelete() {
    const response = await deleteComment(postId, commentId);
    if (response?.success || response?.message === "success") callback();
  }

  async function handleUpdate() {
    setIsLoading(true);
    const response = await updateComment(postId, commentId, content);
    if (response?.success || response?.message === "success") {
      await callback();
      onOpenChange(false);
      setContent("");
    }
    setIsLoading(false);
  }

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </DropdownTrigger>
        <DropdownMenu className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl">
          <DropdownItem key="edit" onPress={onOpen} className="text-gray-700 dark:text-gray-200">Edit</DropdownItem>
          <DropdownItem key="delete" onPress={handleDelete} className="text-red-500" color="danger">Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent className="bg-white dark:bg-gray-900">
          {(onClose) => (
            <>
              <ModalHeader className="text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700">
                Edit Comment
              </ModalHeader>
              <ModalBody>
                <Input autoFocus label="Comment" value={content}
                  onChange={(e) => setContent(e.target.value)} variant="bordered"
                  classNames={{
                    input: "dark:bg-gray-800 dark:text-red-500",
                    inputWrapper: "dark:border-gray-600",
                  }}
                />
              </ModalBody>
              <ModalFooter className="border-t border-gray-100 dark:border-gray-700">
                <Button variant="light" onPress={onClose} className="text-gray-500 dark:text-gray-400">Cancel</Button>
                <Button isLoading={isLoading} onPress={handleUpdate} className="bg-blue-600 text-white">Save</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}