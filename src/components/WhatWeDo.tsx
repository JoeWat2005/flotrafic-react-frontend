import { useState } from "react";
import { Globe, Sparkles, Phone } from "lucide-react";

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
    footer:
      "You handle enquiries — this gives you a strong online foundation.",
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
    footer:
      "You still handle customers — just with better tools.",
  },
  {
    key: "calls",
    label: "Autopilot (AI)",
    icon: Phone,
    title: "AI Enquiries, Booking & Calls",
    description:
      "The full setup — AI handles enquiries, bookings, and phone calls automatically, even when you’re unavailable.",
    points: [
      "AI-managed customer enquiries",
      "AI booking and scheduling",
      "AI phone call handling",
      "Calendar and CRM integrations",
      "New features added automatically",
    ],
    footer:
      "AI handles customer contact so you can focus on your business.",
  },
];



export default function WhatWeDo() {
  const [index, setIndex] = useState(0);
  const current = OPTIONS[index];
  const Icon = current.icon;

  return (
    <section className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-center mb-4">
          What we offer
        </h2>

        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-14">
          Choose the level that best suits your business — from a simple online
          presence to a fully automated enquiry, booking, and calling system.
        </p>

        {/* Slider */}
        <div className="relative max-w-xl mx-auto mb-16">
          <div className="relative flex bg-gray-100 rounded-2xl p-1 overflow-hidden">
            <div
              className="absolute top-1 bottom-1 w-1/3 bg-white rounded-xl shadow-sm
                         transition-transform duration-500
                         ease-[cubic-bezier(0.34,1.56,0.64,1)]"
              style={{ transform: `translateX(${index * 100}%)` }}
            />

            {OPTIONS.map((opt, i) => (
              <button
                key={opt.key}
                onClick={() => setIndex(i)}
                className={`relative z-10 flex-1 py-3 text-sm font-medium transition-colors ${
                  index === i
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="max-w-3xl mx-auto">
          <div className="relative min-h-[470px]">
            <div
              key={current.key}
              className="absolute inset-0 border rounded-2xl p-8 shadow-lg bg-white animate-content-in"
            >
              {/* Centered icon */}
              <div className="flex justify-center mb-4">
                <Icon className="h-9 w-9 text-indigo-600" />
              </div>

              <h3 className="text-2xl font-semibold mb-3">
                {current.title}
              </h3>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {current.description}
              </p>

              <ul className="space-y-3 text-gray-700 mb-6">
                {current.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-indigo-600 mt-1">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t text-sm text-gray-500">
                {current.footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




