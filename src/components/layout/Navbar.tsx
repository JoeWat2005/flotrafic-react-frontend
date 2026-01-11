import logo from "../../assets/flotrafic.png";
import { useMemo } from "react";

interface NavbarProps {
  isAuthed: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Navbar({
  isAuthed,
  onLogin,
  onLogout,
}: NavbarProps) {
  const path = window.location.pathname;

  const isDashboard = path.includes("/dashboard");

  // Extract slug from /:slug or /:slug/dashboard
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
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo (unchanged) */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Flotrafic"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-4">
          {!isAuthed && (
            <button
              onClick={onLogin}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Login
            </button>
          )}

          {isAuthed && slug && (
            <>
              {!isDashboard ? (
                <button
                  onClick={goToDashboard}
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Site dashboard
                </button>
              ) : (
                <button
                  onClick={goToSite}
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Visit site
                </button>
              )}

              <button
                onClick={onLogout}
                className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}




