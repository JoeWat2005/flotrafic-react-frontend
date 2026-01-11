// src/site/ErrorPage.tsx

export default function ErrorPage({
  title = "Site not found",
  message = "This business site does not exist or is unavailable.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-2xl bg-white p-8 text-center shadow-xl">
        <h1 className="text-2xl font-bold mb-3">{title}</h1>

        <p className="text-gray-600 mb-6">{message}</p>

        <p className="text-xs text-gray-400">
          Powered by <span className="font-medium">Flotrafic</span>
        </p>
      </div>
    </div>
  );
}

