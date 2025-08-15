import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthed, isAdmin, logout } = useAuth();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-10 w-full bg-blue-700 text-white shadow">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-semibold">
          Todo App
        </Link>

        <div className="flex items-center gap-2">
          {isAuthed && (
            <>
              <Link
                to="/todos"
                className="rounded-lg px-4 py-1 bg-emerald-600 hover:bg-emerald-700"
              >
                Home
              </Link>
              {isAdmin && (
                <>
                  <Link
                    to="/admin/todos"
                    className="rounded-lg px-4 py-1 bg-purple-600 hover:bg-purple-700"
                  >
                    All Todos
                  </Link>
                  <Link
                    to="/admin/users"
                    className="rounded-lg px-4 py-1 bg-indigo-600 hover:bg-indigo-700"
                  >
                    Users
                  </Link>
                </>
              )}
              <button
                onClick={onLogout}
                className="rounded-lg px-4 py-1 bg-rose-600 hover:bg-rose-700"
              >
                Logout
              </button>
            </>
          )}
          {!isAuthed && (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-1 bg-blue-500 hover:bg-blue-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg px-4 py-1 bg-slate-200 text-slate-900 hover:bg-slate-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
