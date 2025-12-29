import { Twitter, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-14 border-t bg-white">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-6 text-center">
        
        {/* Brand line */}
        <p className="text-sm text-gray-500 max-w-md">
          Bringing businesses online — and helping them grow.
        </p>

        {/* Contact */}
        <a
          href="mailto:sales@flotrafic.co.uk"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition"
        >
          <Mail className="h-4 w-4" />
          sales@flotrafic.co.uk
        </a>

        {/* Socials */}
        <div className="flex gap-6 text-gray-500">
          <a href="#" aria-label="Twitter">
            <Twitter className="hover:text-indigo-600 transition" />
          </a>
          <a href="#" aria-label="Instagram">
            <Instagram className="hover:text-indigo-600 transition" />
          </a>
          <a href="#" aria-label="LinkedIn">
            <Linkedin className="hover:text-indigo-600 transition" />
          </a>
        </div>

        {/* Legal */}
        <p className="text-xs text-gray-400">
          © 2025 Flotrafic. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
