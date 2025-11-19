"use client";

import { useState } from "react";

interface BackgroundVerificationBadgeProps {
  isVerified: boolean;
  status: string | null;
  userId: string;
  userName: string | null;
  userBio: string | null;
  userAddressLine1: string | null;
  userCity: string | null;
  userState: string | null;
  userZipCode: string | null;
}

export default function BackgroundVerificationBadge({
  isVerified,
  status,
  userId,
  userName,
  userBio,
  userAddressLine1,
  userCity,
  userState,
  userZipCode,
}: BackgroundVerificationBadgeProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [localStatus, setLocalStatus] = useState(status);
  const [localIsVerified, setLocalIsVerified] = useState(isVerified);

  // Check if profile is complete
  const isProfileComplete =
    userName &&
    userName.trim().length >= 3 &&
    userBio &&
    userBio.trim().length >= 20 &&
    userAddressLine1 &&
    userCity &&
    userState &&
    userZipCode;

  const handleRequestVerification = async () => {
    if (!isProfileComplete) {
      setError("Please complete your profile before requesting verification");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/users/verify-background", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.missingFields) {
          setError(
            `Profile incomplete. Missing: ${data.missingFields.join(", ")}`
          );
        } else {
          setError(data.message || data.error || "Verification failed");
        }
        return;
      }

      // Update local state
      setLocalIsVerified(data.verified);
      setLocalStatus(data.verified ? "verified" : "failed");

      // Refresh the page to show updated status
      window.location.reload();
    } catch (err) {
      setError("An error occurred. Please try again later.");
      console.error("Verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Render based on status
  if (localIsVerified) {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-blue-700 text-sm">
        <svg
          className="h-4 w-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        Background Verified
      </div>
    );
  }

  if (localStatus === "pending") {
    return (
      <div className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-yellow-700 text-sm">
        <svg
          className="h-4 w-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Verification Pending
      </div>
    );
  }

  if (localStatus === "failed") {
    return (
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-red-700 text-sm">
          <svg
            className="h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          Verification Failed
        </div>
        <button
          onClick={handleRequestVerification}
          disabled={isLoading}
          className="text-xs text-blue-600 hover:text-blue-700 underline disabled:opacity-50"
        >
          Retry Verification
        </button>
      </div>
    );
  }

  // Not verified yet
  return (
    <div className="space-y-2">
      {!isProfileComplete && (
        <p className="text-sm text-gray-600">
          Complete your profile (name, bio & address) to request verification
        </p>
      )}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md border border-red-200">
          {error}
        </div>
      )}
      <button
        onClick={handleRequestVerification}
        disabled={isLoading || !isProfileComplete}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Verifying...
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Request Background Verification
          </>
        )}
      </button>
    </div>
  );
}
