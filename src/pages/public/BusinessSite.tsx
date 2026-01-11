import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import { isReservedSlug } from "./slug";

interface Testimonial {
  name: string;
  role?: string;
  content: string;
  rating: number;
}

interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  is_popular: boolean;
}

interface BusinessCustomisation {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url: string | null;
  font_family: string;
  
  hero_title: string;
  hero_subtitle: string;
  cta_text: string;
  
  about_title?: string;
  about_content?: string;
  
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  
  social_facebook?: string;
  social_twitter?: string;
  social_instagram?: string;
  social_linkedin?: string;
  
  show_enquiry_form: boolean;
  show_pricing: boolean;
  show_testimonials: boolean;
  
  testimonials: Testimonial[];
  pricing_plans: PricingPlan[];
  
  border_radius: string;
  text_alignment: string;
  button_style: string;
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
        // Normalize data structures
        if (data.customisation) {
             data.customisation.testimonials = data.customisation.testimonials || [];
             data.customisation.pricing_plans = data.customisation.pricing_plans || [];
        }
        setBusiness(data);
        
        // Track Visit
        fetch(`${import.meta.env.VITE_API_URL}/public/visit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                slug: slug,
                path: window.location.pathname,
                user_agent: navigator.userAgent
            })
        }).catch(err => console.error("Failed to track visit", err));
        
        // Load Font
        if (data.customisation?.font_family) {
            const fontName = data.customisation.font_family;
            const link = document.createElement("link");
            link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@400;500;700&display=swap`;
            link.rel = "stylesheet";
            document.head.appendChild(link);
        }
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
  
  const scrollToContact = () => {
      const el = document.getElementById("contact-section");
      if (el) el.scrollIntoView({ behavior: 'smooth' });
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
    backgroundColor: customisation.button_style === 'outline' ? 'transparent' : customisation.accent_color,
    color: customisation.button_style === 'outline' ? customisation.accent_color : '#ffffff',
    border: customisation.button_style === 'outline' ? `2px solid ${customisation.accent_color}` : 'none'
  } as React.CSSProperties;

  const alignClass = customisation.text_alignment === 'left' ? 'text-left' : customisation.text_alignment === 'right' ? 'text-right' : 'text-center';
  const alignMargin = customisation.text_alignment === 'left' ? 'mr-auto' : customisation.text_alignment === 'right' ? 'ml-auto' : 'mx-auto';

  const radiusClass = 
    customisation.border_radius === 'small' ? 'rounded-sm' : 
    customisation.border_radius === 'large' ? 'rounded-2xl' : 
    customisation.border_radius === 'full' ? 'rounded-full' : 
    customisation.border_radius === 'none' ? 'rounded-none' : 'rounded-lg';

  const containerRadiusClass = 
    customisation.border_radius === 'none' ? 'rounded-none' : 
    customisation.border_radius === 'small' ? 'rounded-lg' : 'rounded-2xl';

  const sectionOrder = customisation.section_order || ["hero", "about", "services", "testimonials", "pricing", "contact"];

