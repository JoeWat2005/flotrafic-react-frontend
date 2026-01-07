import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import AuthModal from "../../features/auth/AuthModal";

interface LayoutProps {
  children: (openAuth: () => void) => React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
      {children(openAuth)}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}



