import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./store/auth.jsx";
import Navbar from "./components/navbar/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Todos from "./pages/Todos.jsx";
import AdminTodos from "./pages/admin/AdminTodos.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";

export default function App() {
  const { isAuthed, isAdmin } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to={isAuthed ? "/todos" : "/login"} />} />
          <Route path="/login" element={isAuthed ? <Navigate to="/todos" /> : <Login />} />
          <Route path="/register" element={isAuthed ? <Navigate to="/todos" /> : <Register />} />
          <Route path="/todos" element={isAuthed ? <Todos /> : <Navigate to="/login" />} />
          <Route path="/admin/todos" element={isAuthed && isAdmin ? <AdminTodos /> : <Navigate to="/todos" />} />
          <Route path="/admin/users" element={isAuthed && isAdmin ? <AdminUsers /> : <Navigate to="/todos" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
