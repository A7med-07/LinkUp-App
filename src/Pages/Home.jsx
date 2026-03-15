import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { UserPlus, Check, Search } from "lucide-react";
import { Button } from "@heroui/react";
import axios from "axios";
import CreatePost from "../Components/CreatePost/CreatePost";
import PostCard from "./PostCard";
import LoadingPage from "../Components/LoadingPage/LoadingPage";

const defImg = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

function getHeaders() {
  return { token: localStorage.getItem("token") };
}

export default function Home() {
  const queryClient = useQueryClient();
  const [followed, setFollowed] = useState({});
  const [followLoading, setFollowLoading] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["posts", filter],
    queryFn: () => {
      if (filter === "all") {
        return axios.get("https://route-posts.routemisr.com/posts", {
          headers: getHeaders(),
          params: { limit: 20, sort: "-createdAt" },
        }).then((r) => r.data);
      }
      return axios.get("https://route-posts.routemisr.com/posts/feed", {
        headers: getHeaders(),
        params: { only: filter, limit: 20 },
      }).then((r) => r.data);
    },
  });

  const { data: suggestionsData } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () =>
      axios.get("https://route-posts.routemisr.com/users/suggestions", {
        headers: getHeaders(),
        params: { limit: 10 },
      }).then((r) => r.data),
  });

  const posts = data?.data?.posts ?? data?.posts ?? [];
  const suggestions = suggestionsData?.data?.suggestions ?? suggestionsData?.suggestions ?? [];

  async function handleFollow(userId) {
    setFollowLoading((p) => ({ ...p, [userId]: true }));
    await axios.put(`https://route-posts.routemisr.com/users/${userId}/follow`, {}, { headers: getHeaders() });
    setFollowed((p) => ({ ...p, [userId]: !p[userId] }));
    setFollowLoading((p) => ({ ...p, [userId]: false }));
    queryClient.invalidateQueries({ queryKey: ["suggestions"] });
  }

  const filtered = suggestions.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex max-w-6xl mx-auto px-4 gap-4 py-4">

      {/* Left Sidebar */}
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sticky top-20">
          <nav className="space-y-1">
            {[
              { label: "Feed", icon: "🏠", to: "/home" },
              { label: "My Profile", icon: "👤", to: "/profile" },
              { label: "Notifications", icon: "🔔", to: "/notifications" },
              { label: "Suggestions", icon: "👥", to: "/suggestions" },
            ].map((item) => (
              <Link key={item.label} to={item.to}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 transition-all">
                <span>{item.icon}</span> {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Feed */}
      <main className="flex-1 min-w-0">
        <CreatePost callback={() => queryClient.invalidateQueries({ queryKey: ["posts", filter] })} />

        {/* Filters */}
        <div className="flex gap-2 mb-3 ms-4 mt-3 flex-wrap">
          {[
            { key: "all", label: "All", icon: "🌐" },
            { key: "following", label: "Following", icon: "👥" },
            { key: "me", label: "Mine", icon: "👤" },
          ].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                filter === f.key
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-blue-300 hover:text-blue-600"
              }`}>
              <span>{f.icon}</span> {f.label}
            </button>
          ))}
        </div>

        {isLoading ? <LoadingPage /> : posts.length > 0
          ? posts.map((p) => <PostCard key={p._id} post={p} allComment={false} />)
          : <div className="text-center py-10 text-gray-400">No posts yet</div>
        }
      </main>

      {/* Right Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sticky top-20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="font-semibold text-sm text-gray-900 dark:text-white">Suggested Friends</span>
            </div>
            <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
              {suggestions.length}
            </span>
          </div>
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search friends..."
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-blue-300 transition-all text-gray-900 dark:text-white placeholder-gray-400" />
          </div>
          <div className="space-y-3">
            {filtered.slice(0, 5).map((user) => (
              <div key={user._id} className="flex items-center gap-3">
                <Link to={`/profile/${user._id}`} className="flex-shrink-0">
  <img className="w-9 h-9 rounded-full object-cover hover:opacity-90 transition-opacity"
    src={user.photo || defImg} onError={(e) => { e.target.src = defImg; }} alt="user" />
</Link>
<div className="flex-1 min-w-0">
  <Link to={`/profile/${user._id}`} className="text-sm font-semibold text-gray-900 dark:text-white truncate hover:underline block">
    {user.name}
  </Link>
                  <p className="text-xs text-gray-400">{user.followersCount ?? 0} followers</p>
                </div>
                <Button size="sm" isLoading={followLoading[user._id]}
                  onClick={() => handleFollow(user._id)}
                  className={`text-xs min-w-0 flex-shrink-0 ${followed[user._id] ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300" : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}
                  startContent={followed[user._id] ? <Check className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                  variant="flat">
                  {followed[user._id] ? "Following" : "Follow"}
                </Button>
              </div>
            ))}
          </div>
          <Link to="/suggestions"
            className="w-full mt-3 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white font-medium py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all flex items-center justify-center">
            View more →
          </Link>
        </div>
      </aside>
    </div>
  );
}