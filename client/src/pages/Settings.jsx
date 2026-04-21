import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { api } from "../services/api";
import { logoutLocal } from "../redux/slices/authSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    website: user?.website || "",
    avatar: user?.avatar || "",
  });
  const [message, setMessage] = useState("");

  const save = async (event) => {
    event.preventDefault();
    await api.put("/users/me", form);
    setMessage("Profile updated");
  };

  const deactivate = async () => {
    await api.delete("/users/me");
    dispatch(logoutLocal());
  };

  return (
    <section className="card" style={{ display: "grid", gap: "0.7rem" }}>
      <h3>Settings</h3>
      <form onSubmit={save} style={{ display: "grid", gap: "0.55rem" }}>
        <input
          className="input"
          placeholder="Full name"
          value={form.fullName}
          onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
        />
        <textarea
          rows={3}
          placeholder="Bio"
          value={form.bio}
          onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
        />
        <input
          className="input"
          placeholder="Website"
          value={form.website}
          onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
        />
        <input
          className="input"
          placeholder="Avatar URL"
          value={form.avatar}
          onChange={(event) => setForm((prev) => ({ ...prev, avatar: event.target.value }))}
        />
        <button className="btn-primary" type="submit">
          Save Changes
        </button>
      </form>
      <button className="btn-ghost" type="button" onClick={deactivate}>
        Deactivate account
      </button>
      {message && <p>{message}</p>}
    </section>
  );
};

export default Settings;