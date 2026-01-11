import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type MeResponse = {
  slug: string;
  name: string;
};

export default function DashboardLayout() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<MeResponse | null>(null);

  useEffect(() => {
    async function loadMe() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/", { replace: true });
          return;
        }

        const res = await fetch("http://localhost:8000/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          navigate("/", { replace: true });
          return;
        }

        const data: MeResponse = await res.json();
        setMe(data);

        // ✅ ENFORCE SLUG
        if (slug !== data.slug) {
          navigate(`/${data.slug}/dashboard`, { replace: true });
          return;
        }
      } catch {
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    loadMe();
  }, [slug, navigate]);

  // Prevent flash of wrong dashboard
  if (loading || !me) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 border-r bg-gray-50 p-6">
        <h2 className="mb-6 text-lg font-semibold">Dashboard</h2>

        <nav className="flex flex-col gap-3">
          <NavLink to={`/${me.slug}/dashboard`} end>
            Overview
          </NavLink>
          <NavLink to={`/${me.slug}/dashboard/enquiries`}>
            Enquiries
          </NavLink>
          <NavLink to={`/${me.slug}/dashboard/bookings`}>
            Bookings
          </NavLink>
          <NavLink to={`/${me.slug}/dashboard/billing`}>
            Billing
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

