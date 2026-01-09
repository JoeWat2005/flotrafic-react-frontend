import { useEffect, useMemo, useState } from "react";
import type { AuthMode } from "./constants";
import { RESEND_COOLDOWN } from "./constants";
import { isEmailValid } from "./validation";
import { getPasswordStrength } from "../../utils/passwordStrength";

export function useAuth(open: boolean, onClose?: () => void) {
  const [mode, setMode] = useState<AuthMode>("login");

  // shared
  const [email, setEmail] = useState("");

  // login/signup
  const [name, setName] = useState("");
  const [tier, setTier] = useState("foundation");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // verify
  const [verificationCode, setVerificationCode] = useState("");

  // captcha (used by verify + reset-confirm)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);

  // resend cooldown
  const [resendCooldown, setResendCooldown] = useState(0);

  // password reset
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  // -------------------------
  // Derived validation flags
  // -------------------------
  const emailValid = useMemo(() => isEmailValid(email), [email]);

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordsMatch = useMemo(
    () => password === confirmPassword,
    [password, confirmPassword]
  );

  const loginValid = useMemo(
    () => emailValid && password.length > 0,
    [emailValid, password]
  );

  const signupValid = useMemo(
    () =>
      name.trim().length >= 3 &&
      emailValid &&
      strength >= 2 &&
      passwordsMatch,
    [name, emailValid, strength, passwordsMatch]
  );

  const verifyValid = useMemo(
    () => verificationCode.length === 6 && captchaToken !== null,
    [verificationCode, captchaToken]
  );

  const resetPasswordStrength = useMemo(
    () => getPasswordStrength(newPassword),
    [newPassword]
  );

  const resetPasswordsMatch = useMemo(
    () => newPassword === confirmResetPassword,
    [newPassword, confirmResetPassword]
  );

  const resetValid = useMemo(
    () =>
      resetCode.length === 6 &&
      resetPasswordStrength >= 2 &&
      resetPasswordsMatch &&
      captchaToken !== null,
    [resetCode, resetPasswordStrength, resetPasswordsMatch, captchaToken]
  );

  // -------------------------
  // Lifecycle / resets
  // -------------------------
  useEffect(() => {
    if (!open) return;

    // Reset modal state on open (preserves your old behaviour)
    setMode("login");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setTier("foundation");

    setVerificationCode("");
    setCaptchaToken(null);
    setCaptchaKey((k) => k + 1);

    setResendCooldown(0);

    setResetCode("");
    setNewPassword("");
    setConfirmResetPassword("");

    setLoading(false);
    setMessage("");
  }, [open]);

  // Countdown tick
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const i = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(i);
  }, [resendCooldown]);

  // When entering verify or reset-confirm, refresh captcha + clear message
  useEffect(() => {
    setMessage("");
    if (mode === "verify" || mode === "reset-confirm") {
      setCaptchaToken(null);
      setCaptchaKey((k) => k + 1);
    }
  }, [mode]);

  // -------------------------
  // Existing actions (signup/login/verify)
  // -------------------------
  const resendCode = async () => {
    if (resendCooldown > 0) return;

    setMessage("");
    setResendCooldown(RESEND_COOLDOWN);

    try {
      await fetch("http://localhost:8000/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // enumeration-safe UX message
      setMessage("If the account exists, a new code has been sent.");
    } catch {
      setMessage("Could not resend code. Please try again.");
      setResendCooldown(0);
    }
  };

  const submit = async () => {
    setMessage("");
    setLoading(true);

    try {
      // ---------- LOGIN ----------
      if (mode === "login") {
        if (!loginValid) return;

        const res = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || "Invalid email or password");
        }

        const data = await res.json();
        localStorage.setItem("token", data.access_token);
        window.location.href = "/dashboard";
        return;
      }

      // ---------- SIGNUP ----------
      if (mode === "signup") {
        if (!signupValid) return;

        const res = await fetch("http://localhost:8000/auth/pre-register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
            confirm_password: confirmPassword,
            tier,
            // if your backend expects captcha_token during signup, add it here later
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || "Signup failed");
        }

        setMode("verify");
        setResendCooldown(RESEND_COOLDOWN);
        return;
      }

      // ---------- VERIFY (existing flow preserved) ----------
      if (mode === "verify") {
        if (!verifyValid) return;

        const verifyRes = await fetch(
          "http://localhost:8000/auth/verify-email-code",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              code: verificationCode,
              captcha_token: captchaToken,
            }),
          }
        );

        if (!verifyRes.ok) {
          const err = await verifyRes.json().catch(() => ({}));
          throw new Error(err.detail || "Invalid verification code");
        }

        // Login to get token
        const loginRes = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password }),
        });

        if (!loginRes.ok) {
          const err = await loginRes.json().catch(() => ({}));
          throw new Error(err.detail || "Login failed after verification");
        }

        const loginData = await loginRes.json();
        localStorage.setItem("token", loginData.access_token);

        // Start Stripe checkout
        const stripeRes = await fetch("http://localhost:8000/auth/start-checkout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${loginData.access_token}`,
          },
        });

        if (!stripeRes.ok) {
          const err = await stripeRes.json().catch(() => ({}));
          throw new Error(err.detail || "Failed to start checkout");
        }

        const stripeData = await stripeRes.json();
        window.location.href = stripeData.checkout_url;
        return;
      }
    } catch (e: any) {
      setMessage(e.message || "Something went wrong");

      // refresh captcha on verify errors
      if (mode === "verify") {
        setCaptchaToken(null);
        setCaptchaKey((k) => k + 1);
      }
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Password reset (NEW)
  // -------------------------
  const requestPasswordReset = async () => {
    if (!emailValid) return;

    setLoading(true);
    setMessage("");

    try {
      await fetch("http://localhost:8000/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // enum-safe: always proceed
      setMessage("If the account exists, a reset code has been sent.");
      setMode("reset-confirm");
      setResetCode("");
      setNewPassword("");
      setConfirmResetPassword("");
      setCaptchaToken(null);
      setCaptchaKey((k) => k + 1);
    } catch {
      setMessage("Could not send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!resetValid) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: resetCode,
          new_password: newPassword,
          captcha_token: captchaToken,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Invalid or expired reset code");
      }

      setMessage("Password updated. You can now log in.");
      setMode("login");

      // For convenience, preload login password field (optional)
      setPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      setMessage(e.message || "Invalid or expired reset code");
      setCaptchaToken(null);
      setCaptchaKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  return {
    // mode
    mode,
    setMode,

    // shared
    email,
    setEmail,
    emailValid,

    // login/signup
    name,
    setName,
    tier,
    setTier,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    strength,
    passwordsMatch,
    loginValid,
    signupValid,

    // verify
    verificationCode,
    setVerificationCode,
    captchaToken,
    setCaptchaToken,
    captchaKey,
    setCaptchaKey,
    resendCooldown,
    resendCode,
    verifyValid,

    // reset
    resetCode,
    setResetCode,
    newPassword,
    setNewPassword,
    confirmResetPassword,
    setConfirmResetPassword,
    resetPasswordStrength,
    resetPasswordsMatch,
    resetValid,
    requestPasswordReset,
    resetPassword,

    // ui
    loading,
    message,
    submit,

    // optional close callback compatibility
    onClose,
  };
}

