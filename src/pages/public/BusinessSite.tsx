// src/site/BusinessSite.tsx

import { useEffect, useState } from "react";
import { getSlug } from "./slug";
import ErrorPage from "./ErrorPage";

export default function BusinessSite() {
  const slug = getSlug();

  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Missing slug → hard fail
  if (!slug) {
    return <ErrorPage />;
  }

  useEffect(() => {
    setLoading(true);

    fetch(
      `${import.meta.env.VITE_API_URL}/public/business?slug=${slug}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setName(data.name);
      })
      .catch(() => {
        setName(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (!name) {
    return (
      <ErrorPage
        title="Business not found"
        message="This Flotrafic site doesn’t exist yet."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6">
      <div className="max-w-3xl mx-auto rounded-2xl bg-white p-10 shadow-xl">
        <h1 className="text-3xl font-bold mb-6">{name}</h1>

        <form className="space-y-4">
          <input
            placeholder="Your name"
            className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            placeholder="Your email"
            className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <textarea
            placeholder="Your message"
            rows={4}
            className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex justify-center pt-2">
            <button
              type="button"
              className="
                inline-flex items-center justify-center
                rounded-lg bg-indigo-600 px-6 py-3
                text-sm font-medium text-white
                transition-all duration-200
                hover:bg-indigo-700 hover:scale-[1.02]
              "
            >
              Send enquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
