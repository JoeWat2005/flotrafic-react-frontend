import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MessageSquare, LayoutTemplate, ArrowRight, TrendingUp, Calendar, Clock } from "lucide-react";

interface Me {
  id: number;
  name: string;
  slug: string;
  tier: string;
  is_active: boolean;
}

interface Stats {
  total: number;
  unread: number;
  new: number;
  visits?: number;
}

interface Booking {
  id: number;
  start_time: string;
  end_time: string;
}

export default function DashboardOverview() {
  const { slug } = useParams<{ slug: string }>();
  const [me, setMe] = useState<Me | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [nextBooking, setNextBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchData = async () => {
      try {
        const [meRes, statsRes, bookingRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/me/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/enquiries/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${import.meta.env.VITE_API_URL}/bookings/next`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (meRes.ok) setMe(await meRes.json());
        if (statsRes.ok) setStats(await statsRes.json());
        if (bookingRes.ok) {
            const booking = await bookingRes.json();
            if (booking) setNextBooking(booking);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );
  
  if (!me) return null;

  return (
    <div className="max-w-6xl animate-fade-in-up">
      {/* Welcome Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {me.name} 👋</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your business today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Next Booking */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500">Next Booking</h3>
                <div className="p-2 bg-orange-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-orange-600" />
                </div>
            </div>
            {nextBooking ? (
                <div className="mt-auto">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                        {new Date(nextBooking.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        {new Date(nextBooking.start_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            ) : (
                <div className="mt-auto">
                    <div className="text-lg font-medium text-gray-400">No upcoming bookings</div>
                    <Link to={`/${slug}/dashboard/bookings`} className="text-sm text-indigo-600 hover:underline mt-1 block">View calendar</Link>
                </div>
            )}
        </div>

        {/* Enquiries Stat */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">New Enquiries</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-3xl font-bold text-gray-900">{stats?.new || 0}</span>
            <span className="text-sm text-gray-500">awaiting response</span>
          </div>
        </div>

         {/* Website Status */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Website Status</h3>
            <div className="p-2 bg-purple-50 rounded-lg">
              <LayoutTemplate className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-auto">
              <div className="flex items-center gap-2 mb-1">
                <div className={`h-2.5 w-2.5 rounded-full ${me.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xl font-bold text-gray-900">{me.is_active ? 'Active' : 'Offline'}</span>
              </div>
              <p className="text-sm text-gray-500">
                {me.tier.charAt(0).toUpperCase() + me.tier.slice(1)} Plan
              </p>
          </div>
        </div>

         {/* Growth / Placeholder */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <span className="text-3xl font-bold text-gray-900">{stats?.visits || 0}</span>
            <span className="text-sm text-gray-500">all time</span>
          </div>
        </div>
      </div>

      {/* Recent Activity / Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to={`/${slug}/dashboard/website`}
            className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group text-center"
          >
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <LayoutTemplate className="h-6 w-6" />
            </div>
            <span className="font-medium text-gray-900">Customize Site</span>
            <span className="text-xs text-gray-500 mt-1">Update colors & content</span>
          </Link>

          <Link
            to={`/${slug}/dashboard/enquiries`}
            className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group text-center"
          >
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <MessageSquare className="h-6 w-6" />
            </div>
            <span className="font-medium text-gray-900">Read Enquiries</span>
            <span className="text-xs text-gray-500 mt-1">Check customer messages</span>
          </Link>
          
          <Link
            to={`/${slug}/dashboard/billing`}
            className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group text-center"
          >
            <div className="p-3 bg-green-100 text-green-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="font-medium text-gray-900">Manage Billing</span>
            <span className="text-xs text-gray-500 mt-1">View invoices & plan</span>
          </Link>
          
          <a
            href={`/${me.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group text-center"
          >
            <div className="p-3 bg-purple-100 text-purple-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <ArrowRight className="h-6 w-6" />
            </div>
            <span className="font-medium text-gray-900">Visit Live Site</span>
            <span className="text-xs text-gray-500 mt-1">See what customers see</span>
          </a>
        </div>
      </div>
    </div>
  );
}
