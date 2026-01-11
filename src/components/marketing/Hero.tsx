import { ArrowRight, CheckCircle } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium text-indigo-600 bg-indigo-50 mb-8 border border-indigo-100">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
          Now available for small businesses
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 leading-tight">
          Turn website visitors into <br className="hidden md:block" />
          <span className="text-indigo-600">paying customers</span>
        </h1>

        <p className="mt-4 text-xl text-gray-500 max-w-3xl mx-auto mb-10 leading-relaxed">
          We provide the complete digital infrastructure for your service business. 
          Professional website, enquiry management, and booking automation — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Get started today
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>

          <button
            onClick={() =>
              document
                .getElementById("pricing")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 border border-gray-200 text-lg font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all"
          >
            View pricing
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-indigo-600" />
            <span>No technical skills required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-indigo-600" />
            <span>Set up in minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-indigo-600" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 pointer-events-none" />
    </section>
  );
}
