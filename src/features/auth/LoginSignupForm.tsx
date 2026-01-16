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

      {/* Password strength (signup only) */}
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

      {/* Password (login & signup only) */}
      {mode !== "reset-request" && (
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 ${
            mode === "signup" && confirmPassword && !passwordsMatch
              ? "border-red-400 focus:ring-red-400"
              : "focus:ring-indigo-500"
          }`}
        />
      )}

      {/* Confirm password (signup only) */}
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
              <p className="text-xs text-red-500">Passwords do not match</p>
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
            className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="free">Free</option>
            <option value="pro">Pro</option>
          </select>
        </div>
      )}

      {/* Forgot password */}
      {mode === "login" && (
        <button
          type="button"
          onClick={() => setMode("reset-request")}
          className="block text-left text-sm font-medium text-indigo-600 hover:underline"
        >
          Forgot your password?
        </button>
      )}

      {/* Reset explanation */}
      {mode === "reset-request" && (
        <p className="text-sm text-gray-600">
          Enter your email address and we’ll send you a 6-digit code to reset
          your password.
        </p>
      )}
    </div>
  );
}
