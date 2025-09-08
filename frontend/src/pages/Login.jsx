import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../store/auth.jsx";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const body = new URLSearchParams();
      body.set("username", username);
      body.set("password", password);
      const { data } = await api.post("/auth/token", body.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      login(data.access_token);
      navigate("/todos", { replace: true });
    } catch (e) {
      setErr("Invalid credentials");
    }
  };

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-semibold">Login</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">Username</label>
          <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {err && <p className="text-sm text-rose-600">{err}</p>}
        <button type="submit" className="btn btn-primary">Login</button>
        <Link to="/register" className="ml-2 text-sm underline">No account? Register</Link>
      </form>
    </div>
  );
}
