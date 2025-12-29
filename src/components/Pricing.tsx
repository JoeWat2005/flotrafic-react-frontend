export default function Pricing() {
  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title */}
        <h2 className="text-4xl font-bold text-center mb-16">
          Pricing that scales with your business
        </h2>

        {/* Pricing rail */}
        <div className="rounded-3xl border bg-white overflow-hidden">
          {/* ===================== */}
          {/* Website & Social */}
          {/* ===================== */}
          <div className="group grid md:grid-cols-3 gap-8 px-8 py-10 items-center transition hover:bg-gray-50">
            <div>
              <h3 className="text-xl font-semibold">
                Website & Social
              </h3>
              <p className="text-gray-500 mt-1">
                Professional setup to get you online.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Matches the <strong>Foundation</strong> setup
              </p>
            </div>

            <div className="text-gray-700">
              <p className="text-2xl font-bold">£100</p>
              <p className="text-sm text-gray-500">one-time setup</p>

              <span className="inline-block mt-3 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                £10 / month hosting
              </span>
            </div>

            <ul className="text-gray-600 space-y-2">
              <li>✓ Business website</li>
              <li>✓ Social media linking</li>
              <li>✓ Contact & enquiry forms</li>
            </ul>
          </div>

          <div className="h-px bg-gray-200" />

          {/* ===================== */}
          {/* Enquiries & Booking */}
          {/* ===================== */}
          <div className="relative group grid md:grid-cols-3 gap-8 px-8 py-12 items-center bg-indigo-50/50 transition hover:bg-indigo-50">
            {/* Most popular badge */}
            <span className="absolute -top-3 left-8 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow">
              Most popular
            </span>

            <div>
              <h3 className="text-xl font-semibold text-indigo-700">
                Enquiries & Booking
              </h3>
              <p className="text-indigo-600 mt-1">
                Reduce admin and capture more leads.
              </p>
              <p className="text-sm text-indigo-500 mt-1">
                Matches the <strong>Managed</strong> setup
              </p>
            </div>

            <div>
              <p className="text-3xl font-bold text-indigo-700">
                £50 / month
              </p>
              <p className="text-sm text-indigo-600 mt-1">
                Includes Website & Social
              </p>
            </div>

            <ul className="text-indigo-700 space-y-2">
              <li>✓ Online enquiry forms</li>
              <li>✓ Online booking & scheduling</li>
              <li>✓ Email notifications</li>
              <li>✓ Organised customer messages</li>
            </ul>
          </div>

          <div className="h-px bg-gray-200" />

          {/* ===================== */}
          {/* Calls & Automation */}
          {/* ===================== */}
          <div className="relative group grid md:grid-cols-3 gap-8 px-8 py-10 items-center transition hover:bg-gray-50 opacity-90">
            {/* Demand badge */}
            <span className="absolute -top-3 left-8 rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white">
              High demand
            </span>

            <div>
              <h3 className="text-xl font-semibold">
                Calls & Automation
              </h3>
              <p className="text-gray-500 mt-1">
                Fully automated customer handling.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Full <strong>Autopilot (AI)</strong> setup
              </p>

              <span className="inline-block mt-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                Coming soon
              </span>
            </div>

            <div>
              <p className="text-2xl font-bold">
                £95 / month
              </p>
            </div>

            <ul className="text-gray-600 space-y-2">
              <li>✓ AI-managed customer enquiries</li>
              <li>✓ AI booking & scheduling</li>
              <li>✓ AI phone call handling</li>
              <li>✓ CRM & calendar integrations</li>
            </ul>
          </div>
        </div>

        {/* Clarifier */}
        <p className="mt-8 text-center text-sm text-gray-500">
          AI features are only included in the Autopilot (AI) plan.
        </p>
      </div>
    </section>
  );
}




