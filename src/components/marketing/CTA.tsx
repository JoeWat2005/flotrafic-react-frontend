import { ArrowRight } from "lucide-react";

interface CTAProps {
  onGetStarted: (mode?: "login" | "signup") => void;
}

export default function CTA({ onGetStarted }: CTAProps) {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 text-center">
        
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
          Ready to get started?
        </h2>
        
        <p className="text-xl text-slate-600 mb-8">
          Join businesses launching online with Flotrafic.
        </p>
        
        <button
          onClick={() => onGetStarted("signup")}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-lg text-base font-semibold hover:bg-indigo-700 transition-colors"
        >
          Get started free
          <ArrowRight className="h-5 w-5" />
        </button>
        
        <p className="mt-4 text-sm text-slate-500">
          No credit card required
        </p>
      </div>
    </section>
  );
}