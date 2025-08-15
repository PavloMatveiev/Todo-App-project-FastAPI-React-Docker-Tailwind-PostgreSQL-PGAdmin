import { useEffect, useState } from "react";
import api from "../api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (e) {
      setErr("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const delUser = async (id) => {
    if (!confirm("Delete this user and ALL their todos?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((u) => u.filter((x) => x.id !== id));
    } catch {
      alert("Failed to delete user");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Users (admin)</h2>
      {err && <p className="text-rose-600">{err}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="py-2">{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.is_active ? "Yes" : "No"}</td>
                <td>
                  <button
                    onClick={() => delUser(u.id)}
                    className="rounded px-3 py-1 bg-rose-600 text-white hover:bg-rose-700"
                  >
                    Delete user
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-sm opacity-70">
                  No users
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
