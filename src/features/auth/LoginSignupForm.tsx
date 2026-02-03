export function LoginSignupForm({
  mode,
  email,
  setEmail,
  emailValid,

  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,

  name,
  setName,
  tier,
  setTier,

  strength,
  passwordsMatch,

  setMode,
}: any) {
  return (
    <div className="space-y-4">
      {/* Business name */}
      {mode === "signup" && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Business name
          </label>
          <input
            placeholder="Enter your business name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
          />
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Email
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 transition-shadow ${
            email && !emailValid
              ? "border-red-400 focus:ring-red-400"
              : "border-slate-300 focus:ring-indigo-500 focus:border-transparent"
          }`}
        />
        {email && !emailValid && (
          <p className="text-xs text-red-600 mt-1">
            Please enter a valid email address
          </p>
        )}
      </div>

      {/* Password (login & signup) */}
      {mode !== "reset-request" && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 transition-shadow ${
              mode === "signup" && confirmPassword && !passwordsMatch
                ? "border-red-400 focus:ring-red-400"
                : "border-slate-300 focus:ring-indigo-500 focus:border-transparent"
            }`}
          />
          {/* Password strength (signup only) */}
          {mode === "signup" && password && (
            <div className="mt-1.5 text-xs">
              <span className="text-slate-600">Strength: </span>
              <span
                className={
                  strength >= 3
                    ? "text-green-600 font-medium"
                    : strength >= 2
                    ? "text-orange-500 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {["Weak", "Fair", "Good", "Strong"][strength]}
              </span>
              {strength < 2 && (
                <span className="block text-slate-500 mt-0.5">
                  Use 8+ characters with numbers and symbols
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Confirm password (signup only) */}
      {mode === "signup" && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Confirm password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 transition-shadow ${
              confirmPassword && !passwordsMatch
                ? "border-red-400 focus:ring-red-400"
                : "border-slate-300 focus:ring-indigo-500 focus:border-transparent"
            }`}
          />
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
          )}
        </div>
      )}

      {/* Tier - Hidden field set to free, Pro disabled */}
      {mode === "signup" && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Plan
          </label>
          <div className="relative">
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow appearance-none bg-white"
            >
              <option value="free">Free - £0/month</option>
              <option value="pro" disabled>Pro - £10/month (Coming soon)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Start with our free plan, upgrade anytime
          </p>
        </div>
      )}

      {/* Reset explanation */}
      {mode === "reset-request" && (
        <p className="text-sm text-slate-600">
          Enter your email address and we'll send you a 6-digit code to reset your password.
        </p>
      )}
    </div>
  );
}
