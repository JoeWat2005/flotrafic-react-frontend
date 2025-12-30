import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhatWeDo from "./components/WhatWeDo";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import ContactModal from "./components/ContactModal";

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="bg-white text-gray-900">
      <Navbar onContact={() => setContactOpen(true)} />
      <Hero onContact={() => setContactOpen(true)} />
      <WhatWeDo />
      <Features />
      <Pricing />
      <CTA onContact={() => setContactOpen(true)} />
      <Footer />

      {/* Contact modal (mounted once) */}
      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
}

