import logo from "../assets/flotrafic.png";

interface NavbarProps {
  onContact: () => void;
}

export default function Navbar({ onContact }: NavbarProps) {
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

        {/* CTA */}
        <button
          onClick={onContact}
          className="rounded-lg bg-indigo-600 text-white px-5 py-2 text-sm font-medium hover:bg-indigo-700 transition"
        >
          Contact us
        </button>
      </div>
    </nav>
  );
}