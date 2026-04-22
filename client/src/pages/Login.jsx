import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../redux/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error } = useSelector((state) => state.auth);

  const submit = async (event) => {
    event.preventDefault();
    const result = await dispatch(login({ emailOrUsername, password }));
    if (!result.error) {
      navigate("/");
    }
  };

  return (
    <div className="ig-auth-page">
      <section className="ig-auth-card">
        <h1 className="ig-auth-logo">Instagram</h1>

        <form className="ig-auth-form" onSubmit={submit}>
          <input
            className="ig-input"
            value={emailOrUsername}
            onChange={(event) => setEmailOrUsername(event.target.value)}
            placeholder="Phone number, username, or email"
          />
          <input
            className="ig-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
          />
          <button className="ig-btn-primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Log in"}
          </button>
        </form>
        <p className="ig-muted" style={{ marginTop: 10, fontSize: 12 }}>
          First time here? Create a profile in Sign up, then log in with any password.
        </p>

        {error && <p style={{ color: "#d62976", marginTop: 12 }}>{error}</p>}

        <p style={{ marginTop: 18, fontSize: 14 }}>
          Don&apos;t have an account? <Link className="ig-link" to="/register">Sign up</Link>
        </p>
      </section>
    </div>
  );
};

export default Login;