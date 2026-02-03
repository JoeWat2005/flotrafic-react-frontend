import { Globe, Link2, LayoutDashboard } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Professional Website",
      description: "A clean, mobile-optimized website for your business. Ready instantly.",
      icon: Globe,
    },
    {
      title: "Links Page",
      description: "Share all your important links in one place. Perfect for social media.",
      icon: Link2,
    },
    {
      title: "Business Dashboard",
      description: "Manage bookings, messages, and your business from one simple dashboard.",
      icon: LayoutDashboard,
    },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything you need to start
          </h2>
          <p className="text-lg text-slate-600">
            Get your complete online presence set up instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="bg-white rounded-lg p-8 border border-slate-200">
                <Icon className="h-8 w-8 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}