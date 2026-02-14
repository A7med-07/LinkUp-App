import axios from "axios";

export async function getMyPosts(userId, limit = 10) {
  const { data } = await axios.get(
    `https://linked-posts.routemisr.com/users/${userId}/posts?limit=${limit}`,
    {
      headers: {
        token: localStorage.getItem("token"),
      },
    }
  );
  return data;
}
