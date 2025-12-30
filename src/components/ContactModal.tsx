import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // prevent background scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = () => {
    const subject = encodeURIComponent("Product enquiry – Flotrafic");
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:sales@flotrafic.co.uk?subject=${subject}&body=${body}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-2xl p-8 shadow-2xl animate-fade-in"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold mb-2">
          Contact us
        </h2>
        <p className="text-gray-600 mb-6">
          Tell us about your business and what you’re looking for.
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Your email"
            className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <textarea
            placeholder="How can we help?"
            rows={4}
            className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition"
        >
          Send message
        </button>
      </div>
    </div>
  );
}
