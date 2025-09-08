import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api";

const AuthCtx = createContext(null);

function decodeJwtRole(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || payload.roles?.[0] || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
      setIsAdmin(decodeJwtRole(token) === "admin");
    } else {
      delete api.defaults.headers.common.Authorization;
      setIsAdmin(false);
    }
  }, [token]);

  const value = useMemo(
    () => ({
      isAuthed: !!token,
      isAdmin,
      login: (t) => {
        localStorage.setItem("token", t);
        setToken(t);
      },
      logout: () => {
        localStorage.removeItem("token");
        setToken(null);
      },
    }),
    [token, isAdmin]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
