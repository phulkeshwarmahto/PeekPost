import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import ProfileHeader from "../components/profile/ProfileHeader";
import PostGrid from "../components/profile/PostGrid";
import Highlights from "../components/profile/Highlights";
import { api } from "../services/api";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!user?.username) return;

    const load = async () => {
      const profileRes = await api.get(`/users/${user.username}`);
      setProfile(profileRes.data);

      const postsRes = await api.get(`/posts/user/${profileRes.data.id}`);
      setPosts(postsRes.data);
    };

    load();
  }, [user?.username]);

  if (!profile) {
    return <div className="card">Loading profile...</div>;
  }

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <ProfileHeader profile={profile} />
      <Highlights />
      <PostGrid posts={posts} />
    </div>
  );
};

export default Profile;