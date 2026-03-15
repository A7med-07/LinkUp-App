import { useContext, useState } from "react";
import { Button } from "@heroui/react";
import { Image as ImageIcon, Smile, MapPin, X, ChevronDown } from "lucide-react";
import { createPost } from "../../services/api";
import { AuthContext } from "../../context/authContext";

const defImg = "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";

const PRIVACY_OPTIONS = [
  { value: "public", label: "Public", icon: "🌐" },
  { value: "followers", label: "Followers", icon: "👥" },
  { value: "only_me", label: "Only me", icon: "🔒" },
];

export default function CreatePost({ callback }) {
  const { userData } = useContext(AuthContext);
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [privacy, setPrivacy] = useState("public");
  const [showPrivacy, setShowPrivacy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim() && !image) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("body", body);
    formData.append("privacy", privacy);
    if (image) formData.append("image", image);
    const response = await createPost(formData);
    if (response?.success || response?.message === "success") {
      await callback();
      setBody(""); setImage(null); setImgUrl("");
    }
    setIsLoading(false);
  }

  const selectedPrivacy = PRIVACY_OPTIONS.find((o) => o.value === privacy);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-4">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">

        {/* Header - صورة اليوزر + Privacy */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={userData?.photo || defImg}
            onError={(e) => { e.target.src = defImg; }}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            alt="me"
          />
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{userData?.name}</p>
            {/* Privacy Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPrivacy(!showPrivacy)}
                className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-md transition-all mt-0.5"
              >
                <span>{selectedPrivacy?.icon}</span>
                <span>{selectedPrivacy?.label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {showPrivacy && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 min-w-[130px]">
                  {PRIVACY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setPrivacy(opt.value); setShowPrivacy(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all first:rounded-t-xl last:rounded-b-xl ${
                        privacy === opt.value
                          ? "text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/20"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <span>{opt.icon}</span> {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`What's on your mind, ${userData?.name?.split(" ")[0] ?? "you"}?`}
          rows={3}
          className="w-full bg-transparent text-sm outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400 mb-3"
        />

        {imgUrl && (
          <div className="relative mb-3 group">
            <img src={imgUrl} className="w-full rounded-xl max-h-60 object-cover" alt="preview" />
            <button type="button" onClick={() => { setImgUrl(""); setImage(null); }}
              className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        <div className="flex items-center border-t border-gray-100 dark:border-gray-700 pt-3">
          <div className="flex gap-2">
            <button type="button" className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-2 rounded-lg text-sm transition-all">
              <MapPin className="w-4 h-4" />
            </button>
            <button type="button" className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 px-3 py-2 rounded-lg text-sm transition-all">
              <Smile className="w-4 h-4" />
            </button>
            <label className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 px-3 py-2 rounded-lg text-sm transition-all cursor-pointer">
              <ImageIcon className="w-4 h-4" />
              <input type="file" className="hidden" accept="image/*"
                onChange={(e) => { const f = e.target.files[0]; if (f) { setImage(f); setImgUrl(URL.createObjectURL(f)); } }} />
            </label>
          </div>
          <span className="ml-auto text-xs text-gray-400 mr-3">{body.length}/300</span>
          <Button isLoading={isLoading} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 font-semibold">
            Post
          </Button>
        </div>
      </form>
    </div>
  );
}