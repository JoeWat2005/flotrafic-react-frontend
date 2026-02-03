import { useEffect, useState } from "react";
import { Check, Layout } from "lucide-react";

interface BillingOverview {
  tier: "free" | "pro";
  has_pro_access: boolean;
  access_expires_at: string | null;
  is_cancelled: boolean;
  email_verified: boolean;
}

const PLANS = [
  {
    id: "free",
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
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    id: "pro",
    name: "Pro",
    price: "£10",
    period: "/mo",
    description: "Advanced features with AI tools.",
    features: [
      "Everything in Free",
      "No usage limits",
      "AI management tools",
      "AI customization tools",
      "Priority Support",
      "Custom Domain",
      "SMS Notifications",
      "Advanced SEO",
    ],
    icon: Layout,
    color: "bg-gray-100 text-gray-400",
    comingSoon: true,
  },
];

const DashboardBilling = () => {
  const [billing, setBilling] = useState<BillingOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBilling = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/billing/overview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBilling(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchBilling().finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!billing) return <div>Failed to load billing information.</div>;

  const { tier } = billing;

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Billing & Subscription
        </h1>
        <p className="text-gray-500">
          Manage your plan and subscription.
        </p>
      </div>

      {/* Current Plan Status */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
            <Layout className="h-6 w-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 capitalize">
                {tier} Plan
              </h2>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">
                Active
              </span>
            </div>

            <p className="text-sm text-gray-500 mt-1">
              You're currently on the Free plan with full access to all features.
            </p>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === tier;
          const Icon = plan.icon;

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border transition-all ${
                isCurrent
                  ? "border-indigo-600 shadow-md ring-1 ring-indigo-600"
                  : "border-gray-200"
              } ${plan.comingSoon ? "opacity-75" : ""}`}
            >
              {plan.comingSoon && (
                <div className="absolute top-0 right-0 -mt-3 mr-4 px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded-full shadow-sm">
                  COMING SOON
                </div>
              )}

              <div className="p-6">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="text-xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 h-10">
                  {plan.description}
                </p>

                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>

                <ul className="mt-6 space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-gray-600"
                    >
                      <Check className={`h-5 w-5 flex-shrink-0 ${plan.comingSoon ? 'text-gray-400' : 'text-green-500'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  disabled={true}
                  className={`w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                    isCurrent
                      ? "bg-gray-100 text-gray-400 cursor-default"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isCurrent ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="h-4 w-4" /> Current Plan
                    </span>
                  ) : plan.comingSoon ? (
                    "Coming Soon"
                  ) : (
                    "Upgrade"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Banner */}
      <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-indigo-900 mb-2">
          Pro Plan Coming Soon
        </h3>
        <p className="text-sm text-indigo-700">
          We're working on bringing you advanced features including AI-powered tools, unlimited usage, and priority support. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
};

export default DashboardBilling;