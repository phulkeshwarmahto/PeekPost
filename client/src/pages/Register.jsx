import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { register } from "../redux/slices/authSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });

  const submit = async (event) => {
    event.preventDefault();
    if (!form.email.trim() || !form.username.trim() || !form.fullName.trim() || !form.password.trim()) {
      return;
    }
    const result = await dispatch(register(form));
    if (!result.error) {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="ig-auth-page">
      <section className="ig-auth-card">
        <h1 className="ig-auth-logo">Instagram</h1>

        <form className="ig-auth-form" onSubmit={submit}>
          <input
            className="ig-input"
            placeholder="Mobile Number or Email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <input
            className="ig-input"
            placeholder="Full Name"
            value={form.fullName}
            onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
          />
          <input
            className="ig-input"
            placeholder="Username"
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
          />
          <input
            className="ig-input"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
          <button className="ig-btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {error && <p style={{ color: "#d62976", marginTop: 12 }}>{error}</p>}

        <p style={{ marginTop: 18, fontSize: 14 }}>
          Have an account? <Link className="ig-link" to="/login">Log in</Link>
        </p>
      </section>
    </div>
  );
};

export default Register;