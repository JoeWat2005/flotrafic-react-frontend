import { X } from "lucide-react";
import { useEffect, useState } from "react";

type Mode = "login" | "signup";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [tier, setTier] = useState("foundation");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ESC key + scroll lock
  useEffect(() => {
    if (!open) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const submit = async () => {
    setError(null);
    setLoading(true);

    try {
      // ======================
      // LOGIN
      // ======================
      if (mode === "login") {
        const body = new URLSearchParams();
        body.append("username", email); // FastAPI expects `username`
        body.append("password", password);

        const res = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        });

        if (!res.ok) {
          throw new Error("Invalid login details");
        }

        const data = await res.json();
        localStorage.setItem("token", data.access_token);

        // reload app so auth state updates
        window.location.href = "/dashboard";
      }

      // ======================
      // SIGNUP (PRE-REGISTER)
      // ======================
      if (mode === "signup") {
        const res = await fetch("http://localhost:8000/auth/pre-register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            tier,
          }),
        });

        if (!res.ok) {
          throw new Error("Signup failed");
        }

        const data = await res.json();

        // Redirect to Stripe Checkout
        window.location.href = data.checkout_url;
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative z-10 flex min-h-full items-center justify-center px-4">
        <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          >
            <X size={22} />
          </button>

          <h2 className="text-2xl font-bold mb-6">
            {mode === "login" ? "Log in" : "Create your account"}
          </h2>

          <div className="space-y-4">
            {mode === "signup" && (
              <input
                placeholder="Business name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border px-4 py-3"
              />
            )}

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border px-4 py-3"
            />

            {mode === "signup" && (
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="foundation">Foundation</option>
                <option value="managed">Managed</option>
                <option value="autopilot">AI Autopilot</option>
              </select>
            )}
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading
              ? "Please wait…"
              : mode === "login"
              ? "Log in"
              : "Continue to payment"}
          </button>

          {error && (
            <p className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <p className="mt-6 text-sm text-center text-gray-600">
            {mode === "login" ? (
              <>
                Don’t have an account?{" "}
                <button
                  className="text-indigo-600"
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  className="text-indigo-600"
                  onClick={() => setMode("login")}
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
