import { NavLink, Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar, 
  CreditCard, 
  LayoutTemplate,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User
} from "lucide-react";
import logo from "../../assets/flotrafic.png";

type MeResponse = {
  slug: string;
  name: string;
  email: string;
};

export default function DashboardLayout() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    async function loadMe() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/", { replace: true });
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_URL}/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          navigate("/", { replace: true });
          return;
        }

        const data: MeResponse = await res.json();
        setMe(data);

        if (slug !== data.slug) {
          navigate(`/${data.slug}/dashboard`, { replace: true });
        }
      } catch {
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    }
    loadMe();
  }, [slug, navigate]);

  if (loading || !me) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Overview", path: "", icon: LayoutDashboard },
    { name: "Website", path: "website", icon: LayoutTemplate },
    { name: "Enquiries", path: "enquiries", icon: MessageSquare },
    { name: "Bookings", path: "bookings", icon: Calendar },
    { name: "Billing", path: "billing", icon: CreditCard },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="flex h-screen bg-[#F8F9FC] overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Logo Area */}
          <div className="flex h-16 items-center px-6 border-b border-gray-100">
            <img src={logo} alt="Flotrafic" className="h-8 w-auto" />
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mb-6 px-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Business</p>
              <h2 className="mt-1 truncate font-bold text-gray-900">{me.name}</h2>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path === "" ? `/${me.slug}/dashboard` : `/${me.slug}/dashboard/${item.path}`}
                  end={item.path === ""}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <item.icon className="h-4.5 w-4.5" />
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden animate-fade-in-up">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm z-20">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="p-2 -ml-2 text-gray-600 md:hidden hover:bg-gray-100 rounded-md"
             >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="text-lg font-semibold text-gray-900 md:hidden">Flotrafic</h1>
          </div>

          <div className="flex items-center gap-4">
             <a
              href={`/${me.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-gray-200 hover:border-indigo-200"
            >
              <ExternalLink className="h-4 w-4" />
              Visit Site
            </a>

            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                  {me.name.charAt(0).toUpperCase()}
                </div>
              </button>

              {userMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setUserMenuOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-sm font-medium text-gray-900 truncate">{me.name}</p>
                      <p className="text-xs text-gray-500 truncate">{me.email}</p>
                    </div>
                    <a
                      href={`/${me.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block sm:hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Visit Site
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8F9FC] p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in-up" key={location.pathname}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {(mobileMenuOpen || window.location.pathname.includes('/dashboard/website')) && (
        <div 
          className={`fixed inset-0 z-20 bg-black/50 md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
