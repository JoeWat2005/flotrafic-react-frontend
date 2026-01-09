import Turnstile from "react-turnstile";

export function ResetPasswordForm({
  email,
  resetCode,
  setResetCode,

  newPassword,
  setNewPassword,
  confirmResetPassword,
  setConfirmResetPassword,

  resetPasswordStrength,
  resetPasswordsMatch,
  resetValid,

  resetPassword,
  captchaKey,
  setCaptchaToken,
}: any) {
  const showMismatch =
    confirmResetPassword.length > 0 && !resetPasswordsMatch;

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-gray-600">
        Enter the 6-digit code sent to <strong>{email}</strong>
      </p>

      {/* Code */}
      <input
        value={resetCode}
        onChange={(e) =>
          setResetCode(e.target.value.replace(/\D/g, "").slice(0, 6))
        }
        placeholder="- - - - - -"
        className="
          mx-auto block w-40 rounded-lg border px-4 py-3
          text-center text-lg tracking-widest
          focus:outline-none focus:ring-2 focus:ring-indigo-500
        "
      />

      {/* Strength */}
      <div className="text-sm text-gray-600">
        Password Strength:{" "}
        <span
          className={
            resetPasswordStrength >= 3
              ? "text-green-600"
              : resetPasswordStrength >= 2
              ? "text-orange-500"
              : "text-red-500"
          }
        >
          {["Weak", "Okay", "Good", "Strong"][resetPasswordStrength]}
        </span>
        {resetPasswordStrength < 2 && (
          <div className="text-xs text-gray-500">
            Use at least 8 characters, a number, and a symbol
          </div>
        )}
      </div>

      {/* New password */}
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
          showMismatch
            ? "border-red-400 focus:ring-red-400"
            : "focus:ring-indigo-500"
        }`}
      />

      {/* Confirm password */}
      <div>
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmResetPassword}
          onChange={(e) => setConfirmResetPassword(e.target.value)}
          className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
            showMismatch
              ? "border-red-400 focus:ring-red-400"
              : "focus:ring-indigo-500"
          }`}
        />
        <div className="min-h-[16px]">
          {showMismatch && (
            <p className="text-xs text-left text-red-500">
              Passwords do not match
            </p>
          )}
        </div>
      </div>

      {/* Turnstile */}
      <div className="flex justify-center pt-2">
        <Turnstile
          key={captchaKey}
          sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
          onVerify={(token) => setCaptchaToken(token)}
        />
      </div>

      {/* Button */}
      <div className="flex justify-center">
        <button
          disabled={!resetValid}
          onClick={resetPassword}
          className="
            mt-4 inline-flex items-center justify-center
            rounded-lg bg-indigo-600 px-6 py-3
            text-sm font-medium text-white
            transition-all duration-200
            hover:bg-indigo-700 hover:scale-[1.02]
            disabled:opacity-40 disabled:cursor-not-allowed
            disabled:hover:scale-100
          "
        >
          Reset password
        </button>
      </div>
    </div>
  );
}
