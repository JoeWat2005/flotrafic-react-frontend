import { Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Flotrafic</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              The all-in-one platform for service businesses to grow online.
            </p>
          </div>

          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="mailto:hello@flotrafic.co.uk" className="text-gray-400 hover:text-indigo-600 transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Flotrafic. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
