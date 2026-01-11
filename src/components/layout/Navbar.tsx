import logo from "../../assets/flotrafic.png";
import { useMemo } from "react";
import { LayoutDashboard, LogOut } from "lucide-react";

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
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.location.href = "/"}>
            <img
              src={logo}
              alt="Flotrafic"
              className="h-8 w-auto"
            />
            <span className="font-bold text-xl text-gray-900 tracking-tight hidden sm:block"></span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {!isAuthed ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={onLogin}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={onLogin}
                  className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-all shadow-sm hover:shadow-indigo-200"
                >
                  Get Started
                </button>
              </div>
            ) : slug ? (
              <>
                {!isDashboard ? (
                  <button
                    onClick={goToDashboard}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-gray-500" />
                    Dashboard
                  </button>
                ) : (
                  <button
                    onClick={goToSite}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    View Site
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors px-2"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                onClick={onLogout}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
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
