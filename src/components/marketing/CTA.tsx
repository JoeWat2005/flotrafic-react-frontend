import { ArrowRight } from "lucide-react";

interface CTAProps {
  onGetStarted: () => void;
}

export default function CTA({ onGetStarted }: CTAProps) {
  return (
    <section className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Start growing your business today
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Join the service businesses that are saving time and booking more jobs with Flotrafic.
        </p>
        
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 hover:-translate-y-1"
        >
          Get started for free
          <ArrowRight className="h-5 w-5" />
        </button>
        
        <p className="mt-6 text-sm text-gray-500">
          No credit card required for Foundation plan setup.
        </p>
      </div>
    </section>
  );
}
