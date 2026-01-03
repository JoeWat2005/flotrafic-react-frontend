import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

// Keep frontend rules aligned with backend schema
const RULES = {
  nameMin: 2,
  nameMax: 100,
  messageMin: 10,
  messageMax: 2000,
};

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    message: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // Close on ESC + lock scroll
  // -----------------------------
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // -----------------------------
  // Validation (mirrors FastAPI)
  // -----------------------------
  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};

    if (name.trim().length < RULES.nameMin) {
      errors.name = `Name must be at least ${RULES.nameMin} characters`;
    }

    if (!email.includes("@")) {
      errors.email = "Please enter a valid email address";
    }

    if (message.trim().length < RULES.messageMin) {
      errors.message = `Message must be at least ${RULES.messageMin} characters`;
    }

    if (message.length > RULES.messageMax) {
      errors.message = `Message must be under ${RULES.messageMax} characters`;
    }

    return errors;
  }, [name, email, message]);

  const isValid = Object.keys(validationErrors).length === 0;

  // -----------------------------
  // Submit
  // -----------------------------
  const handleSubmit = async () => {
    setError(null);

    // Mark everything as touched so errors appear gently
    setTouched({ name: true, email: true, message: true });

    if (!isValid) return;

    setLoading(true);

    try {
      const res = await fetch("https://api.flotrafic.co.uk/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        const msg =
          data?.detail?.map((e: any) => e.msg).join(", ") ||
          "Failed to send message";
        throw new Error(msg);
      }

      // Success = quietly close
      setTimeout(() => {
        setName("");
        setEmail("");
        setMessage("");
        setTouched({ name: false, email: false, message: false });
        onClose();
      }, 400);
    } catch (err: any) {
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex min-h-full items-center justify-center px-4">
        <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close contact form"
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X size={22} />
          </button>

          <h2 className="mb-6 text-2xl font-bold">Contact us</h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <input
                placeholder="Your name"
                value={name}
                onBlur={() => setTouched(t => ({ ...t, name: true }))}
                onChange={(e) => setName(e.target.value)}
                className={`w-full rounded-lg border px-4 py-3 transition
                  ${
                    touched.name && validationErrors.name
                      ? "border-red-500"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  }
                `}
              />
              {touched.name && validationErrors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                placeholder="Your email"
                value={email}
                onBlur={() => setTouched(t => ({ ...t, email: true }))}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-lg border px-4 py-3 transition
                  ${
                    touched.email && validationErrors.email
                      ? "border-red-500"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  }
                `}
              />
              {touched.email && validationErrors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <textarea
                rows={4}
                placeholder="How can we help?"
                value={message}
                onBlur={() => setTouched(t => ({ ...t, message: true }))}
                onChange={(e) => setMessage(e.target.value)}
                className={`w-full rounded-lg border px-4 py-3 transition
                  ${
                    touched.message && validationErrors.message
                      ? "border-red-500"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  }
                `}
              />
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-red-500">
                  {touched.message && validationErrors.message}
                </span>
                <span
                  className={
                    message.length > RULES.messageMax
                      ? "text-red-500"
                      : message.length > RULES.messageMax - 100
                      ? "text-orange-500"
                      : "text-gray-400"
                  }
                >
                  {message.length}/{RULES.messageMax}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-white font-medium
              hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Sending…" : "Send message"}
          </button>

          {error && (
            <p className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}






