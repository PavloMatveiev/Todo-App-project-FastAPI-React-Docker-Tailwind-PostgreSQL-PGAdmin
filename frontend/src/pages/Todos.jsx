import { useEffect, useState } from "react";
import api from "../api";

export default function Todos() {
  const empty = { title: "", description: "", priority: 3, complete: false };
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const refresh = async () => {
    setLoading(true);
    const { data } = await api.get("/todos/");
    setList(data || []);
    setLoading(false);
  };

  useEffect(() => {
    refresh().catch(() => setLoading(false));
  }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post("/todos/todo", {
      title: form.title,
      description: form.description,
      priority: Number(form.priority),
      complete: !!form.complete,
    });
    setForm(empty);
    refresh();
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setForm({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      complete: todo.complete,
    });
  };

  const save = async (e) => {
    e.preventDefault();
    await api.put(`/todos/todo/${editingId}`, {
      title: form.title,
      description: form.description,
      priority: Number(form.priority),
      complete: !!form.complete,
    });
    setEditingId(null);
    setForm(empty);
    refresh();
  };

  const cancel = () => {
    setEditingId(null);
    setForm(empty);
  };

  const remove = async (id) => {
    if (!confirm("Delete this todo?")) return;
    await api.delete(`/todos/todo/${id}`);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold">
          {editingId ? "Edit todo" : "Make a new todo"}
        </h2>
        <form
          onSubmit={editingId ? save : create}
          className="grid grid-cols-1 gap-4"
        >
          <div>
            <label className="label">Title</label>
            <input
              className="input"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea
              className="input"
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Priority</label>
              <select
                className="select"
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 mt-6 sm:mt-0">
              <input
                type="checkbox"
                className="checkbox"
                checked={form.complete}
                onChange={(e) => set("complete", e.target.checked)}
              />
              <span>Complete</span>
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Save" : "Add new todo"}
            </button>
            {editingId && (
              <button type="button" className="btn" onClick={cancel}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h3 className="mb-4 text-lg font-semibold">Your todos</h3>
        {loading ? (
          <p>Loading…</p>
        ) : list.length === 0 ? (
          <p className="text-sm text-gray-500">No todos yet.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-sm">
                <tr>
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Info</th>
                  <th className="px-4 py-2">Priority</th>
                  <th className="px-4 py-2">Complete</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((t, i) => (
                  <tr key={t.id} className={t.complete ? "bg-emerald-50" : ""}>
                    <td className="px-4 py-2">{i + 1}</td>
                    <td
                      className={`px-4 py-2 ${
                        t.complete ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {t.title}
                    </td>
                    <td className="px-4 py-2">{t.priority}</td>
                    <td className="px-4 py-2">{t.complete ? "Yes" : "No"}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button className="btn" onClick={() => startEdit(t)}>
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => remove(t.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
