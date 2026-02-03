import Turnstile from "react-turnstile";

export function VerifyForm({
  email,
  verificationCode,
  setVerificationCode,
  captchaKey,
  setCaptchaToken,
  setCaptchaKey,
  resendCode,
  resendCooldown,
  loading,
  message,
  submit,
  verifyValid,
}: any) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1 mb-6">
        <p className="text-sm text-slate-600">
          We've sent a 6-digit verification code to
        </p>
        <p className="text-sm font-semibold text-slate-900">{email}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5 text-center">
          Verification code
        </label>
        <input
          value={verificationCode}
          onChange={(e) =>
            setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          placeholder="000000"
          maxLength={6}
          className="mx-auto block w-48 rounded-lg border border-slate-300 px-4 py-3 text-center text-lg font-mono tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div className="flex justify-center pt-2">
        <Turnstile
          key={captchaKey}
          sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
          onVerify={(t) => setCaptchaToken(t)}
          onError={() => {
            setCaptchaToken(null);
            setCaptchaKey((k: number) => k + 1);
          }}
        />
      </div>

      <p className="text-xs text-slate-400 text-center">Protected by Cloudflare Turnstile</p>

      <div className="text-center">
        <button
          type="button"
          onClick={resendCode}
          disabled={resendCooldown > 0}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {resendCooldown > 0
            ? `Resend code in ${resendCooldown}s`
            : "Didn't receive the code? Resend"}
        </button>
      </div>

      <button
        onClick={submit}
        disabled={!verifyValid || loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Verifying..." : "Verify and continue"}
      </button>

      {message && (
        <p className="text-sm text-slate-600 text-center">{message}</p>
      )}
    </div>
  );
}


