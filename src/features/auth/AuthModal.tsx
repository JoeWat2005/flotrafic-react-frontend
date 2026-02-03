import { X } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { VerifyForm } from "./VerifyForm";
import { LoginSignupForm } from "./LoginSignupForm";
import { ResetPasswordForm } from "./ResetPasswordForm";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthModal({ open, onClose, initialMode = "login" }: AuthModalProps) {
  const auth = useAuth(open, onClose, initialMode);

  // prevent background scroll when modal open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Blurred backdrop */}
        <div 
          className="fixed inset-0 bg-white/60 backdrop-blur-md transition-opacity" 
          onClick={onClose} 
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-md border border-slate-200">
          <div className="bg-white px-6 py-8">
            {/* Close button */}
            <div className="absolute right-4 top-4">
              <button
                type="button"
                className="rounded-lg bg-slate-100 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              {auth.mode === "login"
                ? "Welcome back"
                : auth.mode === "verify"
                ? "Verify email"
                : auth.mode === "reset-request"
                ? "Reset password"
                : auth.mode === "reset-confirm"
                ? "New password"
                : "Create account"}
            </h3>

            {/* Content */}
            <div className="w-full">
              {/* VERIFY */}
              {auth.mode === "verify" ? (
                <VerifyForm {...auth} />
              ) : auth.mode === "reset-confirm" ? (
                <ResetPasswordForm {...auth} />
              ) : (
                <>
                  {/* LOGIN / SIGNUP / RESET REQUEST FORM */}
                  <LoginSignupForm {...auth} />

                  {/* ACTION BUTTONS */}
                  {auth.mode === "reset-request" ? (
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={auth.requestPasswordReset}
                        disabled={auth.loading || !auth.emailValid}
                        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {auth.loading ? "Sending..." : "Send reset code"}
                      </button>
                    </div>
                  ) : (
                    <div className="mt-6">
                      <button
                        onClick={auth.submit}
                        disabled={
                          auth.loading ||
                          (auth.mode === "signup" && !auth.signupValid) ||
                          (auth.mode === "login" && !auth.loginValid)
                        }
                        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {auth.loading
                          ? "Processing..."
                          : auth.mode === "login"
                          ? "Sign in"
                          : "Create account"}
                      </button>
                    </div>
                  )}

                  {/* MESSAGE */}
                  {auth.message && (
                    <div className={`mt-4 rounded-lg p-3 text-sm ${auth.message.includes("sent") || auth.message.includes("Success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                      {auth.message}
                    </div>
                  )}

                  {/* FOOTER LINKS */}
                  <div className="mt-6 text-center text-sm text-slate-600">
                    {auth.mode !== "reset-request" && (
                      <p>
                        {auth.mode === "login" ? (
                          <>
                            Don't have an account?{" "}
                            <button
                              onClick={() => auth.setMode("signup")}
                              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                              Sign up
                            </button>
                          </>
                        ) : (
                          <>
                            Already have an account?{" "}
                            <button
                              onClick={() => auth.setMode("login")}
                              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                              Log in
                            </button>
                          </>
                        )}
                      </p>
                    )}

                    {auth.mode === "login" && (
                      <p className="mt-2">
                        <button
                          onClick={() => auth.setMode("reset-request")}
                          className="text-slate-500 hover:text-slate-700 transition-colors"
                        >
                          Forgot password?
                        </button>
                      </p>
                    )}

                    {auth.mode === "reset-request" && (
                      <button
                        onClick={() => auth.setMode("login")}
                        className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        Back to login
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
