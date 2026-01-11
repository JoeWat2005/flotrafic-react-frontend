import { useState } from "react";
import { Globe, Sparkles, Phone, Check } from "lucide-react";

const OPTIONS = [
  {
    key: "website",
    label: "Foundation",
    icon: Globe,
    title: "Website & Online Presence",
    description:
      "A clean, professional website so customers can find you, trust your business, and contact you.",
    points: [
      "Modern, professional business website",
      "Social media links",
      "Mobile-friendly and fast-loading",
      "Simple contact forms",
    ],
    footer: "A professional website that gives your business a clear online presence."
  },
  {
    key: "enquiries",
    label: "Managed",
    icon: Sparkles,
    title: "Website with Enquiries & Booking",
    description:
      "Adds enquiry forms and online booking to keep customer messages organised and easy to manage.",
    points: [
      "Everything in Foundation",
      "Online enquiry forms",
      "Online booking and scheduling",
      "Email notifications",
      "Organised customer messages",
    ],
    footer: "A website with enquiry forms and online booking built in."

  },
  {
    key: "calls",
    label: "Autopilot (AI)",
    icon: Phone,
    title: "AI Enquiries, Booking & Calls",
    description:
      "The full setup: AI handles enquiries, bookings, and phone calls automatically, even when you’re unavailable.",
    points: [
      "AI-managed customer enquiries",
      "AI booking and scheduling",
      "AI phone call handling",
      "Calendar and CRM integrations",
      "New features added automatically",
    ],
    footer: "A fully automated system that handles enquiries, bookings, and calls for you."
  },
];

export default function WhatWeDo() {
  const [index, setIndex] = useState(0);
  const current = OPTIONS[index];
  const Icon = current.icon;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Choose your level of automation
          </h2>
          <p className="text-lg text-gray-600">
            Start with a simple website or go full autopilot. Upgrade anytime as you grow.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-100 p-1 rounded-xl">
            {OPTIONS.map((opt, i) => (
              <button
                key={opt.key}
                onClick={() => setIndex(i)}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  index === i
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden flex flex-col md:flex-row transition-all duration-300">
            {/* Left: Content */}
            <div className="p-8 md:p-12 flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{current.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                {current.description}
              </p>

              <div className="space-y-4">
                {current.points.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual/Footer (styled as a sidebar) */}
            <div className="bg-gray-50 p-8 md:w-80 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100">
              <p className="text-sm font-medium text-gray-900 mb-2">Key Benefit</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {current.footer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
