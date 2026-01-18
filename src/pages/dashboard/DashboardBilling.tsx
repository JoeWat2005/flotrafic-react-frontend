import { useEffect, useState } from "react";
import { Check, CreditCard, Shield, Layout } from "lucide-react";

interface BillingOverview {
  tier: "free" | "pro";
  subscription_status: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  is_active: boolean;
  email_verified: boolean;
}

const PLANS = [
  {
    id: "free",              // backend tier
    name: "Free",
    price: "£0",
    period: "/mo",
    description: "Essential web presence. Completely free.",
    features: [
      "Custom Business Website",
      "Custom Business Linktree",
      "Website Editor",
      "Email notifications",
      "Basic Analytics",
      "Hosting & SSL Certificate",
      "Basic SEO",
      "Standard Support",
    ],
    icon: Layout,
    color: "bg-gray-100 text-gray-600",
  },
  {
    id: "pro",               // backend tier
    name: "Pro",
    price: "£15",
    period: "/mo",
    description: "An essential web prescence, with limits removed and ai tools.",
    features: [
      "Everything in Free",
      "No limits",
      "AI tooling",
      "Priority Email Support",
      "Custom Domain",
      "SMS Notifications",
      "Priority Support",
      "Advanced SEO",
    ],
    icon: Shield,
    color: "bg-indigo-100 text-indigo-600",
    popular: true,
  },
];

export default function DashboardBilling() {
  const [billing, setBilling] = useState<BillingOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/billing/overview`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setBilling)
      .finally(() => setLoading(false));
  }, []);

  const handleCheckout = async (tierId: string) => {
    setProcessing(tierId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/billing/checkout?tier=${tierId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err) {
      console.error(err);
      setProcessing(null);
    }
  };

  const handlePortal = async () => {
    setProcessing("portal");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/billing/portal`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      setProcessing(null);
    }
  };

  const handleCancelAtPeriodEnd = async () => {
  setProcessing("cancel");
  try {
    const token = localStorage.getItem("token");
    await fetch(`${import.meta.env.VITE_API_URL}/billing/cancel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    window.location.reload();
  } catch (err) {
    console.error(err);
  } finally {
    setProcessing(null);
  }
};

const handlePlanAction = async (planId: string, isCurrent: boolean) => {
  if (isCurrent) return;

  // Pro -> Free = cancel
  if (planId === "free") {
    await handleCancelAtPeriodEnd();
    return;
  }

  // Free -> Pro = checkout
  await handleCheckout(planId);
};



  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!billing) return <div>Failed to load billing information.</div>;

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="text-gray-500">Manage your plan and payment methods.</p>
        </div>
        
        {billing.tier !== "free" && (
          <button
            onClick={handlePortal}
            disabled={!!processing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {processing === "portal" ? (
              <span className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            Manage Payment Method
          </button>
        )}
      </div>

      {/* Current Plan Status */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${
              billing.tier === "free" ? "bg-purple-100 text-purple-600" :
              "bg-gray-100 text-gray-600"
            }`}>
              <Layout className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 capitalize">{billing.tier} Plan</h2>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  billing.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {billing.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {billing.current_period_end 
                  ? `Renews on ${new Date(billing.current_period_end).toLocaleDateString()}` 
                  : "No active subscription period"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {PLANS.map((plan) => {
          const isCurrent = billing.tier === plan.id;
          const isUpgrade = PLANS.findIndex(p => p.id === plan.id) > PLANS.findIndex(p => p.id === billing.tier);
          
          return (
            <div 
              key={plan.id} 
              className={`relative bg-white rounded-2xl border transition-all duration-200 ${
                isCurrent ? "border-indigo-600 shadow-md ring-1 ring-indigo-600" : "border-gray-200 hover:border-indigo-200 hover:shadow-sm"
              }`}
            >
              {plan.popular && !isCurrent && (
                <div className="absolute top-0 right-0 -mt-3 mr-4 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-sm">
                  POPULAR
                </div>
              )}
              
              <div className="p-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.color}`}>
                  <plan.icon className="h-6 w-6" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1 h-10">{plan.description}</p>
                
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>

                <ul className="mt-6 space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-gray-600">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanAction(plan.id, isCurrent)}
                  disabled={
                    isCurrent ||
                    !!processing ||
                    (plan.id === "free" && billing.cancel_at_period_end)
                  }
                  className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                    isCurrent
                      ? "bg-gray-100 text-gray-400 cursor-default"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md"
                  }`}
                >
                  {isCurrent ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="h-4 w-4" /> Current Plan
                    </span>
                  ) : processing === plan.id ? (
                     <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Processing...
                    </span>
                  ) : plan.id === "free" ? (
                    billing.cancel_at_period_end
                      ? "Cancels at period end"
                      : "Switch Plan"
                  ) : isUpgrade ? (
                    "Upgrade"
                  ) : (
                    "Switch Plan"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
