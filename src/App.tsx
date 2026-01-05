import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./Dashboard";

import Hero from "./components/Hero";
import WhatWeDo from "./components/WhatWeDo";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

function Home({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <>
      <Hero onGetStarted={onGetStarted} />
      <WhatWeDo />
      <Features />
      <Pricing />
      <CTA onGetStarted={onGetStarted} />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Layout>
      {(openAuth) => (
        <Routes>
          <Route path="/" element={<Home onGetStarted={openAuth} />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      )}
    </Layout>
  );
}








