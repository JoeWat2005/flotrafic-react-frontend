interface CTAProps {
  onGetStarted: () => void;
}

export default function CTA({ onGetStarted }: CTAProps) {
  return (
    <section className="py-28 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="max-w-4xl mx-auto text-center px-6 text-white">
        <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
        <button
          onClick={onGetStarted}
          className="bg-white text-indigo-700 px-10 py-4 rounded-xl text-lg font-semibold"
        >
          Get started
        </button>
      </div>
    </section>
  );
}

