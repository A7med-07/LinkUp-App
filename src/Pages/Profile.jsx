import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { getUserPosts, getBookmarks, uploadProfilePhoto, getFollowSuggestions, followUnfollowUser, getUserProfile } from "../services/api";
import PostCard from "./PostCard";
import LoadingPage from "../Components/LoadingPage/LoadingPage";
import { Camera, Mail, User, Bookmark, UserPlus, Check, Search, X } from "lucide-react";
import { Button } from "@heroui/react";

const defImg = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

export default function Profile() {
  const { id } = useParams();
  const { userData, setuserData } = useContext(AuthContext);
  const isMyProfile = !id || id === userData?._id;

  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [followed, setFollowed] = useState({});
  const [followLoading, setFollowLoading] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [coverUrl, setCoverUrl] = useState(null);
  const photoRef = useRef();
  const coverRef = useRef();

  const displayUser = isMyProfile ? userData : profileUser;

  async function fetchData() {
    setLoading(true);
    if (isMyProfile) {
      const [postsRes, bookmarksRes, suggestionsRes] = await Promise.all([
        getUserPosts(userData._id),
        getBookmarks(),
        getFollowSuggestions(10),
      ]);
      setPosts(postsRes?.data?.posts ?? postsRes?.posts ?? []);
      setBookmarks(bookmarksRes?.data?.bookmarks ?? bookmarksRes?.data?.posts ?? bookmarksRes?.bookmarks ?? bookmarksRes?.posts ?? []);
      setSuggestions(suggestionsRes?.data?.suggestions ?? suggestionsRes?.suggestions ?? suggestionsRes?.data?.users ?? suggestionsRes?.users ?? []);
      const myCover = localStorage.getItem(`coverUrl_${userData._id}`);
      setCoverUrl(myCover || null);
    } else {
      const [profileRes, postsRes] = await Promise.all([getUserProfile(id), getUserPosts(id)]);
      setProfileUser(profileRes?.data?.user ?? profileRes?.user);
      setPosts(postsRes?.data?.posts ?? postsRes?.posts ?? []);
      const otherCover = localStorage.getItem(`coverUrl_${id}`);
      setCoverUrl(otherCover || null);
    }
    setLoading(false);
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoLoading(true);
    const formData = new FormData();
    formData.append("photo", file);
    const res = await uploadProfilePhoto(formData);
    if (res?.data?.user) setuserData(res.data.user);
    setPhotoLoading(false);
  }

  function handleCoverUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setCoverUrl(base64);
      localStorage.setItem(`coverUrl_${userData?._id}`, base64);
    };
    reader.readAsDataURL(file);
  }

  async function handleFollow(userId) {
    setFollowLoading((p) => ({ ...p, [userId]: true }));
    await followUnfollowUser(userId);
    setFollowed((p) => ({ ...p, [userId]: !p[userId] }));
    setFollowLoading((p) => ({ ...p, [userId]: false }));
  }

  useEffect(() => { if (userData?._id) fetchData(); }, [id, userData]);

  if (loading) return <LoadingPage />;
  if (!displayUser) return <div className="text-center py-20 text-gray-400">User not found</div>;

  const filteredSuggestions = suggestions.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-950 min-h-screen">

      {/* Cover */}
      <div className="h-44 relative overflow-hidden"
        style={{ background: coverUrl ? `url(${coverUrl}) center/cover` : "linear-gradient(135deg, #334155, #1e3a5f)" }}>
        {isMyProfile && (
          <>
            <button onClick={() => coverRef.current.click()}
              className="absolute top-3 right-3 flex items-center gap-2 bg-black/40 hover:bg-black/60 text-white text-xs px-3 py-2 rounded-lg transition-all">
              <Camera className="w-4 h-4" /> Add cover
            </button>
            <input ref={coverRef} type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
          </>
        )}
      </div>

      {/* Photo Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPhotoModal(false)}>
          <div className="relative max-w-lg w-full">
            <button onClick={() => setShowPhotoModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300">
              <X className="w-6 h-6" />
            </button>
            <img src={displayUser?.photo || defImg} alt="profile"
              className="w-full rounded-2xl object-cover shadow-2xl"
              onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 mt-6 pb-10">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm px-6 py-5 mb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              {/* صورة قابلة للتكبير */}
              <img
                className="w-20 h-20 rounded-full object-cover ring-4 ring-white dark:ring-gray-900 shadow cursor-pointer hover:opacity-90 transition-opacity"
                src={displayUser?.photo || defImg}
                onError={(e) => { e.target.src = defImg; }}
                onClick={() => setShowPhotoModal(true)}
                alt="profile"
              />
              {isMyProfile && (
                <>
                  <button onClick={() => photoRef.current.click()} disabled={photoLoading}
                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 p-1.5 rounded-full border-2 border-white dark:border-gray-900">
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                  <input ref={photoRef} type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </>
              )}
            </div>
            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{displayUser?.name}</h2>
                <p className="text-gray-500 text-sm">@{displayUser?.username ?? displayUser?.email?.split("@")[0]}</p>
                <span className="inline-flex items-center gap-1 mt-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full">
                  <User className="w-3 h-3" /> Route Posts member
                </span>
              </div>
              <div className="flex gap-3">
                {[
                  { label: "FOLLOWERS", value: displayUser?.followers?.length ?? displayUser?.followersCount ?? 0 },
                  { label: "FOLLOWING", value: displayUser?.following?.length ?? displayUser?.followingCount ?? 0 },
                  { label: "POSTS", value: posts.length },
                ].map((s) => (
                  <div key={s.label} className="border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-center min-w-[80px]">
                    <p className="text-xs text-gray-400 font-semibold tracking-wide">{s.label}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{s.value}</p>
                  </div>
                ))}
              </div>
              {!isMyProfile && (
                <Button isLoading={followLoading[id]} onClick={() => handleFollow(id)}
                  className={`${followed[id] ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300" : "bg-blue-600 text-white"}`}
                  startContent={followed[id] ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}>
                  {followed[id] ? "Following" : "Follow"}
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-5">
            <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">About</h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {isMyProfile && <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{displayUser?.email}</p>}
                <p className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" />Active on Route Posts</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <p className="text-xs text-blue-600 font-semibold tracking-wide">POSTS</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{posts.length}</p>
              </div>
              {isMyProfile && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                  <p className="text-xs text-blue-600 font-semibold tracking-wide">SAVED POSTS</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{bookmarks.length}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mb-4">
              <div className="flex border-b border-gray-100 dark:border-gray-700">
                {[
                  { key: "posts", label: isMyProfile ? "My Posts" : "Posts", icon: <User className="w-4 h-4" />, count: posts.length },
                  ...(isMyProfile ? [{ key: "saved", label: "Saved", icon: <Bookmark className="w-4 h-4" />, count: bookmarks.length }] : []),
                ].map((tab) => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all ${
                      activeTab === tab.key
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                    }`}>
                    {tab.icon} {tab.label}
                    <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-0.5 rounded-full">{tab.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "posts"
              ? posts.length > 0
                ? posts.map((p) => <PostCard key={p._id} post={p} allComment={false} />)
                : <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center text-gray-400">No posts yet.</div>
              : bookmarks.length > 0
                ? bookmarks.map((p) => <PostCard key={p._id} post={p} allComment={false} />)
                : <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center text-gray-400">No saved posts yet.</div>
            }
          </div>

          {isMyProfile && filteredSuggestions.length > 0 && (
            <div className="w-full md:w-72 flex-shrink-0">
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sticky top-20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">Suggested Friends</span>
                  </div>
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{suggestions.length}</span>
                </div>
                <div className="relative mb-3">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search friends..."
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-blue-300 text-gray-900 dark:text-white placeholder-gray-400" />
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {filteredSuggestions.map((user) => (
                    <div key={user._id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                      <img className="w-9 h-9 rounded-full object-cover"
                        src={user.photo || defImg} onError={(e) => { e.target.src = defImg; }} alt="user" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.followersCount ?? 0} followers</p>
                      </div>
                      <Button size="sm" isLoading={followLoading[user._id]}
                        onClick={() => handleFollow(user._id)}
                        className={`text-xs min-w-0 ${followed[user._id] ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300" : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"}`}
                        startContent={followed[user._id] ? <Check className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
                        variant="flat">
                        {followed[user._id] ? "Following" : "Follow"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}