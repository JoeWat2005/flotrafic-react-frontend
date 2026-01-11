// src/pages/public/slug.ts (or wherever it lives)

export const RESERVED_SLUGS = new Set<string>([
  // platform
  "dashboard",
  "login",
  "signup",
  "settings",
  "account",
  "pricing",
  "docs",
  "help",
  "support",
  "status",

  // infra
  "www",
  "api",
  "admin",
  "static",
  "assets",
  "cdn",
  "files",

  // backend prefixes
  "auth",
  "billing",
  "bookings",
  "business",
  "enquiries",
  "me",
  "public",
  "stripe",
]);

export function isReservedSlug(slug: string) {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}