  const animateClass = (delay: string = "") => customisation.animation_enabled ? `animate-fade-in-up ${delay}` : "";

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden" style={pageStyle}>
      {sectionOrder.map((sectionId) => {
          if (sectionId === 'hero') {
              return (
                  <div key="hero" className={`min-h-screen flex items-center justify-center relative px-6 ${alignClass}`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                    
                    <div className="max-w-5xl mx-auto relative z-10 py-20">
                       {customisation.logo_url && (
                        <img 
                          src={customisation.logo_url} 
                          alt={business.name} 
                          className={`h-24 mb-10 object-contain ${animateClass()} ${alignMargin}`}
                        />
                      )}
                      
                      <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight leading-tight ${animateClass("animate-delay-100")}`} style={{ color: customisation.primary_color }}>
                        {customisation.hero_title}
                      </h1>
                      <p className={`text-xl md:text-2xl opacity-80 max-w-2xl mb-12 leading-relaxed ${animateClass("animate-delay-200")} ${alignMargin}`}>
                        {customisation.hero_subtitle}
                      </p>
                      <button
                         onClick={scrollToContact}
                         style={buttonStyle}
                         className={`px-10 py-5 font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 hover:brightness-110 active:scale-95 active:translate-y-0 transition-all ${animateClass("animate-delay-300")} ${radiusClass}`}
                      >
                          {customisation.cta_text}
                      </button>
                    </div>
                  </div>
              );
          }

          if (sectionId === 'about' && (customisation.about_title || customisation.about_content)) {
              return (
                  <div key="about" className="py-20 px-6 bg-black/5">
                       <div className="max-w-4xl mx-auto">
                           <div className={`${alignClass}`}>
                               {customisation.about_title && <h2 className="text-3xl font-bold mb-6">{customisation.about_title}</h2>}
                               {customisation.about_content && <p className="text-lg opacity-80 whitespace-pre-wrap leading-relaxed">{customisation.about_content}</p>}
                           </div>
                       </div>
                  </div>
              );
          }

          if (sectionId === 'pricing' && customisation.show_pricing && customisation.pricing_plans.length > 0) {
              return (
                  <div key="pricing" className="py-20 px-6">
                      <div className="max-w-6xl mx-auto">
                           <h2 className="text-3xl font-bold mb-12 text-center">Our Pricing</h2>
                           <div className="flex flex-wrap justify-center gap-8">
                               {customisation.pricing_plans.map((plan, i) => (
                                   <div 
                                        key={i} 
                                        className={`bg-white text-gray-900 p-8 w-full md:w-80 shadow-xl flex flex-col relative ${containerRadiusClass} ${plan.is_popular ? 'ring-4' : ''}`}
                                        style={{ ringColor: customisation.accent_color }}
                                   >
                                       {plan.is_popular && (
                                           <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white shadow-sm" style={{ backgroundColor: customisation.accent_color }}>
                                               Most Popular
                                           </div>
                                       )}
                                       <h3 className="text-xl font-bold mb-2 text-gray-500 uppercase tracking-wider">{plan.name}</h3>
                                       <div className="text-4xl font-extrabold mb-6 text-gray-900">{plan.price}</div>
                                       <ul className="space-y-4 mb-8 flex-1">
                                           {plan.features.map((f, fi) => (
                                               <li key={fi} className="flex items-start gap-3">
                                                   <div className="mt-1 w-5 h-5 rounded-full flex items-center justify-center bg-green-100 text-green-600 flex-shrink-0">
                                                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                   </div>
                                                   <span className="text-gray-700">{f}</span>
                                               </li>
                                           ))}
                                       </ul>
                                   </div>
                               ))}
                           </div>
                      </div>
                  </div>
              );
          }

          if (sectionId === 'testimonials' && customisation.show_testimonials && customisation.testimonials.length > 0) {
              return (
                  <div key="testimonials" className="py-20 px-6 bg-black/5">
                       <div className="max-w-6xl mx-auto">
                           <h2 className="text-3xl font-bold mb-12 text-center">Trusted by Clients</h2>
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                               {customisation.testimonials.map((t, i) => (
                                   <div key={i} className={`bg-white p-8 shadow-sm h-full flex flex-col ${containerRadiusClass}`}>
                                        <div className="flex gap-1 mb-4 text-yellow-400">
                                            {[...Array(5)].map((_, r) => (
                                                <svg key={r} className={`w-5 h-5 ${r < t.rating ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            ))}
                                        </div>
                                        <blockquote className="flex-1 text-gray-700 italic mb-6 text-lg">"{t.content}"</blockquote>
                                        <div className="border-t pt-4 border-gray-100">
                                            <div className="font-bold text-gray-900">{t.name}</div>
                                            <div className="text-sm text-gray-500">{t.role}</div>
                                        </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                  </div>
              );
          }

          if (sectionId === 'contact') {
              return (
                  <div key="contact" className="flex-grow py-20 px-6" id="contact-section">
                    <div className="max-w-3xl mx-auto space-y-12">
                      
                      {/* Enquiry Form */}
                      {customisation.show_enquiry_form ? (
                        <div className={`bg-white p-8 md:p-12 shadow-2xl text-gray-900 ${containerRadiusClass}`}>
                          <h2 className="text-3xl font-bold mb-8 text-center">Contact Us</h2>
                          
                          {submitStatus === "success" ? (
                            <div className="text-center py-10">
                              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              </div>
                              <h3 className="text-2xl font-semibold mb-3">Message Sent!</h3>
                              <p className="text-gray-600 text-lg">We'll get back to you as soon as possible.</p>
                              <button 
                                onClick={() => setSubmitStatus("idle")}
                                className="mt-8 text-indigo-600 font-medium hover:underline"
                              >
                                Send another message
                              </button>
                            </div>
                          ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                              <div className="grid md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Name</label>
                                    <input
                                      id="name"
                                      name="name"
                                      value={formData.name}
                                      onChange={handleInputChange}
                                      required
                                      placeholder="Your name"
                                      className={`w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${radiusClass}`}
                                      style={{ focusRingColor: customisation.accent_color }}
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Email</label>
                                    <input
                                      id="email"
                                      type="email"
                                      name="email"
                                      value={formData.email}
                                      onChange={handleInputChange}
                                      required
                                      placeholder="Your email address"
                                      className={`w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${radiusClass}`}
                                    />
                                  </div>
                              </div>

                              <div className="space-y-2">
                                <label htmlFor="message" className="block text-sm font-bold text-gray-700 uppercase tracking-wider">Message</label>
                                <textarea
                                  id="message"
                                  name="message"
                                  value={formData.message}
                                  onChange={handleInputChange}
                                  required
                                  placeholder="How can we help?"
                                  rows={5}
                                  className={`w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${radiusClass}`}
                                />
                              </div>
                              
                              {submitStatus === "error" && (
                                <div className={`text-red-600 text-sm text-center bg-red-50 p-4 ${radiusClass}`}>
                                  Something went wrong. Please try again.
                                </div>
                              )}

                                  <div className="pt-4">
                                    <button
                                      type="submit"
                                      disabled={submitting}
                                      className={`
                                        w-full flex items-center justify-center
                                        px-8 py-4
                                        font-bold text-lg
                                        transition-all duration-200
                                        hover:brightness-110 active:scale-[0.98]
                                        disabled:opacity-70 disabled:cursor-not-allowed
                                        shadow-md
                                        ${radiusClass}
                                      `}
                                      style={{ 
                                          backgroundColor: customisation.button_style === 'outline' ? 'transparent' : customisation.accent_color,
                                          color: customisation.button_style === 'outline' ? customisation.accent_color : '#ffffff',
                                          border: customisation.button_style === 'outline' ? `2px solid ${customisation.accent_color}` : 'none'
                                      }}
                                    >

                                  {submitting ? (
                                    <span className="flex items-center gap-2">
                                      <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
                         <div className={`bg-white p-12 shadow-xl text-center ${containerRadiusClass}`}>
                            <p className="text-gray-500 text-xl">Enquiries are currently closed.</p>
                         </div>
                      )}

                    </div>
                  </div>
              );
          }

          return null;
      })}
      
      {/* Footer */}
      <footer className="py-12 px-6 bg-black/10 text-center">
         <div className="max-w-4xl mx-auto space-y-8">
             <h2 className="text-2xl font-bold opacity-80">{business.name}</h2>
             
             {(customisation.contact_email || customisation.contact_phone || customisation.contact_address) && (
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-lg opacity-70">
                    {customisation.contact_email && (
                        <a href={`mailto:${customisation.contact_email}`} className="hover:opacity-100 transition-opacity">
                            {customisation.contact_email}
                        </a>
                    )}
                    {customisation.contact_phone && (
                        <a href={`tel:${customisation.contact_phone}`} className="hover:opacity-100 transition-opacity">
                            {customisation.contact_phone}
                        </a>
                    )}
                    {customisation.contact_address && (
                        <span>{customisation.contact_address}</span>
                    )}
                </div>
             )}
             
             {(customisation.social_facebook || customisation.social_twitter || customisation.social_instagram || customisation.social_linkedin) && (
                 <div className="flex justify-center gap-6">
                      {customisation.social_facebook && (
                          <a href={customisation.social_facebook} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:scale-110 transition-all">
                              <span className="sr-only">Facebook</span>
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                          </a>
                      )}
                      {customisation.social_instagram && (
                          <a href={customisation.social_instagram} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:scale-110 transition-all">
                               <span className="sr-only">Instagram</span>
                               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.416 2.53c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" /></svg>
                          </a>
                      )}
                      {customisation.social_twitter && (
                           <a href={customisation.social_twitter} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:scale-110 transition-all">
                              <span className="sr-only">Twitter</span>
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                           </a>
                      )}
                      {customisation.social_linkedin && (
                           <a href={customisation.social_linkedin} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 hover:scale-110 transition-all">
                              <span className="sr-only">LinkedIn</span>
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                           </a>
                      )}
                 </div>
             )}
             
             <div className="text-sm opacity-50">
                &copy; {new Date().getFullYear()} {business.name}. Powered by Flotrafic.
             </div>
         </div>
      </footer>
    </div>
  );
}
