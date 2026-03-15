import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@heroui/react";
import { Send } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import CommentCard from "../Components/CommentCard/CommentCard";
import PostCard from "./PostCard";
import LoadingPage from "../Components/LoadingPage/LoadingPage";

const defImg = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

function getHeaders() {
  return { token: localStorage.getItem("token") };
}

export default function SinglePost() {
  const { id } = useParams();
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");

  const { data: postData, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/posts/${id}`, { headers: getHeaders() }).then((r) => r.data),
  });

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: () =>
      axios.get(`https://route-posts.routemisr.com/posts/${id}/comments`, { headers: getHeaders() }).then((r) => r.data),
  });

  const post = postData?.data?.post ?? postData?.post;
  const comments = commentsData?.data?.comments ?? commentsData?.comments ?? [];

  const addCommentMutation = useMutation({
    mutationFn: () =>
      axios.post(`https://route-posts.routemisr.com/posts/${id}/comments`, { content: comment }, { headers: getHeaders() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      setComment("");
    },
  });

  if (isLoading) return <LoadingPage />;
  if (!post) return <div className="text-center py-20 text-gray-400">Post not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-4 transition-all">
        ← Back
      </button>

      <PostCard post={post} allComment={true} queryKey={["post", id]} />

      {/* Comments Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mt-2 p-4">

        {/* Add Comment */}
        <div className="flex items-center gap-2 mb-4">
          <img className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            src={userData?.photo || defImg}
            onError={(e) => { e.target.src = defImg; }} alt="me" />
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            onKeyDown={(e) => { if (e.key === "Enter" && comment.trim()) addCommentMutation.mutate(); }}
            className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 text-sm outline-none border border-transparent focus:border-blue-300 focus:bg-white dark:focus:bg-gray-700 transition-all text-gray-900 dark:text-white placeholder-gray-400"
          />
          <Button isLoading={addCommentMutation.isPending}
            onClick={() => { if (comment.trim()) addCommentMutation.mutate(); }}
            disabled={!comment.trim()}
            className="bg-blue-500 text-white rounded-full min-w-0 w-9 h-9 p-0" isIconOnly>
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
          Comments ({comments.length})
        </h3>

        {commentsLoading ? <LoadingPage /> : comments.length === 0
          ? <p className="text-center text-gray-400 text-sm py-4">No comments yet</p>
          : <div className="space-y-2">
              {comments.map((c) => (
                <CommentCard key={c._id} comment={c} postId={id} />
              ))}
            </div>
        }
      </div>
    </div>
  );
}