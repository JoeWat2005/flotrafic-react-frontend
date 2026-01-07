import { Users, PoundSterling, Rocket } from "lucide-react";

export default function Features() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-10">
          Built for small businesses
          <br />

          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold">
            that want to avoid{" "}
          </span>

          <span className="relative inline-block">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
              big overheads
            </span>
            <span
              className="absolute left-0 right-0 -bottom-2 h-2 rounded-full
                         bg-gradient-to-r from-indigo-600 to-purple-600
                         opacity-35 animate-underline"
            />
          </span>
        </h2>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-24 leading-relaxed">
          We help small businesses look professional, handle enquiries efficiently,
          and cut the time and cost of managing customers — without hiring extra staff.
        </p>

        {/* Highlights */}
        <div className="grid md:grid-cols-3 gap-16 text-left">
          {[
            {
              icon: Users,
              title: "Who it’s for",
              desc: "Trades, local services, and growing small businesses.",
            },
            {
              icon: PoundSterling,
              title: "Why we exist",
              desc: "To reduce management costs and admin through smarter systems.",
            },
            {
              icon: Rocket,
              title: "Our ambition",
              desc: "A simple all-in-one platform that grows with your business.",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="group flex gap-6 transition-all duration-300 hover:-translate-y-2"
              >
                {/* Icon halo */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 transition group-hover:bg-indigo-500/20">
                  <Icon className="h-6 w-6 text-indigo-600 transition-transform duration-300 group-hover:scale-110" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}





