export const LOCAL_USERS_KEY = "peekpost_local_users";

export const MOCK_USERS = [
  {
    id: "u1",
    _id: "u1",
    username: "lensqueen",
    email: "lensqueen@peekpost.dev",
    password: "password123",
    fullName: "Ava Brooks",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    bio: "Capturing stories through light.",
    followersCount: 1240,
    followingCount: 301,
  },
  {
    id: "u2",
    _id: "u2",
    username: "noahframes",
    email: "noah@peekpost.dev",
    password: "password123",
    fullName: "Noah Carter",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    bio: "Street photographer and editor.",
    followersCount: 803,
    followingCount: 222,
  },
];

export const getStoredUsers = () => {
  const raw = localStorage.getItem(LOCAL_USERS_KEY);
  if (!raw) return MOCK_USERS;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : MOCK_USERS;
  } catch {
    return MOCK_USERS;
  }
};

export const saveStoredUsers = (users) => {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

export const MOCK_POSTS = [
  {
    _id: "p1",
    caption: "Golden hour in old town. #peekpost",
    createdAt: new Date().toISOString(),
    likes: ["u2", "u3"],
    comments: [{ id: "c1" }, { id: "c2" }],
    author: MOCK_USERS[0],
    media: [{ url: "https://picsum.photos/seed/home-1/900/900", type: "image" }],
    location: { name: "Prague" },
  },
  {
    _id: "p2",
    caption: "Motion reel from today. Swipe for vibes.",
    createdAt: new Date().toISOString(),
    likes: ["u1"],
    comments: [{ id: "c3" }],
    author: MOCK_USERS[1],
    media: [{ url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", type: "video" }],
    location: { name: "Berlin" },
  },
];

export const MOCK_REELS = [
  {
    _id: "r1",
    caption: "Night drive reflections",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    author: MOCK_USERS[0],
  },
  {
    _id: "r2",
    caption: "City to sea transition",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    author: MOCK_USERS[1],
  },
  {
    _id: "r3",
    caption: "Drone look over hills",
    videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    author: MOCK_USERS[0],
  },
];

export const MOCK_NOTIFICATIONS = [
  { _id: "n1", type: "follow", actor: MOCK_USERS[1], message: "started following you.", createdAt: new Date().toISOString(), read: false },
  { _id: "n2", type: "like", actor: MOCK_USERS[0], message: "liked your post.", createdAt: new Date(Date.now() - 3600000).toISOString(), read: false },
  { _id: "n3", type: "comment", actor: MOCK_USERS[1], message: "commented: Stunning capture!", createdAt: new Date(Date.now() - 7200000).toISOString(), read: true },
];
