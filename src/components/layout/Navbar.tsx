import logo from "../../assets/flotrafic.png";
import { useMemo } from "react";

interface NavbarProps {
  isAuthed: boolean;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
}

export default function Navbar({ isAuthed, onLogin, onSignup, onLogout }: NavbarProps) {
  const path = window.location.pathname;
  const isDashboard = path.includes("/dashboard");

  const slug = useMemo(() => {
    const parts = path.split("/").filter(Boolean);
    return parts.length > 0 ? parts[0] : null;
  }, [path]);

  const goToDashboard = () => {
    if (slug) window.location.href = `/${slug}/dashboard`;
  };

  const goToSite = () => {
    if (slug) window.location.href = `/${slug}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => window.location.href = "/"}
          >
            <img src={logo} alt="Flotrafic" className="h-8" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {!isAuthed ? (
              <>
                <button
                  onClick={onLogin}
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors px-4 py-2"
                >
                  Log in
                </button>
                <button
                  onClick={onSignup}
                  className="bg-indigo-600 px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  Get started
                </button>
              </>
            ) : slug ? (
              <>
                <button
                  onClick={isDashboard ? goToSite : goToDashboard}
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors px-4 py-2"
                >
                  {isDashboard ? "View site" : "Dashboard"}
                </button>
                <button
                  onClick={onLogout}
                  className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors px-4 py-2"
                >
                  Log out
                </button>
              </>
            ) : (
              <button
                onClick={onLogout}
                className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors px-4 py-2"
              >
                Log out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}