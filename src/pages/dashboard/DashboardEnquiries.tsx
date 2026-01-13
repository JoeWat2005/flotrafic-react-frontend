import { useEffect, useState } from "react";
import { Trash2, X, Calendar, User, Mail, MessageSquare } from "lucide-react";

type EnquiryStatus = "new" | "in_progress" | "resolved";

interface Enquiry {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
  status: EnquiryStatus;
}

const STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  in_progress: "In Progress",
  resolved: "Resolved",
};

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-600/20",
  in_progress: "bg-amber-50 text-amber-700 ring-amber-600/20",
  resolved: "bg-green-50 text-green-700 ring-green-600/20",
};

/* =========================
   Status Badge Component
   ========================= */
function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span
      className={`
        inline-flex items-center rounded-md px-2 py-1 
        text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}
      `}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

/* =========================
   Mobile enquiry card
   ========================= */
function EnquiryCard({
  enquiry,
  onRead,
  onStatus,
  onDelete,
  onClick,
}: {
  enquiry: Enquiry;
  onRead: (id: number) => void;
  onStatus: (id: number, status: EnquiryStatus) => void;
  onDelete: (id: number) => void;
  onClick: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className={`
      cursor-pointer rounded-xl border p-5 shadow-sm transition-all
      ${enquiry.is_read ? "bg-white border-gray-200" : "bg-blue-50/50 border-blue-100 ring-1 ring-blue-100"}
    `}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{enquiry.name}</h3>
          <p className="text-sm text-gray-500">{enquiry.email}</p>
        </div>
        <StatusBadge status={enquiry.status} />
      </div>

      <p className="text-gray-700 text-sm mb-4 line-clamp-3">
        {enquiry.message}
      </p>

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
        <select
          value={enquiry.status}
          onChange={(e) => onStatus(enquiry.id, e.target.value as EnquiryStatus)}
          className="
            block w-full max-w-[140px] rounded-md border-0 py-1.5 pl-3 pr-8 
            text-gray-900 ring-1 ring-inset ring-gray-300 
            focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6
            bg-white
          "
        >
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <div className="flex items-center gap-2">
           {!enquiry.is_read && (
            <button
              onClick={() => onRead(enquiry.id)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Mark read
            </button>
          )}
          {enquiry.status === 'resolved' && (
             <button 
                onClick={() => onDelete(enquiry.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Delete Enquiry"
             >
               <Trash2 className="h-4 w-4" />
             </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/enquiries/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 403) {
          throw new Error("upgrade");
        }
        if (!res.ok) {
          throw new Error("failed");
        }
        return res.json();
      })
      .then(setEnquiries)
      .catch((err) => {
        if (err.message === "upgrade") {
          setError("upgrade");
        } else {
          setError("Failed to load enquiries");
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  const markRead = async (id: number) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/enquiries/${id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, is_read: true } : e
        )
      );
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  const updateStatus = async (
    id: number,
    status: EnquiryStatus
  ) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/enquiries/${id}/status?status=${status}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, status } : e
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const deleteEnquiry = async (id: number) => {
    if (!confirm("Are you sure you want to delete this enquiry? This cannot be undone.")) return;

    try {
       const res = await fetch(`${import.meta.env.VITE_API_URL}/enquiries/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        const data = await res.json();
        alert(data.detail || "Failed to delete enquiry");
        return;
      }

      setEnquiries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Failed to delete enquiry");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error === "upgrade") {
    return (
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Enquiries</h1>
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <h3 className="font-semibold text-yellow-900">Upgrade Required</h3>
              <p className="mt-1 text-sm text-yellow-700">
                Managing enquiries is available on the <strong>Managed</strong> plan and above. 
                <a href="/dashboard/billing" className="ml-1 underline hover:text-yellow-800">Upgrade now</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
          {enquiries.length} Total
        </span>
      </div>

      {enquiries.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No enquiries yet</h3>
          <p className="mt-1 text-sm text-gray-500">Your customer messages will appear here.</p>
        </div>
      ) : (
        <>
          {/* Mobile View */}
          <div className="md:hidden space-y-4">
            {enquiries.map((e) => (
              <EnquiryCard
                key={e.id}
                enquiry={e}
                onRead={markRead}
                onStatus={updateStatus}
                onDelete={deleteEnquiry}
                onClick={() => setSelectedEnquiry(e)}
              />
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {enquiries.map((e) => (
                  <tr 
                    key={e.id} 
                    onClick={() => setSelectedEnquiry(e)}
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${!e.is_read ? 'bg-blue-50/30' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={e.status}
                        onChange={(ev) => updateStatus(e.id, ev.target.value as EnquiryStatus)}
                        className="
                          block w-full rounded-md border-0 py-1.5 pl-3 pr-8 
                          text-gray-900 ring-1 ring-inset ring-gray-300 
                          focus:ring-2 focus:ring-indigo-600 sm:text-xs sm:leading-6
                          bg-transparent cursor-pointer
                        "
                        onClick={(ev) => ev.stopPropagation()}
                      >
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{e.name}</div>
                      <div className="text-sm text-gray-500">{e.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2 max-w-[200px] md:max-w-md whitespace-normal break-words" title={e.message}>
                        {e.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(e.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       <div className="flex items-center justify-end gap-3">
                        {!e.is_read && (
                          <button
                            onClick={() => markRead(e.id)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full transition-colors"
                          >
                            Mark read
                          </button>
                        )}
                        {e.status === 'resolved' && (
                           <button 
                            onClick={() => deleteEnquiry(e.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                            title="Delete Resolved Enquiry"
                           >
                              <Trash2 className="h-4 w-4" />
                           </button>
                        )}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  Enquiry Details
                  <StatusBadge status={selectedEnquiry.status} />
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Received on {new Date(selectedEnquiry.created_at).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedEnquiry(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex-1 flex items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <User className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Name</p>
                      <p className="font-medium text-gray-900">{selectedEnquiry.name}</p>
                   </div>
                </div>
                <div className="w-px bg-gray-200 hidden sm:block"></div>
                <div className="flex-1 flex items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Mail className="h-5 w-5" />
                   </div>
                   <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
                      <a href={`mailto:${selectedEnquiry.email}`} className="font-medium text-indigo-600 hover:underline">
                        {selectedEnquiry.email}
                      </a>
                   </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                  Message
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedEnquiry.message}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
                 <a 
                   href={`mailto:${selectedEnquiry.email}`}
                   className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium flex items-center gap-2"
                 >
                   <Mail className="h-4 w-4" />
                   Reply via Email
                 </a>
                 <button
                   onClick={() => setSelectedEnquiry(null)}
                   className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                 >
                   Close
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
