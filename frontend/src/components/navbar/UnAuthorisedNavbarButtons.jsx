import { Link } from "react-router-dom";

export default function UnAuthorisedNavbarButtons() {
  return (
    <>
      <Link to="/login" className={'navbar bg-blue-500 hover:bg-blue-600'}>Login</Link>
      <Link to="/register" className={'navbar bg-slate-200 text-slate-900 hover:bg-slate-300'}>Register</Link>
    </>
  );
}
