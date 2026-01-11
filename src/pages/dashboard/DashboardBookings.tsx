import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Clock, Plus, Trash2, X, AlertCircle } from "lucide-react";

interface Enquiry {
  id: number;
  name: string;
  email: string;
}

interface Booking {
  id: number;
  start_time: string;
  end_time: string;
  enquiry?: Enquiry;
}

export default function DashboardBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ start: "", end: "", enquiryId: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [bookingsRes, enquiriesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/bookings/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${import.meta.env.VITE_API_URL}/enquiries/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      if (bookingsRes.status === 403) throw new Error("upgrade");
      
      if (bookingsRes.ok) {
        setBookings(await bookingsRes.json());
      }
      
      if (enquiriesRes.ok) {
        setEnquiries(await enquiriesRes.json());
      }

    } catch (err: any) {
      if (err.message === "upgrade") setError("upgrade");
      else setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchData();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete booking");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const payload: any = {
        start_time: new Date(formData.start).toISOString(),
        end_time: new Date(formData.end).toISOString(),
        business_id: 0, // This will be ignored/overwritten by the backend based on auth token
      };

      if (formData.enquiryId) {
        payload.enquiry_id = parseInt(formData.enquiryId);
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/bookings/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to create booking");
      }

      setIsModalOpen(false);
      setFormData({ start: "", end: "", enquiryId: "" });
      
      // Refresh bookings
      const updatedRes = await fetch(`${import.meta.env.VITE_API_URL}/bookings/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (updatedRes.ok) {
        setBookings(await updatedRes.json());
      }

    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error === "upgrade") {
    return (
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h1>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <CalendarIcon className="h-8 w-8 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Automate your schedule</h2>
          <p className="text-gray-600 max-w-lg mx-auto mb-6">
            Upgrade to the <strong>Autopilot</strong> plan to accept bookings directly from your website and manage your calendar effortlessly.
          </p>
          <a 
            href="billing"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
          >
            Upgrade to Autopilot
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500">Manage your upcoming schedule.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Booking
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center bg-gray-50">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
          <p className="text-gray-500 mt-1">Your schedule is currently empty.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
          >
            Create your first booking
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => {
                const start = new Date(booking.start_time);
                const end = new Date(booking.end_time);
                const durationHrs = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

                return (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hidden md:flex">
                          <CalendarIcon className="h-5 w-5" />
                        </div>
                        <div className="md:ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {start.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="text-sm text-gray-500">
                            {start.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                      {booking.enquiry ? (
                        <div className="flex flex-col">
                            <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-1">
                              {booking.enquiry.name}
                            </span>
                            <span className="text-xs text-gray-500 md:hidden">{booking.enquiry.email}</span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Manual Booking
                        </span>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {durationHrs.toFixed(1)} hr{durationHrs !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDelete(booking.id)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                        title="Cancel Booking"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Manual Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add Booking</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.start}
                  onChange={e => setFormData({...formData, start: e.target.value})}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.end}
                  onChange={e => setFormData({...formData, end: e.target.value})}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link to Enquiry (Optional)</label>
                <select
                  value={formData.enquiryId}
                  onChange={e => setFormData({...formData, enquiryId: e.target.value})}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">-- No linked enquiry --</option>
                  {enquiries.map((enq) => (
                    <option key={enq.id} value={enq.id}>
                      {enq.name} ({enq.email})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Select an existing customer enquiry to link this booking.
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
                >
                  {submitting ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
