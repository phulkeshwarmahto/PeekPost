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

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.accessToken);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.accessToken);

  if (!token) return null;

  return (
    <div className="card nav">
      <div>
        <h2 style={{ margin: 0 }}>PeekPost</h2>
        <p style={{ margin: "0.2rem 0 0", color: "var(--muted)" }}>{`@${user?.username || ""}`}</p>
      </div>
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/explore">Explore</NavLink>
      <NavLink to="/reels">Reels</NavLink>
      <NavLink to="/messages">Messages</NavLink>
      <NavLink to="/notifications">Notifications</NavLink>
      <NavLink to="/profile">Profile</NavLink>
      <NavLink to="/settings">Settings</NavLink>
      <NavLink to="/premium">Premium</NavLink>
      <button
        type="button"
        className="btn-ghost"
        onClick={() => {
          dispatch(logoutLocal());
        }}
      >
        Logout
      </button>
    </div>
  );
};

function App() {
  const token = useSelector((state) => state.auth.accessToken);

  return (
    <div className="app-shell">
      <div className="layout">
        <Sidebar />
        <div>
          <Routes>
            <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/register" element={token ? <Navigate to="/" replace /> : <Register />} />

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
              path="/profile"
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
            <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
