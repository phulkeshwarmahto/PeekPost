import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../redux/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("user1@peekpost.dev");
  const [password, setPassword] = useState("password123");
  const { loading, error } = useSelector((state) => state.auth);

  const submit = async (event) => {
    event.preventDefault();
    const result = await dispatch(login({ emailOrUsername, password }));
    if (!result.error) {
      navigate("/");
    }
  };

  return (
    <section className="card" style={{ maxWidth: 420, margin: "4rem auto" }}>
      <h2>Login</h2>
      <form style={{ display: "grid", gap: "0.6rem" }} onSubmit={submit}>
        <input className="input" value={emailOrUsername} onChange={(event) => setEmailOrUsername(event.target.value)} />
        <input
          className="input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      {error && <p style={{ color: "#b5122f" }}>{error}</p>}
      <p>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </section>
  );
};

export default Login;