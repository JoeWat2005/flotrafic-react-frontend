import { ArrowRight } from "lucide-react";

interface HeroProps {
  onGetStarted: (mode?: "login" | "signup") => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="pt-32 pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
          Your business online
          <br />
          <span className="text-indigo-600">in seconds</span>
        </h1>

        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10">
          Sign up, verify your email, and get your website instantly. 
          No coding. No setup time.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <button
            onClick={() => onGetStarted("signup")}
            className="group inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Get started free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-lg text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            View pricing
          </button>
        </div>

        <p className="text-sm text-slate-500">
          Free forever plan • No credit card required
        </p>
      </div>
    </section>
  );
}
