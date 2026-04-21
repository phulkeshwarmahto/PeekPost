import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { register } from "../redux/slices/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: "user1",
    email: "user1@peekpost.dev",
    password: "password123",
    fullName: "User One",
  });

  const submit = async (event) => {
    event.preventDefault();
    const result = await dispatch(register(form));
    if (!result.error) {
      navigate("/");
    }
  };

  return (
    <section className="card" style={{ maxWidth: 420, margin: "4rem auto" }}>
      <h2>Register</h2>
      <form style={{ display: "grid", gap: "0.6rem" }} onSubmit={submit}>
        <input
          className="input"
          placeholder="Username"
          value={form.username}
          onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
        />
        <input
          className="input"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />
        <input
          className="input"
          placeholder="Full name"
          value={form.fullName}
          onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        />
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      {error && <p style={{ color: "#b5122f" }}>{error}</p>}
      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </section>
  );
};

export default Register;