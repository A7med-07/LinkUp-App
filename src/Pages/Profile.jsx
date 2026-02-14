import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { getMyPosts } from "../services/userPostsApi";
import PostCard from "./PostCard";
import LoadingPage from "../Components/LoadingPage/LoadingPage";
import { User } from 'lucide-react'

export default function Profile() {
  const { userData } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchMyPosts() {
    const response = await getMyPosts(userData._id);
    if (response.message === "success") {
      setPosts(response.posts);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (userData?._id) {
      fetchMyPosts();
    }
  }, [userData]);

  if (loading) return <LoadingPage />;

  return (
    <div className="bg-[#0f1419] min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-2xl">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">My Profile</h2>
              <p className="text-gray-400">View and manage your posts</p>
            </div>
          </div>
        </div>

        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              allComment={false}
              callback={fetchMyPosts}
            />
          ))
        ) : (
          <div className="bg-[#1a1f2e] border border-gray-800 rounded-2xl p-12 text-center">
            <div className="bg-gray-800/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-gray-500" />
            </div>
            <p className="text-gray-400 text-lg">No posts yet</p>
            <p className="text-gray-500 text-sm mt-2">Start sharing your thoughts with the community</p>
          </div>
        )}
      </div>
    </div>
  );
}