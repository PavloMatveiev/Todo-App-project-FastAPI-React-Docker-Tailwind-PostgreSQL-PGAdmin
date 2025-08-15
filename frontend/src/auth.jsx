import React, { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);

function decodeJwt(token) {
  try {
    const [, payload] = token.split(".");
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json); // { sub, id, role, exp, ... }
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("access_token")
  );
  const [claims, setClaims] = useState(() => (token ? decodeJwt(token) : null));

  useEffect(() => {
    const onStorage = () => {
      const t = localStorage.getItem("access_token");
      setToken(t);
      setClaims(t ? decodeJwt(t) : null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (newToken) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
    setClaims(decodeJwt(newToken));
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setClaims(null);
  };

  const isAuthed = !!token;
  const isAdmin = claims?.role === "admin";

  return (
    <AuthCtx.Provider
      value={{ token, claims, isAuthed, isAdmin, login, logout }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
