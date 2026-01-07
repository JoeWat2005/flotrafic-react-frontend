import { useEffect, useState } from "react";

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

/* =========================
   Mobile enquiry card
   ========================= */
function EnquiryCard({
  enquiry,
  onRead,
  onStatus,
}: {
  enquiry: Enquiry;
  onRead: (id: number) => void;
  onStatus: (id: number, status: EnquiryStatus) => void;
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        background: enquiry.is_read ? "#fff" : "#f8fafc",
      }}
    >
      <strong>{enquiry.name}</strong>
      <p style={{ margin: "4px 0", color: "#555" }}>
        {enquiry.email}
      </p>

      <p style={{ marginTop: 8 }}>{enquiry.message}</p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 12,
        }}
      >
        <select
          value={enquiry.status}
          onChange={(e) =>
            onStatus(
              enquiry.id,
              e.target.value as EnquiryStatus
            )
          }
        >
          <option value="new">New</option>
          <option value="in_progress">In progress</option>
          <option value="resolved">Resolved</option>
        </select>

        {!enquiry.is_read && (
          <button onClick={() => onRead(enquiry.id)}>
            Mark read
          </button>
        )}
      </div>
    </div>
  );
}

export default function DashboardEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
      return;
    }

    fetch("http://localhost:8000/enquiries/", {
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
    await fetch(
      `http://localhost:8000/enquiries/${id}/read`,
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
  };

  const updateStatus = async (
    id: number,
    status: EnquiryStatus
  ) => {
    await fetch(
      `http://localhost:8000/enquiries/${id}/status?status=${status}`,
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
  };

  if (loading) return <p>Loading enquiries…</p>;

  if (error === "upgrade") {
    return (
      <>
        <h1>Enquiries</h1>
        <div
          style={{
            marginTop: 24,
            padding: 24,
            border: "1px solid #facc15",
            background: "#fffbeb",
            borderRadius: 8,
          }}
        >
          <strong>🔒 Upgrade required</strong>
          <p style={{ marginTop: 8 }}>
            Managing enquiries is available on the{" "}
            <strong>Managed</strong> plan and above.
          </p>
        </div>
      </>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h1>Enquiries</h1>

      {enquiries.length === 0 ? (
        <p style={{ marginTop: 16 }}>
          No enquiries yet.
        </p>
      ) : isMobile ? (
        /* =========================
           MOBILE VIEW
           ========================= */
        <div style={{ marginTop: 16 }}>
          {enquiries.map((e) => (
            <EnquiryCard
              key={e.id}
              enquiry={e}
              onRead={markRead}
              onStatus={updateStatus}
            />
          ))}
        </div>
      ) : (
        /* =========================
           DESKTOP TABLE (unchanged)
           ========================= */
        <table
          style={{
            width: "100%",
            marginTop: 24,
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th align="left">Name</th>
              <th align="left">Email</th>
              <th align="left">Message</th>
              <th>Status</th>
              <th>Read</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {enquiries.map((e) => (
              <tr
                key={e.id}
                style={{
                  borderTop: "1px solid #e5e7eb",
                  background: e.is_read
                    ? "transparent"
                    : "#f8fafc",
                }}
              >
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td
                  style={{
                    maxWidth: 300,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={e.message}
                >
                  {e.message}
                </td>

                <td>
                  <select
                    value={e.status}
                    onChange={(ev) =>
                      updateStatus(
                        e.id,
                        ev.target.value as EnquiryStatus
                      )
                    }
                  >
                    <option value="new">New</option>
                    <option value="in_progress">
                      In progress
                    </option>
                    <option value="resolved">
                      Resolved
                    </option>
                  </select>
                </td>

                <td>{e.is_read ? "✅" : "❌"}</td>

                <td>
                  {!e.is_read && (
                    <button
                      onClick={() => markRead(e.id)}
                    >
                      Mark read
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
