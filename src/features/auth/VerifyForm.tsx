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
    <div className="space-y-4 text-center">
      <div className="space-y-1">
        <p className="text-sm text-gray-600">
          We’ve sent a 6-digit verification code to
        </p>
        <p className="text-sm font-medium text-gray-900">{email}</p>
      </div>

      <input
        value={verificationCode}
        onChange={(e) =>
          setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
        }
        placeholder="••••••"
        className="
          mx-auto w-[14rem] rounded-xl border px-4 py-3
          text-center text-lg font-mono tracking-[0.35em]
          focus:outline-none focus:ring-2 focus:ring-indigo-500
        "
      />

      <div className="flex justify-center pt-1">
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

      <p className="text-xs text-gray-400">Protected by Cloudflare</p>

      <button
        type="button"
        onClick={resendCode}
        disabled={resendCooldown > 0}
        className="
          mx-auto block text-sm font-medium text-indigo-600
          disabled:text-gray-400 disabled:cursor-not-allowed hover:underline
        "
      >
        {resendCooldown > 0
          ? `Resend available in ${resendCooldown}s`
          : "Didn’t get the email? Resend code"}
      </button>

      <div className="flex justify-center">
        <button
          onClick={submit}
          disabled={!verifyValid || loading}
          className="
            mt-2 inline-flex items-center justify-center
            rounded-lg bg-indigo-600 px-6 py-3
            text-sm font-medium text-white
            transition-all duration-200
            hover:bg-indigo-700 hover:scale-[1.02]
            disabled:opacity-40 disabled:cursor-not-allowed
            disabled:hover:scale-100
          "
        >
          {loading ? "Verifying…" : "Continue to payment"}
        </button>
      </div>

      {message && <p className="pt-2 text-sm text-gray-600">{message}</p>}
    </div>
  );
}


