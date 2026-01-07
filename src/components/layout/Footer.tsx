export default function Footer() {
  return (
    <footer className="py-14 border-t bg-white">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-6 text-center">

        {/* Brand line */}
        <p className="text-sm text-gray-500 max-w-md">
          Bringing businesses online — and helping them grow.
        </p>

        {/* Contact */}
        <a
          href="mailto:sales@flotrafic.co.uk"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition"
        >
          {/* Mail SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M2 4h20v16H2V4Zm10 7L4 6v12h16V6l-8 5Z" />
          </svg>
          sales@flotrafic.co.uk
        </a>

        {/* Socials */}
        <div className="flex gap-8 items-center text-gray-500">

          {/* X */}
          <a
            href="https://x.com/flotrafic"
            aria-label="X"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 w-7 transition-transform hover:scale-110"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.964 6.817H1.684l7.73-8.84L1.25 2.25h6.826l4.713 6.231L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/flotrafic"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 w-7 transition-transform hover:scale-110"
            >
              <path d="M7.5 2C4.462 2 2 4.462 2 7.5v9C2 19.538 4.462 22 7.5 22h9c3.038 0 5.5-2.462 5.5-5.5v-9C22 4.462 19.538 2 16.5 2h-9Zm9 1.5a4 4 0 0 1 4 4v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4h9Zm-4.5 3a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Zm0 1.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm5.75-.88a1.13 1.13 0 1 0 0 2.26 1.13 1.13 0 0 0 0-2.26Z" />
            </svg>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/flotrafic"
            aria-label="LinkedIn"
            className="hover:text-indigo-600 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 w-7 transition-transform hover:scale-110"
            >
              <path d="M4.98 3.5A2.48 2.48 0 1 1 2.5 5.98 2.48 2.48 0 0 1 4.98 3.5ZM3 8.75h4v12H3Zm7 0h3.8v1.64h.05a4.16 4.16 0 0 1 3.74-2.05c4 0 4.75 2.63 4.75 6.05v6.36h-4v-5.64c0-1.35 0-3.08-1.88-3.08s-2.17 1.47-2.17 2.98v5.74h-4Z" />
            </svg>
          </a>

        </div>

        {/* Legal */}
        <p className="text-xs text-gray-400">
          © 2025 Flotrafic. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

