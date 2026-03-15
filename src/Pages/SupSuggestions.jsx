import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFollowSuggestions, followUnfollowUser } from "../services/api";
import { UserPlus, Check, Users } from "lucide-react";
import { Button } from "@heroui/react";

const DEF_IMG = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

export default function SupSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [followed, setFollowed] = useState({});
  const [followLoading, setFollowLoading] = useState({});
  const [loading, setLoading] = useState(true);

  async function fetchSuggestions() {
    const res = await getFollowSuggestions(10);
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

  if (loading) return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-4 h-4 text-blue-500" />
        <span className="font-semibold text-sm text-gray-900 dark:text-white">Suggested Friends</span>
      </div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 animate-pulse">
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (suggestions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <span className="font-semibold text-sm text-gray-900 dark:text-white">Suggested Friends</span>
        </div>
        <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-semibold">
          {suggestions.length}
        </span>
      </div>

      {/* List */}
      <div className="space-y-3">
        {suggestions.slice(0, 10).map((user) => (
          <div key={user._id} className="flex items-center gap-3">
            <Link to={`/profile/${user._id}`} className="flex-shrink-0">
              <img
                src={user.photo || DEF_IMG}
                onError={(e) => { e.target.src = DEF_IMG; }}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700 hover:opacity-90 transition-opacity"
                alt={user.name}
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/profile/${user._id}`}
                className="text-sm font-semibold text-gray-900 dark:text-white truncate hover:underline block">
                {user.name}
              </Link>
              <p className="text-xs text-gray-400">{user.followersCount ?? user.followers?.length ?? 0} followers</p>
            </div>
            <Button size="sm" isLoading={followLoading[user._id]}
              onClick={() => handleFollow(user._id)} variant="flat"
              className={`flex-shrink-0 text-xs font-semibold transition-all min-w-0 ${
                followed[user._id]
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
              }`}
              startContent={!followLoading[user._id] && (followed[user._id] ? <Check className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />)}>
              {followed[user._id] ? "Following" : "Follow"}
            </Button>
          </div>
        ))}
      </div>

      {/* View More */}
      <Link to="/suggestions"
        className="w-full mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
        View more →
      </Link>
    </div>
  );
}