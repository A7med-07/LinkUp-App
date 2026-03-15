import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@heroui/react";
import { ThumbsUp, MessageCircle, Share2, Bookmark, Send, Users } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { getPostLikes } from "../services/api";
import PostDropDown from "../Components/PostDropDown/PostDropDown";

const defImg = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

function getHeaders() {
  return { token: localStorage.getItem("token") };
}

// نفس منطق صاحبك في Post.jsx بالظبط
export default function PostCard({ post, allComment, queryKey = ["posts"] }) {
  const { userData } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(post?.isLiked || post?.likes?.includes(userData?._id) || false);
  const [likeCount, setLikeCount] = useState(post?.likesCount ?? post?.likes?.length ?? 0);
  const [bookmarked, setBookmarked] = useState(post?.isBookmarked || false);
  const [likers, setLikers] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // ===== Like - نفس صاحبك =====
  const likeMutation = useMutation({
    mutationFn: () =>
      axios.put(
        `https://route-posts.routemisr.com/posts/${post._id}/like`,
        {},
        { headers: getHeaders() }
      ),
    onMutate: () => {
      setLiked((p) => !p);
      setLikeCount((p) => (liked ? p - 1 : p + 1));
    },
  });

  // ===== Bookmark - نفس صاحبك =====
  const bookmarkMutation = useMutation({
    mutationFn: () =>
      axios.put(
        `https://route-posts.routemisr.com/posts/${post._id}/bookmark`,
        {},
        { headers: getHeaders() }
      ),
    onMutate: () => setBookmarked((p) => !p),
  });

  // ===== Share - نفس صاحبك =====
  const shareMutation = useMutation({
    mutationFn: () =>
      axios.post(
        `https://route-posts.routemisr.com/posts/${post._id}/share`,
        {},
        { headers: getHeaders() }
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  // ===== Delete - نفس صاحبك =====
  const deleteMutation = useMutation({
    mutationFn: () =>
      axios.delete(
        `https://route-posts.routemisr.com/posts/${post._id}`,
        { headers: getHeaders() }
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  // ===== Comment - نفس صاحبك في singlePost =====
  const addCommentMutation = useMutation({
    mutationFn: () =>
      axios.post(
        `https://route-posts.routemisr.com/posts/${post._id}/comments`,
        { content: commentContent },
        { headers: getHeaders() }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", post._id] });
      queryClient.invalidateQueries({ queryKey });
      setCommentContent("");
    },
  });

  async function handleShowLikes() {
    const res = await getPostLikes(post._id);
    setLikers(res?.data?.likes ?? res?.likes ?? []);
    onOpen();
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="rounded-2xl border border-gray-200 shadow-sm my-4 overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <div className="flex items-center gap-3 ">


            <Link to={`/profile/${post.user?._id}`}>
              <img className="w-10 h-10 rounded-full object-cover"
                src={post.user?.photo || defImg} />
            </Link>
            <div>
              <Link to={`/profile/${post.user?._id}`} className="text-sm font-bold hover:underline bg-white dark:bg-gray-900 text-gray-900 dark:text-white" >
                {post.user?.name}
              </Link>
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                {post.user?.username && <><span>@{post.user.username}</span><span>·</span></>}
                <span>{post.createdAt?.split(".")[0].replace("T", " ")}</span>
              </div>
            </div>
          </div>
          {userData?._id === post.user?._id && (
            <PostDropDown postId={post._id} callback={() => queryClient.invalidateQueries({ queryKey })} />
          )}
        </div>

        {/* Body */}
        {post.body && (
          <Link to={`/singlepost/${post._id}`} className="block px-4 pb-3 text-sm leading-relaxed bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            {post.body}
          </Link>
        )}

        {/* Image */}
        {post.image && (
          <Link to={`/singlepost/${post._id}`}>
            <img src={post.image} className="w-full max-h-[500px] object-cover" alt="post" />
          </Link>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <button onClick={handleShowLikes} className="flex items-center gap-1 hover:text-blue-600 hover:underline">
            <div className="bg-blue-500 w-5 h-5 rounded-full flex items-center justify-center">
              <ThumbsUp className="w-3 h-3 text-white fill-current" />
            </div>
            <span>{likeCount} likes</span>
          </button>
          <div className="flex items-center gap-3">
            <span>🔁 {post.sharesCount ?? 0} shares</span>
            <Link to={`/singlepost/${post._id}`} className="hover:text-blue-600 hover:underline">
              {post.commentsCount ?? post.comments?.length ?? 0} comments
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-4 border-b border-gray-100">
          <button onClick={() => likeMutation.mutate()}
            className={`flex items-center justify-center gap-1 py-2 text-sm transition-all ${liked ? "text-blue-600 bg-blue-50" : " hover:text-blue-600 hover:bg-blue-50 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"}`}>
            <ThumbsUp className={`w-4 h-4 ${liked ? "fill-current" : ""}`} /> Like
          </button>
          <Link to={`/singlepost/${post._id}`}
            className="flex items-center justify-center gap-1 py-2 text-sm  hover:text-gray-700 hover:bg-gray-50 transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <MessageCircle className="w-4 h-4" /> Comment
          </Link>
          <button onClick={() => shareMutation.mutate()}
            className="flex items-center justify-center gap-1 py-2 text-sm  hover:text-green-600 hover:bg-green-50 transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button onClick={() => bookmarkMutation.mutate()}
            className={`flex items-center justify-center gap-1 py-2 text-sm hover:bg-yellow-50 transition-all ${bookmarked ? "text-yellow-500" : " hover:text-yellow-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"}`}>
            <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-current" : ""}`} /> Save
          </button>
        </div>

        {/* Add Comment*/}
        <div className="flex items-center gap-2 px-4 py-3">
          <img
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            src={userData?.photo || defImg}
            onError={(e) => { e.target.src = defImg; }}
            alt="me"
          />
          <input
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && commentContent.trim()) addCommentMutation.mutate(); }}
            placeholder={`Comment as ${userData?.name ?? "you"}...`}
            className="flex-1 rounded-2xl px-4 py-2 text-sm outline-none border border-transparent focus:border-blue-300 dark:focus:bg-gray-800 transition-all bg-white dark:bg-gray-900 text-gray-900 dark:text-white dark:border-gray-50"
          />
          <Button
            isLoading={addCommentMutation.isPending}
            onClick={() => { if (commentContent.trim()) addCommentMutation.mutate(); }}
            disabled={!commentContent.trim()}
            className="bg-blue-500 text-white rounded-full min-w-0 w-9 h-9 p-0"
            isIconOnly
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Likes Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white cursor-pointer">
        <ModalContent>
          <>
            <ModalHeader className="flex items-center gap-2 border-b bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              <Users className="w-5 h-5 text-blue-600" /> People who reacted
            </ModalHeader>
            <ModalBody className="py-4 max-h-[400px] overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              {likers.length === 0 ? (
                <p className="text-center text-gray-400 py-4">No reactions yet</p>
              ) : (
                likers.map((l, i) => (
                  <div key={l._id ?? i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white dark:hover:bg-gray-800 transition-all">
                    <img className="w-10 h-10 rounded-full object-cover"
                      src={l.photo || defImg} onError={(e) => { e.target.src = defImg; }} alt="user" />
                    <div>
                      <p className="text-sm font-semibold">{l.name}</p>
                      <p className="text-xs text-gray-500">@{l.username ?? ""}</p>
                    </div>
                  </div>
                ))
              )}
            </ModalBody>
          </>
        </ModalContent>
      </Modal>
    </div>
  );
}