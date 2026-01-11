import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import { isReservedSlug } from "./slug";

interface BusinessCustomisation {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url: string | null;
  font_family: string;
  hero_title: string;
  hero_subtitle: string;
  cta_text: string;
  show_enquiry_form: boolean;
  show_pricing: boolean;
  show_testimonials: boolean;
}

interface BusinessData {
  id: number;
  name: string;
  slug: string;
  customisation: BusinessCustomisation;
}

export default function BusinessSite() {
  const { slug } = useParams<{ slug: string }>();

  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  // Missing or reserved slug → hard fail
  if (!slug || isReservedSlug(slug)) {
    return <ErrorPage />;
  }

  useEffect(() => {
    setLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/public/business?slug=${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setBusiness(data);
      })
      .catch(() => {
        setBusiness(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setSubmitStatus("idle");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/public/enquiry?slug=${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to send enquiry");
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <ErrorPage
        title="Business not found"
        message="This Flotrafic site doesn’t exist yet."
      />
    );
  }

  const { customisation } = business;

  // Dynamic Styles
  const pageStyle = {
    fontFamily: customisation.font_family,
    backgroundColor: customisation.secondary_color, // Using secondary for bg
    color: customisation.primary_color,
  } as React.CSSProperties;

  const buttonStyle = {
    backgroundColor: customisation.accent_color,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen flex flex-col" style={pageStyle}>
      {/* Header / Hero */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm py-12 px-6 text-center">
        <div className="max-w-4xl mx-auto">
           {customisation.logo_url && (
            <img 
              src={customisation.logo_url} 
              alt={business.name} 
              className="h-16 mx-auto mb-6 object-contain"
            />
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: customisation.primary_color }}>
            {customisation.hero_title}
          </h1>
          <p className="text-xl opacity-80 max-w-2xl mx-auto">
            {customisation.hero_subtitle}
          </p>
        </div>
      </div>

      <div className="flex-grow py-16 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          
          {/* Enquiry Form */}
          {customisation.show_enquiry_form ? (
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl text-gray-900">
              <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>
              
              {submitStatus === "success" ? (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-gray-600">We'll get back to you as soon as possible.</p>
                  <button 
                    onClick={() => setSubmitStatus("idle")}
                    className="mt-6 text-sm font-medium hover:underline text-indigo-600"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your name"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-shadow"
                      style={{ focusRingColor: customisation.accent_color }}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Your email address"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-shadow"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="How can we help?"
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-shadow"
                    />
                  </div>
                  
                  {submitStatus === "error" && (
                    <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                      Something went wrong. Please try again.
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      style={buttonStyle}
                      className="
                        w-full flex items-center justify-center
                        rounded-lg px-6 py-4
                        text-white font-bold text-lg
                        transition-all duration-200
                        hover:brightness-110 active:scale-[0.98]
                        disabled:opacity-70 disabled:cursor-not-allowed
                        shadow-md
                      "
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Sending...
                        </span>
                      ) : (
                        customisation.cta_text || "Send Enquiry"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
             <div className="bg-white rounded-2xl p-10 shadow-xl text-center">
                <p className="text-gray-500">Enquiries are currently closed.</p>
             </div>
          )}

        </div>
      </div>
      
      <footer className="py-6 text-center text-sm opacity-60">
        &copy; {new Date().getFullYear()} {business.name}. Powered by Flotrafic.
      </footer>
    </div>
  );
}
