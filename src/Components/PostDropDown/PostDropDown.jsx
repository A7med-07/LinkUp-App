import { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { MoreHorizontal, X, Image as ImageIcon } from "lucide-react";
import { updatePost, deletePost } from "../../services/api";

export default function PostDropDown({ postId, callback }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [postBody, setPostBody] = useState("");
  const [image, setImage] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdate(e) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("body", postBody);
    if (image) formData.append("image", image);
    const response = await updatePost(postId, formData);
    if (response?.message === "success" || response?.success) {
      await callback();
      setPostBody(""); setImage(null); setImgUrl("");
      onClose();
    }
    setIsLoading(false);
  }

  async function handleDelete() {
    const response = await deletePost(postId);
    if (response?.message === "success" || response?.success) callback();
  }

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button className="bg-transparent text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 min-w-0 rounded-full" isIconOnly>
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl">
          <DropdownItem key="edit" onPress={onOpen} className="text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800">Edit Post</DropdownItem>
          <DropdownItem key="delete" onPress={handleDelete} className="text-red-500" color="danger">Delete Post</DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" size="md">
        <ModalContent className="bg-white dark:bg-gray-900">
          {(onClose) => (
            <>
              <ModalHeader className="border-b border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white">
                Update Post
              </ModalHeader>
              <ModalBody className="py-4">
                <form onSubmit={handleUpdate}>
                  <textarea
                    value={postBody}
                    onChange={(e) => setPostBody(e.target.value)}
                    placeholder="What's on your mind?"
                    rows={4}
                    className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 resize-none mb-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                  {imgUrl && (
                    <div className="relative mb-3">
                      <img src={imgUrl} className="w-full rounded-xl max-h-48 object-cover" alt="preview" />
                      <button type="button" onClick={() => { setImgUrl(""); setImage(null); }}
                        className="absolute top-2 right-2 bg-red-500 p-1 rounded-full">
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  )}
                  <div className="flex items-center gap-3 border-t border-gray-100 dark:border-gray-700 pt-3">
                    <label htmlFor={`img-${postId}`} className="cursor-pointer text-gray-400 hover:text-blue-600">
                      <ImageIcon className="w-5 h-5" />
                    </label>
                    <input id={`img-${postId}`} type="file" className="hidden" accept="image/*"
                      onChange={(e) => { const f = e.target.files[0]; if (f) { setImage(f); setImgUrl(URL.createObjectURL(f)); } }} />
                    <Button isLoading={isLoading} type="submit" className="ml-auto bg-blue-600 text-white rounded-xl px-6">
                      Update
                    </Button>
                  </div>
                </form>
              </ModalBody>
              <ModalFooter className="border-t border-gray-100 dark:border-gray-700">
                <Button variant="light" onPress={onClose} className="text-gray-500 dark:text-gray-400">Cancel</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}