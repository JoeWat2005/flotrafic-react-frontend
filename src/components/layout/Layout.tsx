import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import AuthModal from "../../features/auth/AuthModal";

interface LayoutProps {
  children: (openAuth: (mode?: "login" | "signup") => void) => React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isAuthed, setIsAuthed] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    setIsAuthed(!!localStorage.getItem("token"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthed(false);
    window.location.href = "/";
  };

  const openAuth = (mode: "login" | "signup" = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <>
      <Navbar 
        isAuthed={isAuthed} 
        onLogin={() => openAuth("login")} 
        onSignup={() => openAuth("signup")}
        onLogout={logout} 
      />
      {children(openAuth)}
      <AuthModal 
        open={authOpen} 
        onClose={() => setAuthOpen(false)} 
        initialMode={authMode}
      />
    </>
  );
}


