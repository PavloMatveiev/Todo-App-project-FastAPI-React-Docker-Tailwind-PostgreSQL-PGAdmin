import { Link, useNavigate } from "react-router-dom";

export default function AuthorisedNavbarButtons({ isAdmin, logout }) {
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <Link to="/todos" className={'navbar-button bg-emerald-600 hover:bg-emerald-700'}>Home</Link>
      {isAdmin && (
        <>
          <Link to="/admin/todos" className={'navbar-button bg-purple-600 hover:bg-purple-700'}>All Todos</Link>
          <Link to="/admin/users" className={'navbar-button bg-indigo-600 hover:bg-indigo-700'}>Users</Link>
        </>
      )}
      <button onClick={onLogout} className={'navbar-button bg-rose-600 hover:bg-rose-700'}>Logout</button>
    </>
  );
}
