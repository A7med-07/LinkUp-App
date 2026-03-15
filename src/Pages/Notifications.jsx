import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../services/api";
import LoadingPage from "../Components/LoadingPage/LoadingPage";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@heroui/react";

const defImg = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  async function fetchNotifications() {
    const res = activeTab === "unread"
  ? await getNotifications(true)
  : await getNotifications();
    setNotifications(res?.data?.notifications ?? res?.notifications ?? []);

    setLoading(false);
  }

  async function handleMarkAll() {
    await markAllNotificationsRead();
    fetchNotifications();
  }

  async function handleClickNotification(n) {
    await markNotificationRead(n._id);
    // روح للبوست لو في entityId
    if (n.entityId && n.entityType === "post") {
      if (n.entity?.unavailable) {
        alert("Post not found");
        return;
      }
      navigate(`/singlepost/${n.entityId}`);
    } else if (n.type === "follow") {
      navigate(`/profile/${n.actor?._id}`);
    }
    fetchNotifications();
  }

  useEffect(() => { setLoading(true); fetchNotifications(); }, [activeTab]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <Button onClick={handleMarkAll} size="sm" variant="flat"
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white bg-gray-100 dark:bg-gray-800"
            startContent={<CheckCheck className="w-3.5 h-3.5" />}>
            Mark all as read
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-5 py-3 border-b border-gray-100 dark:border-gray-700">
          {[
            { key: "all", label: "All" },
            { key: "unread", label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? <LoadingPage /> : notifications.length === 0
          ? <div className="text-center py-16 text-gray-400">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No notifications yet</p>
            </div>
          : <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {notifications.map((n) => (
                <div key={n._id}
                  onClick={() => handleClickNotification(n)}
                  className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all ${
                    !n.isRead
                      ? "border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-900/10"
                      : "border-l-4 border-l-transparent"
                  }`}>

                  {/* Avatar */}
                  <Link to={`/profile/${n.actor?._id}`} onClick={(e) => e.stopPropagation()}
                    className="relative flex-shrink-0">
                    <img className="w-11 h-11 rounded-full object-cover"
                      src={n.actor?.photo ?? defImg}
                      onError={(e) => { e.target.src = defImg; }} alt="user" />
                    {!n.isRead && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900" />
                    )}
                  </Link>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.isRead ? "text-gray-900 dark:text-white font-medium" : "text-gray-600 dark:text-gray-400"}`}>
                      <Link to={`/profile/${n.actor?._id}`} onClick={(e) => e.stopPropagation()}
                        className="font-bold hover:underline text-gray-900 dark:text-white">
                        {n.actor?.name ?? "Someone"}
                      </Link>{" "}
                      {n.type === "comment_post" && "commented on your post"}
                      {n.type === "share_post" && "shared your post"}
                      {n.type === "like_post" && "liked your post"}
                      {n.type === "follow" && "started following you"}
                      {!["comment_post", "share_post", "like_post", "follow"].includes(n.type) && (n.message ?? n.type ?? "interacted with your post")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {n.createdAt?.split(".")[0].replace("T", " ")}
                    </p>
                    {/* لو البوست اتمسح */}
                    {n.entity?.unavailable && (
                      <p className="text-xs text-red-400 mt-0.5">Post no longer available</p>
                    )}
                  </div>

                  {/* Unread dot */}
                  {!n.isRead
                    ? <span className="flex-shrink-0 w-2.5 h-2.5 bg-blue-500 rounded-full mt-2" />
                    : <span className="flex-shrink-0 w-2.5 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2" />
                  }
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
}