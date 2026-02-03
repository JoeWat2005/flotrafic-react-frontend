import { Check } from "lucide-react";

interface PricingProps {
  onGetStarted?: () => void;
}

export default function Pricing({ onGetStarted }: PricingProps) {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Simple pricing
          </h2>
          <p className="text-lg text-slate-600">
            Start free, upgrade when you're ready.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Free Plan */}
          <div className="bg-white rounded-lg p-8 border-2 border-slate-200">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-slate-900">£0</span>
                <span className="text-slate-600">/month</span>
              </div>
              <p className="text-slate-600">Everything you need to get started</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Professional landing page</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Links page</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Business dashboard</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Email & SMS notifications</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">Page customization</span>
              </li>
            </ul>

            <button
              onClick={onGetStarted || (() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
              className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Get started
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-slate-900 rounded-lg p-8 border-2 border-slate-900">
            <div className="mb-6">
              <div className="inline-block px-3 py-1 bg-indigo-500 text-white text-xs font-bold rounded-full mb-4">
                COMING SOON
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-white">£10</span>
                <span className="text-slate-400">/month</span>
              </div>
              <p className="text-slate-400">Advanced features & AI automation</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">Everything in Free</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">No usage limits</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">AI management tools</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">AI customization</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">Priority support</span>
              </li>
            </ul>

            <button
              disabled
              className="w-full py-3 px-6 rounded-lg font-semibold text-slate-900 bg-white hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Coming soon
            </button>
          </div>
        </div>

        <p className="text-center text-slate-500 mt-8 text-sm">
          All plans include free hosting and SSL
        </p>
      </div>
    </section>
  );
}