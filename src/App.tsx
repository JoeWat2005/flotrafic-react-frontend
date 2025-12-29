import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhatWeDo from "./components/WhatWeDo";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="bg-white text-gray-900">
      <Navbar />
      <Hero />
      <WhatWeDo />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

