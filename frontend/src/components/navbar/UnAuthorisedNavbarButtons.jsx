import { Link } from "react-router-dom";

export default function UnAuthorisedNavbarButtons() {
  const common = "rounded-lg px-4 py-1 ";
  return (
    <>
      <Link to="/login" className={`${common}bg-blue-500 hover:bg-blue-600`}>Login</Link>
      <Link to="/register" className={`${common}bg-slate-200 text-slate-900 hover:bg-slate-300`}>Register</Link>
    </>
  );
}
