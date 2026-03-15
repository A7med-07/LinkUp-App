import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@heroui/react";
import { Send, Image as ImageIcon, Smile } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

const defImg = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

function getHeaders() {
  return { token: localStorage.getItem("token") };
}

export default function CommentCard({ comment, postId }) {
  const { userData } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const isOwner = userData?._id === comment?.commentCreator?._id;

  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment?.content || "");
  const [liked, setLiked] = useState(comment?.isLiked || false);
  const [likeCount, setLikeCount] = useState(comment?.likesCount ?? comment?.likes?.length ?? 0);
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");

  const { data: repliesData } = useQuery({
    queryKey: ["replies", postId, comment._id],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/replies`, { headers: getHeaders() }).then((r) => r.data),
    enabled: showReplies,
  });

  const replies = repliesData?.data?.replies ?? repliesData?.replies ?? [];

  const editMutation = useMutation({
    mutationFn: () =>
      axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`, { content: text }, { headers: getHeaders() }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["comments", postId] }); setEditing(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      axios.delete(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`, { headers: getHeaders() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", postId] }),
  });

  const likeMutation = useMutation({
    mutationFn: () =>
      axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/like`, {}, { headers: getHeaders() }),
    onMutate: () => {
      setLiked((p) => !p);
      setLikeCount((p) => (liked ? p - 1 : p + 1));
    },
  });

  const replyMutation = useMutation({
    mutationFn: () =>
      axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}/replies`, { content: replyText }, { headers: getHeaders() }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["replies", postId, comment._id] }); setReplyText(""); },
  });

  return (
    <div className="flex items-start gap-2 py-1">
      <img className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
        src={comment?.commentCreator?.photo || defImg}
        onError={(e) => { e.target.src = defImg; }} alt="user" />
      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2 inline-block max-w-full">
          <p className="text-xs font-bold text-gray-900 dark:text-white">{comment?.commentCreator?.name}</p>

          {editing ? (
            <div className="flex gap-2 mt-1">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm outline-none focus:border-blue-300 text-gray-900 dark:text-white"
              />
              <button onClick={() => editMutation.mutate()} disabled={editMutation.isPending}
                className="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg">
                {editMutation.isPending ? "..." : "Save"}
              </button>
              <button onClick={() => setEditing(false)}
                className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                Cancel
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-800 dark:text-gray-200">{comment?.content}</p>
          )}
        </div>

        <div className="flex items-center gap-3 mt-1 px-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{comment?.createdAt?.split(".")[0].replace("T", " ")}</span>
          <button onClick={() => likeMutation.mutate()}
            className={`font-semibold hover:underline ${liked ? "text-blue-600" : "hover:text-blue-600"}`}>
            Like {likeCount > 0 && `(${likeCount})`}
          </button>
          <button onClick={() => setShowReplies(!showReplies)}
            className="font-semibold hover:text-blue-600 hover:underline">
            {showReplies ? "Hide replies" : `Reply${comment?.repliesCount > 0 ? ` (${comment.repliesCount})` : ""}`}
          </button>
          {isOwner && (
            <div className="flex gap-2">
              <button onClick={() => { setEditing(!editing); setText(comment?.content); }}
                className="text-blue-500 hover:underline">Edit</button>
              <button onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}
                className="text-red-500 hover:underline">
                {deleteMutation.isPending ? "..." : "Delete"}
              </button>
            </div>
          )}
        </div>

        {showReplies && (
          <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
            {replies.length === 0 ? (
              <p className="text-xs text-gray-400">No replies yet.</p>
            ) : (
              replies.map((reply, i) => (
                <div key={reply._id ?? i} className="flex items-start gap-2">
                  <img className="w-7 h-7 rounded-full object-cover"
                    src={reply.replyCreator?.photo ?? defImg}
                    onError={(e) => { e.target.src = defImg; }} alt="user" />
                  <div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2 inline-block">
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{reply.replyCreator?.name}</p>
                      <p className="text-sm text-gray-800 dark:text-gray-200">{reply.content}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 px-2">
                      {reply.createdAt?.split(".")[0].replace("T", " ")}
                    </p>
                  </div>
                </div>
              ))
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Replying to {comment?.commentCreator?.name}
            </p>
            <form onSubmit={(e) => { e.preventDefault(); if (replyText.trim()) replyMutation.mutate(); }}
              className="flex items-center gap-2">
              <img className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                src={userData?.photo ?? defImg}
                onError={(e) => { e.target.src = defImg; }} alt="me" />
              <div className="flex-1 flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-1">
                <input value={replyText} onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 bg-transparent text-sm outline-none py-1 text-gray-900 dark:text-white placeholder-gray-400" />
                <button type="button" className="text-gray-400"><ImageIcon className="w-4 h-4" /></button>
                <button type="button" className="text-gray-400"><Smile className="w-4 h-4" /></button>
              </div>
              <Button isLoading={replyMutation.isPending} type="submit"
                className="bg-blue-500 text-white rounded-full min-w-0 w-8 h-8 p-0" isIconOnly>
                <Send className="w-3 h-3" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}