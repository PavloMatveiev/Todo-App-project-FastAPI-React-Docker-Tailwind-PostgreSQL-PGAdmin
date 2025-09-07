import { Link, useNavigate } from "react-router-dom";

export default function AuthorisedNavbarButtons({ isAdmin, logout }) {
  const common = "rounded-lg px-4 py-1 ";
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <Link to="/todos" className={`${common}bg-emerald-600 hover:bg-emerald-700`}>Home</Link>
      {isAdmin && (
        <>
          <Link to="/admin/todos" className={`${common}bg-purple-600 hover:bg-purple-700`}>All Todos</Link>
          <Link to="/admin/users" className={`${common}bg-indigo-600 hover:bg-indigo-700`}>Users</Link>
        </>
      )}
      <button onClick={onLogout} className={`${common}bg-rose-600 hover:bg-rose-700`}>Logout</button>
    </>
  );
}
