import { useState } from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Home from "./pages/Home.jsx";
import Explore from "./pages/Explore.jsx";
import Reels from "./pages/Reels.jsx";
import Profile from "./pages/Profile.jsx";
import Messages from "./pages/Messages.jsx";
import Notifications from "./pages/Notifications.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Settings from "./pages/Settings.jsx";
import Premium from "./pages/Premium.jsx";
import { logoutLocal } from "./redux/slices/authSlice.js";
import { prependPost } from "./redux/slices/feedSlice.js";
import { api } from "./services/api.js";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.accessToken);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const navItems = [
  { to: "/", label: "Home", icon: "H" },
  { to: "/explore", label: "Search", icon: "S" },
  { to: "/explore", label: "Explore", icon: "E" },
  { to: "/reels", label: "Reels", icon: "R" },
  { to: "/messages", label: "Messages", icon: "M" },
  { to: "/notifications", label: "Notifications", icon: "N" },
];

const Sidebar = ({ onOpenCreate }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.accessToken);

  if (!token) return null;

  return (
    <aside className="ig-sidebar">
      <div className="ig-logo">Instagram</div>

      <nav className="ig-nav-list">
        {navItems.map((item, index) => (
          <NavLink
            key={`${item.label}-${index}`}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => `ig-nav-item${isActive ? " active" : ""}`}
          >
            <span className="ig-nav-icon">{item.icon}</span>
            <span className="ig-nav-label">{item.label}</span>
          </NavLink>
        ))}

        <button type="button" className="ig-nav-item" onClick={onOpenCreate}>
          <span className="ig-nav-icon">+</span>
          <span className="ig-nav-label">Create</span>
        </button>

        <NavLink to="/profile" className={({ isActive }) => `ig-nav-item${isActive ? " active" : ""}`}>
          <img
            className="ig-profile-icon"
            src={user?.avatar || "https://placehold.co/64x64?text=U"}
            alt="profile"
          />
          <span className="ig-nav-label">Profile</span>
        </NavLink>
      </nav>

      <div className="ig-nav-bottom">
        <button
          type="button"
          className="ig-nav-item"
          onClick={() => {
            dispatch(logoutLocal());
          }}
        >
          <span className="ig-nav-icon">=</span>
          <span className="ig-nav-label">More</span>
        </button>
      </div>
    </aside>
  );
};

const CreatePostModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const [showInputs, setShowInputs] = useState(false);
  const [caption, setCaption] = useState("");
  const [mediaUrl, setMediaUrl] = useState("https://picsum.photos/seed/modal-post/1080/1080");
  const [posting, setPosting] = useState(false);

  if (!open) return null;

  const submit = async (event) => {
    event.preventDefault();
    setPosting(true);
    try {
      const { data } = await api.post("/posts", {
        caption,
        media: [{ url: mediaUrl, type: "image", publicId: "" }],
      });
      dispatch(prependPost(data));
      setCaption("");
      setMediaUrl(`https://picsum.photos/seed/${Date.now()}/1080/1080`);
      setShowInputs(false);
      onClose();
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="ig-overlay" onClick={onClose}>
      <button className="ig-close" type="button" onClick={onClose}>
        x
      </button>

      <section className="ig-create-modal" onClick={(event) => event.stopPropagation()}>
        <div className="ig-create-head">Create new post</div>
        <div className="ig-create-body">
          <div className="ig-drop-zone">
            <div>
              <div className="ig-drop-icon">[+]</div>
              <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 400 }}>Drag photos and videos here</h3>
              {!showInputs && (
                <button className="ig-btn-primary" type="button" onClick={() => setShowInputs(true)}>
                  Select from computer
                </button>
              )}
            </div>
          </div>

          {showInputs && (
            <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
              <input
                className="ig-input"
                value={mediaUrl}
                onChange={(event) => setMediaUrl(event.target.value)}
                placeholder="Image or video URL"
              />
              <textarea
                className="ig-textarea"
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                placeholder="Write a caption"
              />
              <button className="ig-btn-primary" type="submit" disabled={posting}>
                {posting ? "Posting..." : "Share"}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

function App() {
  const token = useSelector((state) => state.auth.accessToken);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="ig-shell">
      <Sidebar onOpenCreate={() => setIsCreateOpen(true)} />

      <main className="ig-main">
        <div className="ig-page">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <Explore />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reels"
              element={
                <ProtectedRoute>
                  <Reels />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:username?"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/premium"
              element={
                <ProtectedRoute>
                  <Premium />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      <CreatePostModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}

export default App;