import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  title = "Page not found",
  message = "The page you are looking for does not exist or has been moved.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="mx-auto w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        
        <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>

        <a 
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go back home
        </a>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
            Powered by Flotrafic
          </p>
        </div>
      </div>
    </div>
  );
}
