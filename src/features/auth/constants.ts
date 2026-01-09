export type AuthMode =
  | "login"
  | "signup"
  | "verify"
  | "reset-request"
  | "reset-confirm";

export const RESEND_COOLDOWN = 30;
