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
  loading,
}: any) {
  const showMismatch = confirmResetPassword.length > 0 && !resetPasswordsMatch;

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-slate-600 mb-4">
        Enter the 6-digit code sent to <strong className="text-slate-900">{email}</strong>
      </p>

      {/* Code */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5 text-center">
          Reset code
        </label>
        <input
          value={resetCode}
          onChange={(e) =>
            setResetCode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="000000"
          maxLength={6}
          className="mx-auto block w-40 rounded-lg border border-slate-300 px-4 py-3 text-center text-lg font-mono tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* New password */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          New password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 transition-shadow ${
            showMismatch
              ? "border-red-400 focus:ring-red-400"
              : "border-slate-300 focus:ring-indigo-500 focus:border-transparent"
          }`}
        />
        {/* Strength indicator */}
        {newPassword && (
          <div className="mt-1.5 text-xs">
            <span className="text-slate-600">Strength: </span>
            <span
              className={
                resetPasswordStrength >= 3
                  ? "text-green-600 font-medium"
                  : resetPasswordStrength >= 2
                  ? "text-orange-500 font-medium"
                  : "text-red-600 font-medium"
              }
            >
              {["Weak", "Fair", "Good", "Strong"][resetPasswordStrength]}
            </span>
            {resetPasswordStrength < 2 && (
              <span className="block text-slate-500 mt-0.5">
                Use 8+ characters with numbers and symbols
              </span>
            )}
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Confirm new password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={confirmResetPassword}
          onChange={(e) => setConfirmResetPassword(e.target.value)}
          className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 transition-shadow ${
            showMismatch
              ? "border-red-400 focus:ring-red-400"
              : "border-slate-300 focus:ring-indigo-500 focus:border-transparent"
          }`}
        />
        {showMismatch && (
          <p className="text-xs text-red-600 mt-1">
            Passwords do not match
          </p>
        )}
      </div>

      {/* Turnstile */}
      <div className="flex justify-center pt-2">
        <Turnstile
          key={captchaKey}
          sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
          onVerify={(token) => setCaptchaToken(token)}
        />
      </div>

      <p className="text-xs text-slate-400 text-center">Protected by Cloudflare Turnstile</p>

      {/* Button */}
      <button
        disabled={!resetValid || loading}
        onClick={resetPassword}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Resetting..." : "Reset password"}
      </button>
    </div>
  );
}
