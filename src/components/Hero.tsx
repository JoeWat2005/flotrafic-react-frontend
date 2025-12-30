interface HeroProps {
  onContact: () => void;
}

export default function Hero({ onContact }: HeroProps) {
  return (
    <section className="min-h-[85vh] flex items-center bg-gradient-to-b from-gray-50 to-white animate-fade-in">
      <div className="max-w-6xl mx-auto text-center px-6 w-full">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Turn website visitors <br />

          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold">
            into paying{" "}
          </span>

          <span className="relative inline-block">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
              customers
            </span>
            <span
              className="absolute left-0 right-0 -bottom-2 h-2.5 rounded-full
                         bg-gradient-to-r from-indigo-600 to-purple-600
                         opacity-35 animate-underline"
            />
          </span>
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          We help small business owners set up their online infrastructure so customers
          can easily find you, get in touch, and do business with you online.
        </p>

        <div className="flex justify-center items-center gap-4">
          <button
            onClick={onContact}
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold
                       shadow-md shadow-indigo-600/25
                       hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30
                       hover:-translate-y-0.5 transition-all duration-200"
          >
            Contact us
          </button>

          <button
            onClick={() => {
              document
                .getElementById("pricing")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 rounded-xl text-lg font-medium text-gray-700
                       bg-gray-100 hover:bg-gray-200
                       transition-colors duration-200"
          >
            See pricing
          </button>
        </div>
      </div>
    </section>
  );
}

