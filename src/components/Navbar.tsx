import logo from "../assets/flotrafic.png";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Flotrafic"
            className="h-10 w-auto object-contain"



          />
        </div>

        {/* CTA */}
        <button className="rounded-lg bg-indigo-600 text-white px-5 py-2 text-sm font-medium hover:bg-indigo-700 transition">
          Contact us
        </button>
      </div>
    </nav>
  );
}
