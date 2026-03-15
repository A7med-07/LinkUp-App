import axios from "axios";

const BASE = "https://route-posts.routemisr.com";

const token = () => ({ token: localStorage.getItem("token") });

// ===================== AUTH =====================
export async function signUp(userData) {
  try {
    const clean = { ...userData };
    if (!clean.username) delete clean.username;
    const { data } = await axios.post(`${BASE}/users/signup`, clean);
    return data;
  } catch (e) { return e.response?.data; }
}

export async function signIn(userData) {
  try {
    const { data } = await axios.post(`${BASE}/users/signin`, userData);
    return data;
  } catch (e) { return e.response?.data; }
}

// ===================== USER =====================
export async function getLoggedUser() {
  try {
    const { data } = await axios.get(`${BASE}/users/profile-data`, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function getUserProfile(userId) {
  try {
    const { data } = await axios.get(`${BASE}/users/${userId}/profile`, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function uploadProfilePhoto(formData) {
  try {
    const { data } = await axios.put(`${BASE}/users/upload-photo`, formData, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function changePassword(passwords) {
  try {
    const { data } = await axios.patch(`${BASE}/users/change-password`, passwords, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function getFollowSuggestions(limit = 10) {
  try {
    const { data } = await axios.get(`${BASE}/users/suggestions`, { headers: token(), params: { limit } });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function followUnfollowUser(userId) {
  try {
    const { data } = await axios.put(`${BASE}/users/${userId}/follow`, {}, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function getBookmarks() {
  try {
    const { data } = await axios.get(`${BASE}/users/bookmarks`, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function getUserPosts(userId) {
  try {
    const { data } = await axios.get(`${BASE}/users/${userId}/posts`, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

// ===================== POSTS =====================
export async function getAllPosts(limit = 15) {
  try {
    const { data } = await axios.get(`${BASE}/posts`, { headers: token(), params: { limit, sort: "-createdAt" } });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function getHomeFeed(limit = 10) {
  try {
    const { data } = await axios.get(`${BASE}/posts/feed`, { headers: token(), params: { only: "following", limit } });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function getSinglePost(postId) {
  try {
    const { data } = await axios.get(`${BASE}/posts/${postId}`, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function createPost(formData) {
  try {
    const { data } = await axios.post(`${BASE}/posts`, formData, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function updatePost(postId, formData) {
  try {
    const { data } = await axios.put(`${BASE}/posts/${postId}`, formData, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function deletePost(postId) {
  try {
    const { data } = await axios.delete(`${BASE}/posts/${postId}`, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function bookmarkPost(postId) {
  try {
    const { data } = await axios.put(`${BASE}/posts/${postId}/bookmark`, {}, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function sharePost(postId, body = "") {
  try {
    const { data } = await axios.post(`${BASE}/posts/${postId}/share`, { body }, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function getPostLikes(postId) {
  try {
    const { data } = await axios.get(`${BASE}/posts/${postId}/likes`, { headers: token(), params: { page: 1, limit: 20 } });
    return data;
  } catch (e) { return e.response?.data; }
}

// ===================== COMMENTS =====================
export async function getPostComments(postId, page = 1, limit = 10) {
  try {
    const { data } = await axios.get(`${BASE}/posts/${postId}/comments`, { headers: token(), params: { page, limit } });
    return data;
  } catch (e) { return e.response?.data; }
}

// ✅ صح - JSON
export async function createComment(postId, content) {
  try {
    const { data } = await axios.post(`${BASE}/posts/${postId}/comments`, { content }, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

// ✅ updateComment
export async function updateComment(postId, commentId, content) {
  try {
    const { data } = await axios.put(`${BASE}/posts/${postId}/comments/${commentId}`, { content }, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function deleteComment(postId, commentId) {
  try {
    const { data } = await axios.delete(`${BASE}/posts/${postId}/comments/${commentId}`, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function likeUnlikeComment(postId, commentId) {
  try {
    const { data } = await axios.put(`${BASE}/posts/${postId}/comments/${commentId}/like`, {}, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

// ===================== REPLIES =====================
export async function getCommentReplies(postId, commentId) {
  try {
    const { data } = await axios.get(`${BASE}/posts/${postId}/comments/${commentId}/replies`, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

// ✅ createReply
export async function createReply(postId, commentId, content) {
  try {
    const { data } = await axios.post(`${BASE}/posts/${postId}/comments/${commentId}/replies`, { content }, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

// ===================== NOTIFICATIONS =====================
export async function getNotifications(unread, page = 1, limit = 10) {
  try {
    const params = { page, limit };
    if (unread) params.unread = true; // بيبعتها بس لو true
    const { data } = await axios.get(`${BASE}/notifications`, { headers: token(), params });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function getUnreadCount() {
  try {
    const { data } = await axios.get(`${BASE}/notifications/unread-count`, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function markNotificationRead(id) {
  try {
    const { data } = await axios.patch(`${BASE}/notifications/${id}/read`, {}, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

export async function markAllNotificationsRead() {
  try {
    const { data } = await axios.patch(`${BASE}/notifications/read-all`, {}, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}

// ===================== like =====================
export async function likeUnlikePost(postId) {
  try {
    const { data } = await axios.put(`${BASE}/posts/${postId}/like`, {}, { headers: token() });
    return data;
  } catch (e) { return e.response?.data; }
}