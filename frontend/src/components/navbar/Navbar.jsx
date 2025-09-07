import { Link } from "react-router-dom";
import { useAuth } from "../../auth.jsx";
import AuthorisedNavbarButtons from "./AuthorisedNavbarButtons.jsx";
import UnAuthorisedNavbarButtons from "./UnAuthorisedNavbarButtons.jsx";

export default function Navbar() {
  const { isAuthed, isAdmin, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-10 w-full bg-blue-700 text-white shadow">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-semibold">Todo App</Link>
        <div className="flex items-center gap-2">
          {isAuthed ? (
            <AuthorisedNavbarButtons isAdmin={isAdmin} logout={logout} />
          ) : (
            <UnAuthorisedNavbarButtons />
          )}
        </div>
      </div>
    </nav>
  );
}
