import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import ProfileHeader from "../components/profile/ProfileHeader";
import PostGrid from "../components/profile/PostGrid";
import Highlights from "../components/profile/Highlights";
import { api } from "../services/api";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const { username } = useParams();
  const targetUsername = username || user?.username;
  const isOwnProfile = user?.username === targetUsername;

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!targetUsername) return;

    const load = async () => {
      const profileRes = await api.get(`/users/${targetUsername}`);
      setProfile(profileRes.data);

      const postsRes = await api.get(`/posts/user/${profileRes.data.id}`);
      setPosts(postsRes.data);
    };

    load();
  }, [targetUsername]);

  if (!profile) {
    return <div className="card" style={{ padding: 20 }}>Loading profile...</div>;
  }

  return (
    <div className="ig-profile-wrap">
      <ProfileHeader profile={profile} postsCount={posts.length} isOwnProfile={isOwnProfile} />
      <Highlights posts={posts} />

      <div className="ig-profile-tabs">
        <span className="ig-profile-tab active">Posts</span>
        <span className="ig-profile-tab">Reels</span>
        <span className="ig-profile-tab">Saved</span>
        <span className="ig-profile-tab">Tagged</span>
      </div>

      <PostGrid posts={posts} />
    </div>
  );
};

export default Profile;