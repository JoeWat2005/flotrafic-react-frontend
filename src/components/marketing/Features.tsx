import { Users, PoundSterling, Rocket, Check, ArrowRight } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Professional Website",
      description: "Get a stunning, mobile-optimized website that builds trust and showcases your services effectively.",
      icon: Users,
    },
    {
      title: "Enquiry Management",
      description: "Centralize all your customer messages in one dashboard. Never miss a potential lead again.",
      icon: Check,
    },
    {
      title: "Automated Booking",
      description: "Allow customers to book your services 24/7 based on your availability. Syncs with your calendar.",
      icon: Rocket,
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to grow
          </h2>
          <p className="text-lg text-gray-600">
            We've combined the essential tools for service businesses into one simple platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-indigo-900 rounded-3xl p-8 md:p-12 text-center text-white overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to modernize your business?</h3>
            <p className="text-indigo-200 mb-8 max-w-2xl mx-auto">
              Join hundreds of other service providers who have switched to Flotrafic.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-white text-indigo-900 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-800 rounded-full blur-3xl opacity-50 pointer-events-none" />
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-50 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
