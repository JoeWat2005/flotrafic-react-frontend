// src/features/site/slug.ts

/**
 * Reserved slugs that must NEVER resolve to a business site.
 * These include:
 * - Backend API routes
 * - Frontend platform routes
 * - Infrastructure / DNS paths
 */
export const RESERVED_SLUGS = new Set<string>([
  // Infrastructure
  "www",
  "api",
  "admin",
  "static",
  "assets",
  "cdn",
  "files",

  // Backend routes
  "auth",
  "billing",
  "bookings",
  "business",
  "enquiries",
  "me",
  "public",
  "stripe",

  // Frontend / platform routes
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
]);

/**
 * Resolve the business slug from the current URL.
 *
 * DEV:
 *   http://localhost:5173/<slug>
 *
 * PROD:
 *   https://flotrafic.co.uk/<slug>
 */
export function getSlug(): string | null {
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;

  let slug: string | null = null;

  // DEV: localhost:5173/<slug>
  if (import.meta.env.DEV && hostname === "localhost") {
    const parts = pathname.split("/").filter(Boolean);
    slug = parts[0] ?? null;
  }

  // PROD: flotrafic.co.uk/<slug>
  else {
    const parts = pathname.split("/").filter(Boolean);
    slug = parts[0] ?? null;
  }

  if (!slug) return null;

  // Normalize
  slug = slug.toLowerCase();

  // Block reserved routes
  if (RESERVED_SLUGS.has(slug)) {
    return null;
  }

  return slug;
}

