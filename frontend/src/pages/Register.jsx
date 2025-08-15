import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    role: "user",
    phone_number: "",
    password: "",
    password2: "",
  });
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (form.password !== form.password2) {
      setErr("Passwords do not match");
      return;
    }
    try {
      await api.post("/auth", {
        email: form.email,
        username: form.username,
        first_name: form.first_name,
        last_name: form.last_name,
        role: form.role,
        phone_number: form.phone_number,
        password: form.password,
      });
      navigate("/login", { replace: true });
    } catch (e) {
      let msg = "Registration failed";
      const r = e?.response;
      if (r?.data) {
        const d = r.data;
        if (typeof d === "string") msg = d;
        else if (d.detail) {
          if (Array.isArray(d.detail)) {
            msg = d.detail
              .map((x) => x.msg || x.detail || JSON.stringify(x))
              .join(", ");
          } else msg = d.detail;
        }
      }
      setErr(msg);
    }
  };

  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-semibold">Register</h2>
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label className="label">Email</label>
          <input
            className="input"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Username</label>
          <input
            className="input"
            value={form.username}
            onChange={(e) => set("username", e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">First name</label>
            <input
              className="input"
              value={form.first_name}
              onChange={(e) => set("first_name", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Last name</label>
            <input
              className="input"
              value={form.last_name}
              onChange={(e) => set("last_name", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Role</label>
            <select
              className="input"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div>
            <label className="label">Phone number</label>
            <input
              className="input"
              value={form.phone_number}
              onChange={(e) => set("phone_number", e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label">Verify password</label>
          <input
            className="input"
            type="password"
            value={form.password2}
            onChange={(e) => set("password2", e.target.value)}
            required
          />
        </div>

        {err && <p className="text-sm text-rose-600">{err}</p>}

        <div className="flex gap-2">
          <button type="submit" className="btn btn-primary">
            Sign up
          </button>
          <Link to="/login" className="btn">
            Already have an account?
          </Link>
        </div>
      </form>
    </div>
  );
}
