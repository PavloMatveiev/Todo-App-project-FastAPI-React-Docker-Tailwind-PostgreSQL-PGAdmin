import { useEffect, useActionState, useState } from "react";
import api from "../../api";
import Label from "../../components/input/Label";

export default function Todos() {
  const [formEditState, setFormEditState] = useState({});
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const isEditing = Object.keys(formEditState).length !== 0;

  async function loginAction(prevState, formData) {
    const title = formData.get('title');
    const description = formData.get('description');
    const priority = formData.get('priority');
    const complete = formData.has('complete');

    if(!isEditing){
      try {
        await api.post("/todos/todo", {
          title,
          description,
          priority: Number(priority),
          complete,
        });
        refresh();
      } catch (error) {
        null
      }
    } else {
      try {
        await api.put(`/todos/todo/${formEditState.id}`, {
          title,
          description,
          priority: Number(priority),
          complete,
        });
        setFormEditState({});
        refresh();
      } catch (error) {
        null
      }
    }
  }

  const [formState, formAction] = useActionState(loginAction, {});

  const refresh = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/todos/");
      setList(prev => {
        const indexById = new Map(prev.map((todo, index) => [todo.id, index]));
        const next = (data || []).slice();
        next.sort((a, b) => (indexById.get(a.id) ?? Infinity) - (indexById.get(b.id) ?? Infinity));
        return next;
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh().catch(() => setLoading(false));
  }, []);

  const startEdit = (todo) => {
    setFormEditState({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      complete: todo.complete,
    });
  };

  const cancel = () => {
    setFormEditState({});
  };

  const remove = async (id) => {
    if (!confirm("Delete this todo?")) return;
    await api.delete(`/todos/todo/${id}`);
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="main-title">
          {isEditing ? "Edit todo" : "Make a new todo"}
        </h2>
        <form key={formEditState.id ?? 'new'} action={formAction} className="grid grid-cols-1 gap-4">
          <Label name="title" title="Title" defaultValue={formEditState?.title}/>
          <Label name="description" title="Description" rows={3} defaultValue={formEditState?.description}/>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Label name="priority" title="Priority" options={[1, 2, 3, 4, 5]} defaultValue={formEditState?.priority}/>
            <Label name="complete" title="Complete" type = "checkbox" defaultChecked={formEditState?.complete}/>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Save" : "Add new todo"}
            </button>
            {isEditing && (
              <button type="button" className="btn" onClick={cancel}>Cancel</button>
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
                {list.map((todo, index) => (
                  <tr key={todo.id} className={todo.complete ? "bg-emerald-50" : ""}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className={`px-4 py-2 ${todo.complete ? "line-through text-gray-500" : ""}`}>
                      {todo.title}
                    </td>
                    <td className="px-4 py-2">{todo.priority}</td>
                    <td className="px-4 py-2">{todo.complete ? "Yes" : "No"}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button className="btn" onClick={() => startEdit(todo)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => remove(todo.id)}>Delete</button>
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
