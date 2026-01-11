import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import AuthModal from "../../features/auth/AuthModal";

export default function PublicLayout() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    setIsAuthed(!!localStorage.getItem("token"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthed(false);
    window.location.href = "/";
  };

  const openAuth = () => setAuthOpen(true);

  return (
    <>
      <Navbar isAuthed={isAuthed} onLogin={openAuth} onLogout={logout} />
      <Outlet context={{ openAuth }} />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
