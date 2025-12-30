interface CTAProps {
  onContact: () => void;
}

export default function CTA({ onContact }: CTAProps) {
  return (
    <section className="py-28 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="max-w-4xl mx-auto text-center px-6 text-white">
        <h2 className="text-4xl font-bold mb-6">
          Ready to get started?
        </h2>
        <p className="text-xl text-indigo-100 mb-10">
          Get set up with a professional online presence in days, not weeks.
        </p>
        <button
          onClick={onContact}
          className="bg-white text-indigo-700 px-10 py-4 rounded-xl text-lg font-semibold hover:scale-105 transition"
        >
          Contact us
        </button>
      </div>
    </section>
  );
}
