import logo from "../../assets/flotrafic.png";

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
  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Flotrafic"
            className="h-10 w-auto object-contain"
          />
        </div>

        {/* Auth CTA */}
        {isAuthed ? (
          <button
            onClick={onLogout}
            className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium hover:bg-gray-100 transition"
          >
            Log out
          </button>
        ) : (
          <button
            onClick={onLogin}
            className="rounded-lg bg-indigo-600 text-white px-5 py-2 text-sm font-medium hover:bg-indigo-700 transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}


