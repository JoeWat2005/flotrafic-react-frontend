import { useEffect, useState } from "react";

interface Me {
  id: number;
  name: string;
  email: string;
  tier: string;
  is_active: boolean;
}

export default function Dashboard() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    fetch("http://localhost:8000/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setMe(data))
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/";
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 32 }}>Loading…</p>;
  if (!me) return null;

  return (
    <div style={{ padding: 32 }}>
      <h1>Welcome back, {me.name} 👋</h1>

      <div style={{ marginTop: 16, lineHeight: 1.8 }}>
        <p>
          <strong>Tier:</strong> {me.tier}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {me.is_active ? "Active" : "Suspended"}
        </p>
      </div>
    </div>
  );
}

