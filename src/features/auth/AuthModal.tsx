import { X } from "lucide-react";
import { useEffect, useState } from "react";
import Turnstile from "react-turnstile";
import { getPasswordStrength } from "../../utils/passwordStrength";

type Mode = "login" | "signup";

export default function AuthModal({ open, onClose }: any) {
  const [mode, setMode] = useState<Mode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [tier, setTier] = useState("foundation");

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0); // 🔁 force Turnstile refresh

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = getPasswordStrength(password);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    // Reset state when switching modes
    setError(null);
    setCaptchaToken(null);
    setCaptchaKey((k) => k + 1);
  }, [mode]);

  if (!open) return null;

  /* ---------- validation helpers ---------- */

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordsMatch = password === confirmPassword;
  const passwordStrongEnough = strength >= 2;

  const signupValid =
    name.trim().length > 0 &&
    emailValid &&
    passwordStrongEnough &&
    passwordsMatch &&
    captchaToken;

  const loginValid = emailValid && password.length > 0;

  /* ---------- submit ---------- */

  const submit = async () => {
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        if (!loginValid) {
          throw new Error("Please enter a valid email and password");
        }

        const body = new URLSearchParams();
        body.append("username", email);
        body.append("password", password);

        const res = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Invalid login details");
        }

        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        window.location.href = "/dashboard";
      }

      if (mode === "signup") {
        if (!signupValid) {
          throw new Error("Please fix the errors above");
        }

        const res = await fetch("http://localhost:8000/auth/pre-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            confirm_password: confirmPassword,
            tier,
            captcha_token: captchaToken,
          }),
        });

        if (!res.ok) {
          const err = await res.json();

          if (Array.isArray(err.detail)) {
            throw new Error(err.detail.map((e: any) => e.msg).join(", "));
          }

          throw new Error(err.detail || "Signup failed");
        }

        const data = await res.json();
        window.location.href = data.checkout_url;
      }
    } catch (e: any) {
      // 🔁 AUTO-REFRESH CAPTCHA ON ANY ERROR
      setError(e.message);
      setCaptchaToken(null);
      setCaptchaKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 flex min-h-full items-center justify-center px-4">
        <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1 text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>

          <h2 className="mb-6 text-2xl font-bold">
            {mode === "login" ? "Log in" : "Create your account"}
          </h2>

          <div className="space-y-4">
            {mode === "signup" && (
              <input
                placeholder="Business name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}

            {/* Email */}
            <div>
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
                  email && !emailValid
                    ? "border-red-400 focus:ring-red-400"
                    : "focus:ring-indigo-500"
                }`}
              />
              <div className="min-h-[16px]">
                {email && !emailValid && (
                  <p className="text-xs text-red-500">
                    Please enter a valid email address
                  </p>
                )}
              </div>
            </div>

            {/* Password strength (signup) */}
            {mode === "signup" && (
              <div className="min-h-[20px] text-sm text-gray-600">
                Password Strength:{" "}
                <span
                  className={
                    strength >= 3
                      ? "text-green-600"
                      : strength >= 2
                      ? "text-orange-500"
                      : "text-red-500"
                  }
                >
                  {["Weak", "Okay", "Good", "Strong"][strength]}
                </span>
                {strength < 2 && (
                  <span className="block text-xs text-gray-500">
                    Use at least 8 characters, a number, and a symbol
                  </span>
                )}
              </div>
            )}

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
                mode === "signup" &&
                confirmPassword &&
                !passwordsMatch
                  ? "border-red-400 focus:ring-red-400"
                  : "focus:ring-indigo-500"
              }`}
            />

            {/* Confirm password */}
            {mode === "signup" && (
              <div>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
                    confirmPassword && !passwordsMatch
                      ? "border-red-400 focus:ring-red-400"
                      : "focus:ring-indigo-500"
                  }`}
                />
                <div className="min-h-[16px]">
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-xs text-red-500">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Tier */}
            {mode === "signup" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Select tier
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="foundation">Foundation</option>
                  <option value="managed">Managed</option>
                  <option value="autopilot">AI Autopilot</option>
                </select>
              </div>
            )}

            {/* Turnstile */}
            {mode === "signup" && (
              <div className="flex justify-center pt-2">
                <Turnstile
                  key={captchaKey}
                  sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                  onVerify={(token) => setCaptchaToken(token)}
                  onError={() => {
                    setCaptchaToken(null);
                    setCaptchaKey((k) => k + 1);
                  }}
                />
              </div>
            )}

            {mode === "signup" && (
              <p className="text-center text-xs text-gray-400">
                Protected by Cloudflare
              </p>
            )}
          </div>

          <button
            onClick={submit}
            disabled={
              loading ||
              (mode === "signup" && !signupValid) ||
              (mode === "login" && !loginValid)
            }
            className="
              mx-auto mt-6 block
              rounded-lg bg-indigo-600 px-6 py-3
              text-sm font-medium text-white
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            {loading
              ? "Please wait…"
              : mode === "login"
              ? "Login"
              : "Continue to payment"}
          </button>

          {error && (
            <p className="mt-4 text-center text-sm text-red-600">
              {error}
            </p>
          )}

          <p className="mt-6 text-center text-sm">
            {mode === "login" ? (
              <button
                onClick={() => setMode("signup")}
                className="font-medium text-indigo-600"
              >
                Create an account
              </button>
            ) : (
              <button
                onClick={() => setMode("login")}
                className="font-medium text-indigo-600"
              >
                Login instead
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}




