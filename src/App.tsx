import { Routes, Route, useOutletContext } from "react-router-dom";
import PublicLayout from "./components/layout/PublicLayout";

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
import DashboardWebsite from "./pages/dashboard/DashboardWebsite";

import BusinessSite from "./pages/public/BusinessSite";
import ErrorPage from "./pages/public/ErrorPage";

/* -----------------------------
   Marketing homepage
------------------------------ */
function Home() {
  const { openAuth } = useOutletContext<{ openAuth: () => void }>();
  
  return (
    <>
      <Hero onGetStarted={openAuth} />
      <WhatWeDo />
      <Features />
      <Pricing />
      <CTA onGetStarted={openAuth} />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Marketing Routes with Navbar */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* Dashboard Routes (Self-contained layout) */}
      <Route path="/:slug/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="website" element={<DashboardWebsite />} />
        <Route path="enquiries" element={<DashboardEnquiries />} />
        <Route path="bookings" element={<DashboardBookings />} />
        <Route path="billing" element={<DashboardBilling />} />
      </Route>

      {/* Public business site (No SaaS Navbar) */}
      <Route path="/:slug" element={<BusinessSite />} />

      {/* Fallback */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
