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
import ErrorPage from "./pages/public/ErrorPage";

/* -----------------------------
   Marketing homepage
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

export default function App() {
  return (
    <Layout>
      {(openAuth) => (
        <Routes>
          {/* Marketing */}
          <Route path="/" element={<Home onGetStarted={openAuth} />} />

          {/* Dashboard (AUTH REQUIRED) */}
          <Route path="/:slug/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="enquiries" element={<DashboardEnquiries />} />
            <Route path="bookings" element={<DashboardBookings />} />
            <Route path="billing" element={<DashboardBilling />} />
          </Route>

          {/* Public business site */}
          <Route path="/:slug" element={<BusinessSite />} />

          {/* Fallback */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      )}
    </Layout>
  );
}












