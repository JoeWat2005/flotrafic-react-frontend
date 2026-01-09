import { X } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { VerifyForm } from "./VerifyForm";
import { LoginSignupForm } from "./LoginSignupForm";
import { ResetPasswordForm } from "./ResetPasswordForm";

export default function AuthModal({ open, onClose }: any) {
  const auth = useAuth(open, onClose);

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

          {/* Title */}
          <h2 className="mb-6 text-2xl font-bold">
            {auth.mode === "login"
              ? "Login"
              : auth.mode === "verify"
              ? "Verify your email"
              : auth.mode === "reset-request"
              ? "Reset your password"
              : auth.mode === "reset-confirm"
              ? "Change your password"
              : "Create your account"}
          </h2>

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
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={auth.requestPasswordReset}
                    disabled={auth.loading || !auth.emailValid}
                    className="
                      mt-6 inline-flex items-center justify-center
                      rounded-lg bg-indigo-600 px-6 py-3
                      text-sm font-medium text-white
                      transition-all duration-200
                      hover:bg-indigo-700 hover:scale-[1.02]
                      disabled:opacity-40 disabled:cursor-not-allowed
                      disabled:hover:scale-100
                    "
                  >
                    {auth.loading ? "Sending…" : "Send reset code"}
                  </button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <button
                    onClick={auth.submit}
                    disabled={
                      auth.loading ||
                      (auth.mode === "signup" && !auth.signupValid) ||
                      (auth.mode === "login" && !auth.loginValid)
                    }
                    className="
                      mt-6 inline-flex items-center justify-center
                      rounded-lg bg-indigo-600 px-6 py-3
                      text-sm font-medium text-white
                      transition-all duration-200
                      hover:bg-indigo-700 hover:scale-[1.02]
                      disabled:opacity-40 disabled:cursor-not-allowed
                      disabled:hover:scale-100
                    "
                  >
                    {auth.loading
                      ? "Please wait…"
                      : auth.mode === "login"
                      ? "Login"
                      : "Continue to email verification"}
                  </button>
                </div>
              )}

              {/* MESSAGE */}
              {auth.message && (
                <p className="mt-4 text-center text-sm text-gray-600">
                  {auth.message}
                </p>
              )}

              {/* FOOTER LINKS */}
              {auth.mode !== "reset-request" && (
                <p className="mt-6 text-center text-sm">
                  {auth.mode === "login" ? (
                    <button
                      onClick={() => auth.setMode("signup")}
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      Create an account
                    </button>
                  ) : (
                    <button
                      onClick={() => auth.setMode("login")}
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      Login instead
                    </button>
                  )}
                </p>
              )}

              {/* Back link for reset flow */}
              {auth.mode === "reset-request" && (
                <p className="mt-6 text-center text-sm">
                  <button
                    onClick={() => auth.setMode("login")}
                    className="font-medium text-indigo-600 hover:underline"
                  >
                    Back to login
                  </button>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

