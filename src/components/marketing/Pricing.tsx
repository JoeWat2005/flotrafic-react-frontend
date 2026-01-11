import { Check, Shield, Zap, Layout } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Foundation",
      price: "£10",
      description: "Essential web presence.",
      icon: Layout,
      features: ["Custom Website", "Hosting & SSL", "Basic SEO", "Email Support"],
      cta: "Get Started",
      highlight: false,
    },
    {
      name: "Managed",
      price: "£29",
      description: "We handle the updates.",
      icon: Shield,
      features: ["Everything in Foundation", "Enquiry Management", "1hr/mo Updates", "Priority Support"],
      cta: "Start Free Trial",
      highlight: true,
    },
    {
      name: "Autopilot",
      price: "£49",
      description: "Complete automation.",
      icon: Zap,
      features: ["Everything in Managed", "Online Bookings", "Payments", "Account Manager"],
      cta: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-600">
            Choose the plan that fits your business stage. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative rounded-2xl p-8 transition-all ${
                plan.highlight 
                  ? "bg-white border-2 border-indigo-600 shadow-xl scale-105 z-10" 
                  : "bg-gray-50 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 -mt-3 mr-6 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-lg ${plan.highlight ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-600 border border-gray-200'}`}>
                  <plan.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm text-gray-500">{plan.description}</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 font-medium">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check className={`h-5 w-5 flex-shrink-0 ${plan.highlight ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.highlight 
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md" 
                    : "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
