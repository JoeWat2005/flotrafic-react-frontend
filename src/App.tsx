import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";

import Hero from "./components/marketing/Hero";
import Features from "./components/marketing/Features";
import Pricing from "./components/marketing/Pricing";
import WhatWeDo from "./components/marketing/WhatWeDo";
import CTA from "./components/marketing/CTA";
import Footer from "./components/layout/Footer";

import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import DashboardEnquiries from "./pages/dashboard/DashboardEnquiries";
import DashboardBookings from "./pages/dashboard/DashboardBookings";
import DashboardBilling from "./pages/dashboard/DashboardBilling";

import BusinessSite from "./pages/public/BusinessSite";

/* -----------------------------
   Marketing homepage component
------------------------------ */
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

/* -----------------------------
   App root
------------------------------ */
export default function App() {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");

  // e.g. bigmautos.flotrafic.local → ["bigmautos", "flotrafic", "local"]
  const subdomain = parts.length > 2 ? parts[0] : null;

  const RESERVED_SUBDOMAINS = ["flotrafic", "www", "api"];

  const isBusinessSite =
    subdomain !== null &&
    hostname.includes("flotrafic.") &&
    !RESERVED_SUBDOMAINS.includes(subdomain);

  /* -----------------------------
     BUSINESS WEBSITE MODE
     <business>.flotrafic.*
  ------------------------------ */
  // DEV: localhost/<slug>
  if (import.meta.env.DEV && hostname === "localhost" && window.location.pathname !== "/") {
    return <BusinessSite />;
  }

  // PROD: <slug>.flotrafic.*
  if (isBusinessSite) {
    return <BusinessSite />;
  }


  /* -----------------------------
     FLOTRAFIC MARKETING + DASHBOARD
  ------------------------------ */
  return (
    <Layout>
      {(openAuth) => (
        <Routes>
          <Route path="/" element={<Home onGetStarted={openAuth} />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="enquiries" element={<DashboardEnquiries />} />
            <Route path="bookings" element={<DashboardBookings />} />
            <Route path="billing" element={<DashboardBilling />} />
          </Route>
        </Routes>
      )}
    </Layout>
  );
}










