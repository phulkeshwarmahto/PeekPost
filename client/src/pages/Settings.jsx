import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { api } from "../services/api";
import { logoutLocal } from "../redux/slices/authSlice";

const menuItems = [
  "Edit profile",
  "Professional account",
  "Change password",
  "Apps and websites",
  "Email notifications",
  "Push notifications",
  "Privacy and security",
  "Login activity",
  "Help",
];

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    website: user?.website || "",
    bio: user?.bio || "",
    email: user?.email || "",
    phone: "+91 971",
    gender: "Prefer not to say",
    avatar: user?.avatar || "",
  });

  const save = async (event) => {
    event.preventDefault();
    await api.put("/users/me", {
      fullName: form.fullName,
      bio: form.bio,
      website: form.website,
      avatar: form.avatar,
    });
    setMessage("Profile updated successfully.");
  };

  const deactivate = async () => {
    await api.delete("/users/me");
    dispatch(logoutLocal());
  };

  return (
    <div className="ig-settings-wrap">
      <aside className="ig-settings-menu">
        <div className="ig-settings-pane">
          <h3 style={{ margin: 0, fontSize: 24 }}>Some account settings are moving</h3>
          <p className="ig-muted" style={{ lineHeight: 1.5 }}>
            Soon, Accounts Center will be the primary place to manage your account info and settings.
          </p>
          <a className="ig-link" href="https://about.meta.com" target="_blank" rel="noreferrer">
            Learn more
          </a>
        </div>

        {menuItems.map((item, index) => (
          <div key={item} className={`ig-settings-menu-item${index === 0 ? " active" : ""}`}>
            {item}
          </div>
        ))}

        <div className="ig-settings-pane" style={{ borderTop: "1px solid #dbdbdb" }}>
          <a className="ig-link" href="#switch">
            Switch to personal account
          </a>
        </div>
      </aside>

      <section className="ig-settings-pane">
        <form className="ig-settings-form" onSubmit={save}>
          <div className="ig-settings-profile">
            <img className="ig-settings-avatar" src={form.avatar || "https://placehold.co/120x120?text=U"} alt="me" />
            <div>
              <div style={{ fontWeight: 700 }}>{form.username}</div>
              <div className="ig-link">Change profile photo</div>
            </div>
          </div>

          <div className="ig-settings-row">
            <label className="ig-settings-label" htmlFor="fullName">
              Name
            </label>
            <div>
              <input
                id="fullName"
                className="ig-input"
                value={form.fullName}
                onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
              />
              <p className="ig-settings-help">
                Help people discover your account by using the name you're known by.
              </p>
            </div>
          </div>

          <div className="ig-settings-row">
            <label className="ig-settings-label" htmlFor="username">
              Username
            </label>
            <div>
              <input
                id="username"
                className="ig-input"
                value={form.username}
                onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
              />
              <p className="ig-settings-help">In most cases, you'll be able to change your username back for 14 days.</p>
            </div>
          </div>

          <div className="ig-settings-row">
            <label className="ig-settings-label" htmlFor="website">
              Website
            </label>
            <div>
              <input
                id="website"
                className="ig-input"
                value={form.website}
                onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
                placeholder="Website"
              />
            </div>
          </div>

          <div className="ig-settings-row">
            <label className="ig-settings-label" htmlFor="bio">
              Bio
            </label>
            <div>
              <textarea
                id="bio"
                className="ig-textarea"
                value={form.bio}
                onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
              />
            </div>
          </div>

          <div className="ig-settings-row">
            <label className="ig-settings-label" htmlFor="email">
              Email
            </label>
            <div>
              <input
                id="email"
                className="ig-input"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
          </div>

          <div className="ig-settings-row">
            <label className="ig-settings-label" htmlFor="phone">
              Phone number
            </label>
            <div>
              <input
                id="phone"
                className="ig-input"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </div>
          </div>

          <div className="ig-settings-row">
            <label className="ig-settings-label" htmlFor="gender">
              Gender
            </label>
            <div>
              <select
                id="gender"
                className="ig-select"
                value={form.gender}
                onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))}
              >
                <option>Prefer not to say</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="ig-settings-row">
            <span className="ig-settings-label" />
            <div className="ig-settings-footer">
              <button className="ig-btn-primary" type="submit">
                Submit
              </button>
              <button className="ig-btn-ghost" type="button" onClick={deactivate}>
                Temporarily deactivate my account
              </button>
            </div>
          </div>

          {message && (
            <div className="ig-settings-row">
              <span className="ig-settings-label" />
              <div style={{ color: "#2a7c2a", fontWeight: 700 }}>{message}</div>
            </div>
          )}
        </form>
      </section>
    </div>
  );
};

export default Settings;