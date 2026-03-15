import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFollowSuggestions, followUnfollowUser } from "../services/api";
import { UserPlus, Check, Search, Users } from "lucide-react";
import { Button } from "@heroui/react";

const DEF_IMG = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState({});
  const [followLoading, setFollowLoading] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchSuggestions() {
    const res = await getFollowSuggestions(40);
    setSuggestions(res?.data?.suggestions ?? res?.suggestions ?? res?.data?.users ?? res?.users ?? []);
    setLoading(false);
  }

  async function handleFollow(userId) {
    setFollowLoading((p) => ({ ...p, [userId]: true }));
    await followUnfollowUser(userId);
    setFollowed((p) => ({ ...p, [userId]: !p[userId] }));
    setFollowLoading((p) => ({ ...p, [userId]: false }));
  }

  useEffect(() => { fetchSuggestions(); }, []);

  const filtered = suggestions.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-3 rounded-2xl">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Suggested Friends</h1>
              <p className="text-gray-500 text-sm">People you might know</p>
            </div>
          </div>
          <span className="bg-blue-600/20 text-blue-400 text-sm font-bold px-4 py-1.5 rounded-full">
            {suggestions.length} people
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or username..."
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 outline-none transition-all shadow-sm"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No results found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((user) => (
              <div key={user._id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-gray-600 rounded-2xl p-4 flex items-center gap-3 transition-all duration-300">
                <Link to={`/profile/${user._id}`} className="flex-shrink-0">
                  <img
                    src={user.photo || DEF_IMG}
                    onError={(e) => { e.target.src = DEF_IMG; }}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700 hover:opacity-90 transition-opacity"
                    alt={user.name}
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/profile/${user._id}`}
                    className="font-semibold text-gray-900 dark:text-white text-sm truncate hover:underline block">
                    {user.name}
                  </Link>
                  {user.username
                    ? <p className="text-xs text-gray-500">@{user.username}</p>
                    : <p className="text-xs text-gray-500">route user</p>
                  }
                  <p className="text-xs text-gray-400 mt-0.5">{user.followersCount ?? 0} followers</p>
                </div>
                <Button size="sm" isLoading={followLoading[user._id]}
                  onClick={() => handleFollow(user._id)} variant="flat"
                  className={`flex-shrink-0 text-xs font-semibold transition-all ${
                    followed[user._id]
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      : "bg-blue-600/20 text-blue-500 dark:text-blue-400 hover:bg-blue-600/30"
                  }`}
                  startContent={!followLoading[user._id] && (followed[user._id] ? <Check className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />)}>
                  {followed[user._id] ? "Following" : "Follow"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}