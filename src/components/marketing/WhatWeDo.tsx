export default function WhatWeDo() {
  const steps = [
    {
      number: "1",
      title: "Sign up",
      description: "Create your free account in seconds.",
    },
    {
      number: "2",
      title: "Verify email",
      description: "Quick verification to secure your account.",
    },
    {
      number: "3",
      title: "You're live",
      description: "Instant website and dashboard ready to use.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            How it works
          </h2>
          <p className="text-lg text-slate-600">
            Get your business online in three simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-xl mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}