import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Save, Monitor, Smartphone, Plus, Trash, GripVertical, ChevronDown, ChevronUp, Menu, X, ArrowUp, ArrowDown, Layout, Type, Palette, Zap, Settings, Globe } from "lucide-react";

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

interface Customisation {
  // Brand
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  logo_url: string;
  
  // Content
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
  
  // Features
  show_enquiry_form: boolean;
  show_pricing: boolean;
  show_testimonials: boolean;
  
  testimonials: Testimonial[];
  pricing_plans: PricingPlan[];
  
  // Style
  border_radius: string;
  text_alignment: string;
  button_style: string;
  
  section_order: string[];
  animation_enabled: boolean;
}

const FONTS = [
  "Inter", 
  "Roboto", 
  "Open Sans", 
  "Lato", 
  "Montserrat", 
  "Playfair Display", 
  "Merriweather",
  "Nunito"
];

export default function DashboardWebsite() {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Customisation | null>(null);
  
  // Tabs
  const [activeTab, setActiveTab] = useState<"content" | "design" | "features" | "settings">("content");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [showPreviewOnMobile, setShowPreviewOnMobile] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${import.meta.env.VITE_API_URL}/customisation/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
          // Ensure arrays exist
          setSettings({
              ...data,
              testimonials: data.testimonials || [],
              pricing_plans: data.pricing_plans || [],
              section_order: data.section_order || ["hero", "about", "testimonials", "pricing", "contact"],
              animation_enabled: data.animation_enabled ?? true
          });
      })
      .catch((err) => {
        console.error(err);
        setMessage({ type: "error", text: "Could not load settings. Please try refreshing." });
      })
      .finally(() => setLoading(false));
  }, []);

  // Load fonts in editor for accurate preview
  useEffect(() => {
      if (settings?.font_family) {
          const fontName = settings.font_family;
          const link = document.createElement("link");
          link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@400;500;700&display=swap`;
          link.rel = "stylesheet";
          document.head.appendChild(link);
          return () => {
              document.head.removeChild(link);
          }
      }
  }, [settings?.font_family]);

  const validate = () => {
      if (!settings) return false;
      const newErrors: Record<string, string> = {};
      
      if (!settings.hero_title.trim()) newErrors.hero_title = "Headline is required";
      if (!settings.hero_subtitle.trim()) newErrors.hero_subtitle = "Subtitle is required";
      if (!settings.cta_text.trim()) newErrors.cta_text = "Button text is required";
      
      if (settings.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contact_email)) {
          newErrors.contact_email = "Invalid email address";
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!settings) return;
    
    if (!validate()) {
        setMessage({ type: "error", text: "Please fix the errors before saving." });
        return;
    }
    
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/customisation/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage({ type: "success", text: "Changes saved successfully" });
      setTimeout(() => setMessage(null), 3000);
      
    } catch {
      setMessage({ type: "error", text: "Failed to save changes" });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof Customisation, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
    if (errors[field]) {
        setErrors(prev => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }
  };
  
  // --- Testimonial Helpers ---
  const addTestimonial = () => {
      if (!settings) return;
      const newT: Testimonial = { name: "New Client", content: "Great service!", rating: 5, role: "" };
      updateField("testimonials", [...settings.testimonials, newT]);
  };
  
  const updateTestimonial = (index: number, field: keyof Testimonial, value: any) => {
      if (!settings) return;
      const newT = [...settings.testimonials];
      newT[index] = { ...newT[index], [field]: value };
      updateField("testimonials", newT);
  };
  
  const removeTestimonial = (index: number) => {
      if (!settings) return;
      updateField("testimonials", settings.testimonials.filter((_, i) => i !== index));
  };
  
  // --- Pricing Helpers ---
  const addPricingPlan = () => {
      if (!settings) return;
      const newP: PricingPlan = { name: "Basic", price: "£99", features: ["Feature 1", "Feature 2"], is_popular: false };
      updateField("pricing_plans", [...settings.pricing_plans, newP]);
  };
  
  const updatePricingPlan = (index: number, field: keyof PricingPlan, value: any) => {
      if (!settings) return;
      const newP = [...settings.pricing_plans];
      newP[index] = { ...newP[index], [field]: value };
      updateField("pricing_plans", newP);
  };
  
  const updatePricingFeature = (planIndex: number, featureIndex: number, value: string) => {
      if (!settings) return;
      const newP = [...settings.pricing_plans];
      newP[planIndex].features[featureIndex] = value;
      updateField("pricing_plans", newP);
  };
  
  const addPricingFeature = (planIndex: number) => {
      if (!settings) return;
      const newP = [...settings.pricing_plans];
      newP[planIndex].features.push("New Feature");
      updateField("pricing_plans", newP);
  };
  
  const removePricingFeature = (planIndex: number, featureIndex: number) => {
       if (!settings) return;
      const newP = [...settings.pricing_plans];
      newP[planIndex].features = newP[planIndex].features.filter((_, i) => i !== featureIndex);
      updateField("pricing_plans", newP);
  };

  const removePricingPlan = (index: number) => {
      if (!settings) return;
      updateField("pricing_plans", settings.pricing_plans.filter((_, i) => i !== index));
  };
  
  const moveSection = (index: number, direction: 'up' | 'down') => {
      if (!settings) return;
      const newOrder = [...settings.section_order];
      if (direction === 'up') {
          if (index === 0) return;
          [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      } else {
          if (index === newOrder.length - 1) return;
          [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      }
      updateField("section_order", newOrder);
  };
  
  const getSectionLabel = (id: string) => {
      switch(id) {
          case 'hero': return 'Hero Section';
          case 'about': return 'About Us';
          case 'services': return 'Services';
          case 'testimonials': return 'Testimonials';
          case 'pricing': return 'Pricing';
          case 'contact': return 'Contact Form';
          default: return id;
      }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!settings) return (
    <div className="p-8 text-center bg-red-50 rounded-lg border border-red-200 text-red-700">
      <p>Failed to load editor configuration.</p>
      <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-white border border-red-300 rounded-md hover:bg-red-50">Retry</button>
    </div>
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-gray-50 -m-8 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
             {/* Removed redundant hamburger since layout provides one */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Website Editor</h1>
              <p className="hidden md:block text-gray-500 text-sm">Design your perfect landing page</p>
            </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreviewOnMobile(!showPreviewOnMobile)}
            className="md:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg"
          >
            {showPreviewOnMobile ? <Monitor size={16} /> : <Monitor size={16} />}
            {showPreviewOnMobile ? "Edit" : "Preview"}
          </button>
        
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm"
          >
            {saving ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span className="hidden md:inline">{saving ? "Saving..." : "Save Changes"}</span>
            <span className="md:hidden">{saving ? "..." : "Save"}</span>
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium flex-shrink-0 flex items-center justify-between ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
          <button onClick={() => setMessage(null)}><X size={16} /></button>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Editor Layout */}
      <div className="flex flex-1 gap-6 overflow-hidden relative">
        {/* Left Sidebar - Controls */}
        <div className={`
            flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-shrink-0 transition-all duration-300
            ${showPreviewOnMobile ? 'hidden md:flex' : 'flex'}
            w-full md:w-[450px] lg:w-[500px]
            md:relative z-10 h-full
        `}>
          <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar bg-gray-50/50">
            <button onClick={() => setActiveTab("content")} className={`flex-1 py-4 px-4 text-sm font-medium whitespace-nowrap border-b-2 flex items-center justify-center gap-2 transition-colors ${activeTab === "content" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                <Layout size={16} /> Content
            </button>
            <button onClick={() => setActiveTab("design")} className={`flex-1 py-4 px-4 text-sm font-medium whitespace-nowrap border-b-2 flex items-center justify-center gap-2 transition-colors ${activeTab === "design" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                <Palette size={16} /> Design
            </button>
            <button onClick={() => setActiveTab("features")} className={`flex-1 py-4 px-4 text-sm font-medium whitespace-nowrap border-b-2 flex items-center justify-center gap-2 transition-colors ${activeTab === "features" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                <Zap size={16} /> Features
            </button>
             <button onClick={() => setActiveTab("settings")} className={`flex-1 py-4 px-4 text-sm font-medium whitespace-nowrap border-b-2 flex items-center justify-center gap-2 transition-colors ${activeTab === "settings" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                <Settings size={16} /> Settings
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-white">
            {activeTab === "content" && (
              <div className="space-y-8 animate-fade-in-up">
                {/* Hero */}
                <section>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Layout size={12} /> Hero Section
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Headline <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={settings.hero_title || ""} 
                        onChange={(e) => updateField("hero_title", e.target.value)} 
                        className={`w-full rounded-md border shadow-sm focus:ring-indigo-500 text-sm py-2 px-3 ${errors.hero_title ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-indigo-500"}`} 
                      />
                      {errors.hero_title && <p className="mt-1 text-xs text-red-500">{errors.hero_title}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle <span className="text-red-500">*</span></label>
                      <textarea 
                        rows={3} 
                        value={settings.hero_subtitle || ""} 
                        onChange={(e) => updateField("hero_subtitle", e.target.value)} 
                        className={`w-full rounded-md border shadow-sm focus:ring-indigo-500 text-sm py-2 px-3 ${errors.hero_subtitle ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-indigo-500"}`}
                      />
                      {errors.hero_subtitle && <p className="mt-1 text-xs text-red-500">{errors.hero_subtitle}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Button Text <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={settings.cta_text || ""} 
                        onChange={(e) => updateField("cta_text", e.target.value)} 
                        className={`w-full rounded-md border shadow-sm focus:ring-indigo-500 text-sm py-2 px-3 ${errors.cta_text ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-indigo-500"}`}
                      />
                      {errors.cta_text && <p className="mt-1 text-xs text-red-500">{errors.cta_text}</p>}
                    </div>
                  </div>
                </section>
                
                {/* About */}
                <section className="pt-6 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Type size={12} /> About Section
                    </h3>
                    <div className="space-y-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                           <input type="text" value={settings.about_title || ""} onChange={(e) => updateField("about_title", e.target.value)} placeholder="About Us" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3" />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                           <textarea rows={4} value={settings.about_content || ""} onChange={(e) => updateField("about_content", e.target.value)} placeholder="Tell your story..." className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3" />
                        </div>
                    </div>
                </section>
                
                {/* Contact Info */}
                <section className="pt-6 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Globe size={12} /> Contact Details
                    </h3>
                    <div className="space-y-4">
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Email Display</label>
                           <input 
                                type="email" 
                                value={settings.contact_email || ""} 
                                onChange={(e) => updateField("contact_email", e.target.value)} 
                                className={`w-full rounded-md border shadow-sm focus:ring-indigo-500 text-sm py-2 px-3 ${errors.contact_email ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-indigo-500"}`}
                           />
                           {errors.contact_email && <p className="mt-1 text-xs text-red-500">{errors.contact_email}</p>}
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                           <input type="tel" value={settings.contact_phone || ""} onChange={(e) => updateField("contact_phone", e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3" />
                        </div>
                         <div>
                           <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                           <input type="text" value={settings.contact_address || ""} onChange={(e) => updateField("contact_address", e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3" />
                        </div>
                    </div>
                </section>
              </div>
            )}

            {activeTab === "design" && (
              <div className="space-y-8 animate-fade-in-up">
                <section>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Brand Colors</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-900">Primary Color</label>
                          <span className="text-xs text-gray-500">Headings & Text</span>
                      </div>
                      <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">{settings.primary_color}</span>
                          <div className="relative">
                              <input type="color" value={settings.primary_color} onChange={(e) => updateField("primary_color", e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                              <div className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: settings.primary_color }}></div>
                          </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-900">Background Color</label>
                          <span className="text-xs text-gray-500">Page background</span>
                      </div>
                      <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">{settings.secondary_color}</span>
                          <div className="relative">
                              <input type="color" value={settings.secondary_color} onChange={(e) => updateField("secondary_color", e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                              <div className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: settings.secondary_color }}></div>
                          </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                      <div className="flex flex-col">
                          <label className="text-sm font-medium text-gray-900">Accent Color</label>
                          <span className="text-xs text-gray-500">Buttons & Highlights</span>
                      </div>
                      <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">{settings.accent_color}</span>
                          <div className="relative">
                              <input type="color" value={settings.accent_color} onChange={(e) => updateField("accent_color", e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                              <div className="w-8 h-8 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: settings.accent_color }}></div>
                          </div>
                      </div>
                    </div>
                  </div>
                </section>
                
                <section className="pt-6 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Typography</h3>
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                      <select value={settings.font_family} onChange={(e) => updateField("font_family", e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2.5">
                          {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                </section>

                <section className="pt-6 border-t border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Component Style</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Text Alignment</label>
                      <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['left', 'center', 'right'].map((align) => (
                           <button key={align} onClick={() => updateField("text_alignment", align)} className={`flex-1 py-2 text-xs font-medium rounded-md capitalize transition-all ${settings.text_alignment === align ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{align}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Corner Rounding</label>
                      <select value={settings.border_radius || "medium"} onChange={(e) => updateField("border_radius", e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2.5">
                        <option value="none">Square</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="full">Full</option>
                      </select>
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Button Style</label>
                      <div className="flex bg-gray-100 p-1 rounded-lg">
                        {['solid', 'outline'].map((style) => (
                           <button key={style} onClick={() => updateField("button_style", style)} className={`flex-1 py-2 text-xs font-medium rounded-md capitalize transition-all ${settings.button_style === style ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>{style}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
                
                 <section className="pt-6 border-t border-gray-100">
                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Assets</h3>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                    <div className="flex gap-2">
                        <input type="url" value={settings.logo_url || ""} onChange={(e) => updateField("logo_url", e.target.value)} className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3" placeholder="https://..." />
                        {settings.logo_url && <img src={settings.logo_url} className="h-9 w-9 object-contain rounded border border-gray-200 bg-gray-50" alt="Preview" />}
                    </div>
                  </div>
                </section>
                
                <section className="pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-gray-900">Animations</h3>
                            <p className="text-xs text-gray-500">Enable entrance animations</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.animation_enabled !== false} onChange={(e) => updateField("animation_enabled", e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </section>
              </div>
            )}

            {activeTab === "features" && (
              <div className="space-y-8 animate-fade-in-up">
                 {/* Reordering */}
                 <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">Section Order</h3>
                    <div className="space-y-2">
                        {settings.section_order.map((sectionId, idx) => (
                            <div key={sectionId} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm hover:border-gray-300 transition-colors">
                                <span className="font-medium text-gray-700 flex items-center gap-2">
                                    <span className="text-gray-400 text-xs">#{idx + 1}</span>
                                    {getSectionLabel(sectionId)}
                                </span>
                                <div className="flex gap-1">
                                    <button onClick={() => moveSection(idx, 'up')} disabled={idx === 0} className="p-1.5 hover:bg-white hover:shadow-sm rounded disabled:opacity-30 text-gray-600"><ArrowUp size={14} /></button>
                                    <button onClick={() => moveSection(idx, 'down')} disabled={idx === settings.section_order.length - 1} className="p-1.5 hover:bg-white hover:shadow-sm rounded disabled:opacity-30 text-gray-600"><ArrowDown size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>

                {/* Enquiries */}
                 <div className="flex items-center justify-between p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Enquiry Form</h3>
                    <p className="text-xs text-gray-500 mt-1">Allow visitors to send you messages</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={settings.show_enquiry_form} onChange={(e) => updateField("show_enquiry_form", e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                
                {/* Testimonials */}
                 <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                         <div>
                            <h3 className="text-sm font-bold text-gray-900">Testimonials</h3>
                            <p className="text-xs text-gray-500 mt-1">Showcase client reviews</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.show_testimonials} onChange={(e) => updateField("show_testimonials", e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                    
                    {settings.show_testimonials && (
                        <div className="space-y-4">
                            {settings.testimonials.map((t, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1 space-y-2">
                                            <input type="text" value={t.name} onChange={(e) => updateTestimonial(idx, "name", e.target.value)} className="w-full text-sm font-bold border-none bg-transparent p-0 focus:ring-0 placeholder-gray-400" placeholder="Client Name" />
                                            <input type="text" value={t.role || ""} onChange={(e) => updateTestimonial(idx, "role", e.target.value)} className="w-full text-xs text-gray-500 border-none bg-transparent p-0 focus:ring-0 placeholder-gray-400" placeholder="Role (optional)" />
                                        </div>
                                        <button onClick={() => removeTestimonial(idx)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash size={14} /></button>
                                    </div>
                                    <textarea value={t.content} onChange={(e) => updateTestimonial(idx, "content", e.target.value)} className="w-full text-sm border border-gray-200 rounded p-2 mb-3 focus:border-indigo-500 focus:ring-indigo-500 bg-white" rows={2} placeholder="Testimonial content..." />
                                    <div className="flex gap-1">
                                         {[1, 2, 3, 4, 5].map(star => (
                                             <button key={star} onClick={() => updateTestimonial(idx, "rating", star)} className={`text-sm focus:outline-none transition-transform hover:scale-110 ${star <= t.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                                         ))}
                                    </div>
                                </div>
                            ))}
                            <button onClick={addTestimonial} className="w-full py-3 flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-all"><Plus size={14} /> Add Testimonial</button>
                        </div>
                    )}
                 </div>
                 
                 {/* Pricing */}
                  <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                         <div>
                            <h3 className="text-sm font-bold text-gray-900">Pricing</h3>
                            <p className="text-xs text-gray-500 mt-1">Display your service packages</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.show_pricing} onChange={(e) => updateField("show_pricing", e.target.checked)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                    
                    {settings.show_pricing && (
                         <div className="space-y-4">
                            {settings.pricing_plans.map((p, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm group">
                                    <div className="flex justify-between items-center mb-3">
                                         <input type="text" value={p.name} onChange={(e) => updatePricingPlan(idx, "name", e.target.value)} className="font-bold bg-transparent border-none p-0 text-sm w-1/2 focus:ring-0 placeholder-gray-400" placeholder="Plan Name" />
                                         <div className="flex items-center gap-2">
                                            <input type="text" value={p.price} onChange={(e) => updatePricingPlan(idx, "price", e.target.value)} className="text-right font-bold bg-transparent border-none p-0 text-sm w-20 focus:ring-0 placeholder-gray-400" placeholder="Price" />
                                            <button onClick={() => removePricingPlan(idx)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash size={14} /></button>
                                         </div>
                                    </div>
                                    <div className="space-y-2 mb-3 bg-white p-3 rounded border border-gray-100">
                                        {p.features.map((f, fIdx) => (
                                            <div key={fIdx} className="flex gap-2 items-center group/feature">
                                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                                                <input value={f} onChange={(e) => updatePricingFeature(idx, fIdx, e.target.value)} className="flex-1 bg-transparent border-none text-xs p-0 focus:ring-0 text-gray-600" />
                                                <button onClick={() => removePricingFeature(idx, fIdx)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover/feature:opacity-100"><X size={12} /></button>
                                            </div>
                                        ))}
                                        <button onClick={() => addPricingFeature(idx)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium mt-1">+ Add Feature</button>
                                    </div>
                                     <div className="flex justify-between items-center pt-2">
                                        <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                                            <input type="checkbox" checked={p.is_popular} onChange={(e) => updatePricingPlan(idx, "is_popular", e.target.checked)} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                                            Highlight as Popular
                                        </label>
                                    </div>
                                </div>
                            ))}
                            <button onClick={addPricingPlan} className="w-full py-3 flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-all"><Plus size={14} /> Add Pricing Plan</button>
                        </div>
                    )}
                  </div>
              </div>
            )}
            
            {activeTab === "settings" && (
                <div className="space-y-8 animate-fade-in-up">
                    <section>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Globe size={12} /> Social Media Links
                        </h3>
                        <div className="space-y-4">
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                               <input type="text" value={settings.social_facebook || ""} onChange={(e) => updateField("social_facebook", e.target.value)} placeholder="Facebook URL" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3" />
                           </div>
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">Twitter / X</label>
                               <input type="text" value={settings.social_twitter || ""} onChange={(e) => updateField("social_twitter", e.target.value)} placeholder="Twitter/X URL" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3" />
                           </div>
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                               <input type="text" value={settings.social_instagram || ""} onChange={(e) => updateField("social_instagram", e.target.value)} placeholder="Instagram URL" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3" />
                           </div>
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                               <input type="text" value={settings.social_linkedin || ""} onChange={(e) => updateField("social_linkedin", e.target.value)} placeholder="LinkedIn URL" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 px-3" />
                           </div>
                        </div>
                    </section>
                </div>
            )}
          </div>
        </div>

        {/* Right Side - Preview */}
        <div className={`
             flex-1 flex flex-col min-w-0 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden relative transition-all
             ${showPreviewOnMobile ? 'fixed inset-0 z-20 m-0 rounded-none' : 'hidden md:flex'}
        `}>
          {showPreviewOnMobile && (
              <div className="absolute top-4 left-4 z-30">
                  <button onClick={() => setShowPreviewOnMobile(false)} className="p-2 bg-white rounded-full shadow-lg border border-gray-200 text-gray-700">
                      <X size={20} />
                  </button>
              </div>
          )}
        
          <div className="absolute top-4 right-4 z-10 flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <button 
              onClick={() => setPreviewMode("desktop")}
              className={`p-1.5 rounded ${previewMode === "desktop" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
              title="Desktop View"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setPreviewMode("mobile")}
              className={`p-1.5 rounded ${previewMode === "mobile" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
              title="Mobile View"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-y-auto bg-gray-200/50">
            {/* 
              Simulated Live Preview
            */}
            <div 
              className={`
                bg-white shadow-2xl transition-all duration-300 flex flex-col overflow-hidden relative
                ${previewMode === "mobile" ? "w-[375px] h-[667px] rounded-3xl border-8 border-gray-900" : "w-full h-full max-w-6xl rounded-lg border border-gray-200"}
              `}
              style={{
                fontFamily: settings.font_family,
                backgroundColor: settings.secondary_color,
                color: settings.primary_color
              }}
            >
              {/* Fake Browser Header (Desktop only) */}
              {previewMode === "desktop" && (
                <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-shrink-0">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 bg-white mx-4 rounded-md h-6 text-xs flex items-center px-3 text-gray-400">
                    flotrafic.co.uk/{slug}
                  </div>
                </div>
              )}

              {/* Preview Content */}
              <div className="flex-1 overflow-y-auto relative flex flex-col">
                 {settings.section_order.map((sectionId) => {
                     if (sectionId === 'hero') {
                         return (
                            <div key="hero" className={`min-h-[500px] flex items-center justify-center relative px-6 py-12`} style={{ textAlign: settings.text_alignment as any || 'center' }}>
                              {/* Background Pattern Preview */}
                              <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                              
                              <div className="relative z-10 w-full max-w-4xl">
                                  {settings.logo_url && (
                                    <img 
                                      src={settings.logo_url} 
                                      className={`h-16 mb-6 object-contain ${settings.animation_enabled ? 'animate-fade-in-up' : ''} ${settings.text_alignment === 'center' || !settings.text_alignment ? 'mx-auto' : ''} ${settings.text_alignment === 'right' ? 'ml-auto' : ''}`} 
                                      alt="Logo" 
                                    />
                                  )}
                                  <h1 className={`text-4xl font-bold mb-4 ${settings.animation_enabled ? 'animate-fade-in-up animate-delay-100' : ''}`} style={{ color: settings.primary_color }}>
                                    {settings.hero_title}
                                  </h1>
                                  <p className={`opacity-80 max-w-lg mb-8 ${settings.animation_enabled ? 'animate-fade-in-up animate-delay-200' : ''} ${settings.text_alignment === 'center' || !settings.text_alignment ? 'mx-auto' : ''} ${settings.text_alignment === 'right' ? 'ml-auto' : ''}`}>
                                    {settings.hero_subtitle}
                                  </p>
                                  <button
                                    className={`px-6 py-3 font-medium shadow-lg transition-transform active:scale-95 ${settings.animation_enabled ? 'animate-fade-in-up animate-delay-300' : ''} ${
                                      settings.border_radius === 'small' ? 'rounded-sm' : 
                                      settings.border_radius === 'large' ? 'rounded-2xl' : 
                                      settings.border_radius === 'full' ? 'rounded-full' : 
                                      settings.border_radius === 'none' ? 'rounded-none' : 'rounded-lg'
                                    }`}
                                    style={{ 
                                      backgroundColor: settings.button_style === 'outline' ? 'transparent' : settings.accent_color,
                                      color: settings.button_style === 'outline' ? settings.accent_color : '#ffffff',
                                      border: settings.button_style === 'outline' ? `2px solid ${settings.accent_color}` : 'none'
                                    }}
                                  >
                                    {settings.cta_text}
                                  </button>
                              </div>
                            </div>
                         );
                     }
                     
                     if (sectionId === 'about' && (settings.about_title || settings.about_content)) {
                         return (
                            <div key="about" className="py-12 px-6 bg-black/5" style={{ textAlign: settings.text_alignment as any || 'center' }}>
                                <div className="max-w-3xl mx-auto">
                                     {settings.about_title && <h2 className="text-2xl font-bold mb-4">{settings.about_title}</h2>}
                                     {settings.about_content && <p className="opacity-80 whitespace-pre-wrap">{settings.about_content}</p>}
                                </div>
                            </div>
                         );
                     }
                     
                     if (sectionId === 'pricing' && settings.show_pricing && settings.pricing_plans.length > 0) {
                         return (
                             <div key="pricing" className="py-12 px-6">
                                 <h2 className="text-2xl font-bold mb-8 text-center">Our Pricing</h2>
                                 <div className="flex flex-wrap gap-4 justify-center">
                                     {settings.pricing_plans.map((p, i) => (
                                         <div 
                                            key={i} 
                                            className={`
                                                p-6 shadow-sm border flex flex-col w-64 bg-white text-gray-900 relative
                                                ${settings.border_radius === 'small' ? 'rounded-sm' : settings.border_radius === 'large' ? 'rounded-2xl' : settings.border_radius === 'none' ? 'rounded-none' : 'rounded-lg'}
                                                ${p.is_popular ? 'ring-2' : ''}
                                            `} 
                                            style={{ ringColor: settings.accent_color, borderColor: '#e5e7eb' }}
                                         >
                                             {p.is_popular && (
                                               <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide text-white shadow-sm" style={{ backgroundColor: settings.accent_color }}>
                                                   Popular
                                               </div>
                                             )}
                                             <h3 className="text-sm font-bold mb-2 text-gray-500 uppercase tracking-wider">{p.name}</h3>
                                             <div className="text-2xl font-bold mb-4">{p.price}</div>
                                             <ul className="space-y-2 mb-6 text-xs flex-1">
                                                 {p.features.map((f, fi) => (
                                                    <li key={fi} className="flex gap-2 items-start">
                                                        <div className="mt-0.5 w-3 h-3 rounded-full flex items-center justify-center bg-green-100 text-green-600 flex-shrink-0">
                                                            <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                        </div>
                                                        <span className="opacity-80">{f}</span>
                                                    </li>
                                                 ))}
                                             </ul>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         );
                     }
                     
                     if (sectionId === 'testimonials' && settings.show_testimonials && settings.testimonials.length > 0) {
                         return (
                             <div key="testimonials" className="py-12 px-6 bg-black/5">
                                <h2 className="text-2xl font-bold mb-8 text-center">Trusted by Clients</h2>
                                <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
                                    {settings.testimonials.map((t, i) => (
                                        <div 
                                            key={i} 
                                            className={`
                                                bg-white p-6 shadow-sm border border-gray-100
                                                ${settings.border_radius === 'small' ? 'rounded-sm' : settings.border_radius === 'large' ? 'rounded-2xl' : settings.border_radius === 'none' ? 'rounded-none' : 'rounded-lg'}
                                            `}
                                        >
                                            <div className="flex gap-1 text-yellow-400 mb-2">
                                                {[...Array(5)].map((_, r) => (
                                                    <svg key={r} className={`w-4 h-4 ${r < t.rating ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                ))}
                                            </div>
                                            <p className="mb-4 italic text-gray-700">"{t.content}"</p>
                                            <div className="border-t pt-3 border-gray-100">
                                                <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                                                <div className="text-xs text-gray-500">{t.role}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                         );
                     }
                     
                     if (sectionId === 'contact') {
                        return (
                            <div key="contact" className="py-12 px-6">
                                <div className="max-w-md mx-auto">
                                    {settings.show_enquiry_form ? (
                                        <div 
                                            className={`
                                                bg-white p-6 shadow-xl border border-gray-100
                                                ${settings.border_radius === 'small' ? 'rounded-sm' : settings.border_radius === 'large' ? 'rounded-2xl' : settings.border_radius === 'none' ? 'rounded-none' : 'rounded-xl'}
                                            `}
                                        >
                                            <h2 className="text-xl font-bold mb-4 text-center text-gray-900">Contact Us</h2>
                                            <div className="space-y-3">
                                                <div className="h-10 bg-gray-50 border border-gray-200 rounded"></div>
                                                <div className="h-10 bg-gray-50 border border-gray-200 rounded"></div>
                                                <div className="h-20 bg-gray-50 border border-gray-200 rounded"></div>
                                                <div 
                                                    className={`h-10 opacity-50 ${settings.border_radius === 'small' ? 'rounded-sm' : settings.border_radius === 'large' ? 'rounded-xl' : settings.border_radius === 'none' ? 'rounded-none' : 'rounded-lg'}`} 
                                                    style={{ 
                                                      backgroundColor: settings.button_style === 'outline' ? 'transparent' : settings.accent_color,
                                                      border: settings.button_style === 'outline' ? `2px solid ${settings.accent_color}` : 'none'
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-white p-8 shadow-lg rounded-xl text-center">
                                            <p className="text-gray-500">Enquiries are closed.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                     }
                     
                     return null;
                 })}

                {/* Footer Preview */}

                {/* Footer Preview */}
                <div className="py-8 px-6 bg-black/10 text-center mt-auto">
                     <h2 className="text-lg font-bold opacity-80 mb-4">
                        {/* We don't have the business name in 'settings', so we'll grab it from the URL slug or generic */}
                        {slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ') : "Business Name"}
                     </h2>
                     
                    {(settings.contact_email || settings.contact_phone || settings.contact_address) && (
                        <div className="flex flex-col gap-2 justify-center mb-4 text-xs opacity-70">
                            {settings.contact_email && <div>{settings.contact_email}</div>}
                            {settings.contact_phone && <div>{settings.contact_phone}</div>}
                            {settings.contact_address && <div>{settings.contact_address}</div>}
                        </div>
                    )}
                    {(settings.social_facebook || settings.social_twitter || settings.social_instagram || settings.social_linkedin) && (
                        <div className="flex justify-center gap-4 opacity-60">
                             <div className="flex gap-3">
                                 {settings.social_facebook && <div className="w-5 h-5 bg-current rounded-full opacity-50"></div>}
                                 {settings.social_twitter && <div className="w-5 h-5 bg-current rounded-full opacity-50"></div>}
                                 {settings.social_instagram && <div className="w-5 h-5 bg-current rounded-full opacity-50"></div>}
                             </div>
                        </div>
                    )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
