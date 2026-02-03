import { Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Flotrafic</h3>
            <p className="text-sm text-slate-600">
              Your business online in seconds.
            </p>
          </div>

          <div className="flex gap-4">
            <a 
              href="#" 
              className="text-slate-400 hover:text-indigo-600 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-slate-400 hover:text-indigo-600 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-slate-400 hover:text-indigo-600 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="mailto:hello@flotrafic.co.uk" 
              className="text-slate-400 hover:text-indigo-600 transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-slate-500">
            © {new Date().getFullYear()} Flotrafic. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">
              Terms of Service
            </a>
            <a href="mailto:hello@flotrafic.co.uk" className="text-slate-600 hover:text-slate-900 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}