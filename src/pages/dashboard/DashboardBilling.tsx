import { useEffect, useState } from "react";

interface BillingOverview {
  tier: string;
  subscription_status: string | null;
  current_period_end: string | null;
  is_active: boolean;
}

export default function DashboardBilling() {
  const [billing, setBilling] =
    useState<BillingOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8000/billing/overview", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setBilling)
      .finally(() => setLoading(false));
  }, [token]);

  const startCheckout = async (tier: string) => {
    const res = await fetch(
      `http://localhost:8000/billing/checkout?tier=${tier}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    window.location.href = data.checkout_url;
  };

  const openPortal = async () => {
    const res = await fetch(
      "http://localhost:8000/billing/portal",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    window.location.href = data.url;
  };

  if (loading) return <p>Loading billing…</p>;
  if (!billing) return <p>Failed to load billing</p>;

  return (
    <>
      <h1>Billing</h1>

      <div
        style={{
          marginTop: 24,
          padding: 24,
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          maxWidth: 480,
        }}
      >
        <p>
          <strong>Plan:</strong>{" "}
          {billing.tier.toUpperCase()}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {billing.subscription_status ?? "none"}
        </p>

        {billing.current_period_end && (
          <p>
            <strong>Renews:</strong>{" "}
            {new Date(
              billing.current_period_end
            ).toLocaleDateString()}
          </p>
        )}

        {!billing.is_active && (
          <p style={{ color: "#b91c1c" }}>
            ⚠ Subscription inactive
          </p>
        )}

        <div style={{ marginTop: 16 }}>
          {billing.tier === "foundation" && (
            <>
              <button
                onClick={() =>
                  startCheckout("managed")
                }
              >
                Upgrade to Managed
              </button>
            </>
          )}

          {billing.tier !== "foundation" && (
            <>
              <button onClick={openPortal}>
                Manage billing
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
