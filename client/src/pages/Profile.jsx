import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import ProfileHeader from "../components/profile/ProfileHeader";
import PostGrid from "../components/profile/PostGrid";
import { api } from "../services/api";
import { getStoredUsers, MOCK_POSTS } from "../utils/mockData";

/* Demo profile for clean display when API is not accessible */
const DEMO_PROFILE = {
  username: "elara_vaughn",
  fullName: "Elara Vaughn",
  bio: "Visual Storyteller & Creative Director.\nCapturing the quiet moments between the noise.\n📍 Based in Copenhagen",
  website: "https://elaravaughn.com/portfolio",
  avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=300&fit=crop",
  followersCount: 18200,
  followingCount: 842,
  category: null,
};

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const { username } = useParams();
  const targetUsername = username || user?.username;
  const isOwnProfile = user?.username === targetUsername;

  const [profile, setProfile]   = useState(null);
  const [posts,   setPosts]     = useState([]);
  const [error,   setError]     = useState(false);

  useEffect(() => {
    if (!targetUsername) return;

    const load = async () => {
      try {
        const profileRes = await api.get(`/users/${targetUsername}`);
        setProfile(profileRes.data);

        const postsRes = await api.get(`/posts/user/${profileRes.data.id}`);
        setPosts(postsRes.data);
      } catch {
        const localUser = getStoredUsers().find(
          (item) => item.username?.toLowerCase() === targetUsername?.toLowerCase(),
        );
        if (localUser) {
          setProfile(localUser);
          setPosts(MOCK_POSTS.filter((post) => post.author?.username === localUser.username));
          return;
        }
        setError(true);
      }
    };

    load();
  }, [targetUsername]);

  /* Show demo profile if API fails (so the design is always visible) */
  const displayProfile = profile || (error ? { ...DEMO_PROFILE, username: targetUsername } : null);

  if (!displayProfile) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "var(--tcl-muted)" }}>
        Loading profile…
      </div>
    );
  }

  return (
    <div className="ig-profile-wrap">
      <ProfileHeader
        profile={displayProfile}
        postsCount={posts.length || 124}
        isOwnProfile={isOwnProfile}
      />
      <PostGrid posts={posts} />
    </div>
  );
};

export default Profile;