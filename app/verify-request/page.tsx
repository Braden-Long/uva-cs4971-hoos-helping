import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white py-8 px-6 shadow rounded-lg text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Check your email
          </h2>
          <p className="text-gray-600 mb-6">
            A sign in link has been sent to your email address. Click the link
            to sign in to your account.
          </p>
          <div className="text-sm text-gray-500">
            <p>The link will expire in 24 hours.</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
