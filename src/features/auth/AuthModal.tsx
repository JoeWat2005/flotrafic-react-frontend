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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose} 
        />

        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-gray-100">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="absolute right-4 top-4">
              <button
                type="button"
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="sm:flex sm:items-start w-full">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 className="text-2xl font-bold leading-6 text-gray-900 mb-8 text-center">
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

                <div className="mt-2 w-full">
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
                            className="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {auth.loading ? "Sending..." : "Send Reset Link"}
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
                            className="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <div className={`mt-4 rounded-md p-3 text-sm ${auth.message.includes("sent") || auth.message.includes("Success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                          {auth.message}
                        </div>
                      )}

                      {/* FOOTER LINKS */}
                      <div className="mt-6 text-center text-sm text-gray-500">
                        {auth.mode !== "reset-request" && (
                          <p>
                            {auth.mode === "login" ? (
                              <>
                                Don't have an account?{" "}
                                <button
                                  onClick={() => auth.setMode("signup")}
                                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                                >
                                  Sign up
                                </button>
                              </>
                            ) : (
                              <>
                                Already have an account?{" "}
                                <button
                                  onClick={() => auth.setMode("login")}
                                  className="font-semibold text-indigo-600 hover:text-indigo-500"
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
                              className="text-gray-400 hover:text-gray-600"
                            >
                              Forgot password?
                            </button>
                          </p>
                        )}

                        {auth.mode === "reset-request" && (
                          <button
                            onClick={() => auth.setMode("login")}
                            className="font-semibold text-indigo-600 hover:text-indigo-500"
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
      </div>
    </div>
  );
}
