"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/button";
import { InlineLoader } from "@/components/ui/loading-spinner";
import Alert from "@/components/ui/alert";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const callbackUrl = searchParams.get("callbackUrl") || "/app/dashboard";

  useEffect(() => {
    // Basic validation
    if (!token || !email) {
      setError("Invalid verification link. Please request a new one.");
    }
  }, [token, email]);

  const handleVerify = async () => {
    if (!token || !email) {
      setError("Invalid verification link");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // Redirect to NextAuth callback with the token
      // This will consume the token and complete the sign-in
      const callbackUrlParam = encodeURIComponent(callbackUrl);
      window.location.href = `/api/auth/callback/resend?token=${token}&email=${encodeURIComponent(email)}&callbackUrl=${callbackUrlParam}`;
    } catch {
      setError("Failed to verify email. Please try again.");
      setIsVerifying(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Verify your email
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Click the button below to complete your sign-in
          </p>
        </div>

        <div className="rounded-md bg-white px-6 py-8 shadow-sm">
          {error ? (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          ) : (
            <>
              <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    className="h-6 w-6 text-primary"
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
                <p className="text-sm text-gray-700">
                  Signing in as: <span className="font-semibold">{email}</span>
                </p>
              </div>

              <Button
                onClick={handleVerify}
                disabled={isVerifying}
                fullWidth
                size="lg"
              >
                {isVerifying ? (
                  <>
                    <InlineLoader />
                    <span className="ml-2">Verifying...</span>
                  </>
                ) : (
                  "Complete Sign In"
                )}
              </Button>

              <p className="mt-4 text-center text-xs text-gray-500">
                This extra step helps prevent email scanning from invalidating
                your link
              </p>
            </>
          )}

          {error && (
            <div className="mt-4 text-center">
              <a
                href="/login"
                className="text-sm font-medium text-primary hover:text-primary-hover"
              >
                Request a new link →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
