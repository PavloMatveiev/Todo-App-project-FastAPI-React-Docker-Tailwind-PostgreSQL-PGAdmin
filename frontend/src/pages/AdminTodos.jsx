import { useEffect, useState } from "react";
import api from "../api";

export default function AdminTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/todo");
      setTodos(data);
    } catch (e) {
      setErr("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const del = async (id) => {
    if (!confirm("Delete this todo?")) return;
    try {
      await api.delete(`/admin/todo/${id}`);
      setTodos((todos) => todos.filter((t) => t.id !== id));
    } catch {
      alert("Failed to delete todo");
    }
  };

  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">All Todos (admin)</h2>
      {err && <p className="text-rose-600">{err}</p>}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">ID</th>
              <th>Title</th>
              <th>Owner ID</th>
              <th>Complete</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {todos.map((t) => (
              <tr key={t.id} className="border-b">
                <td className="py-2">{t.id}</td>
                <td>{t.title}</td>
                <td>{t.owner_id}</td>
                <td>{t.complete ? "Yes" : "No"}</td>
                <td>
                  <button
                    onClick={() => del(t.id)}
                    className="rounded px-3 py-1 bg-rose-600 text-white hover:bg-rose-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {todos.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-sm opacity-70">
                  No todos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
