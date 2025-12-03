"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import Alert from "@/components/ui/alert";
import { InlineLoader } from "@/components/ui/loading-spinner";

interface UvaVerificationSectionProps {
  isVerified: boolean;
  uvaEmail: string | null;
}

export default function UvaVerificationSection({
  isVerified,
  uvaEmail,
}: UvaVerificationSectionProps) {
  const [email, setEmail] = useState(uvaEmail || "");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/users/verify-uva/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uvaEmail: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send code");
        return;
      }

      setSuccess("Verification code sent! Check your UVA email.");
      setCodeSent(true);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/users/verify-uva/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid code");
        return;
      }

      setSuccess("UVA affiliation verified successfully!");
      // Refresh the page to show verified status
      setTimeout(() => window.location.reload(), 1500);
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return (
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-blue-700">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold">UVA Verified</span>
        </div>
        <p className="text-sm text-gray-600">
          Your UVA affiliation is verified: <strong>{uvaEmail}</strong>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {!codeSent ? (
        <div className="space-y-4">
          <FormInput
            label="UVA Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="computingid@virginia.edu"
            helperText="Enter your @virginia.edu email to receive a verification code"
          />

          <Button
            onClick={handleSendCode}
            disabled={isLoading || !email.endsWith("@virginia.edu")}
            fullWidth
          >
            {isLoading ? (
              <>
                <InlineLoader />
                <span className="ml-2">Sending...</span>
              </>
            ) : (
              "Send Verification Code"
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Code sent to <strong>{email}</strong>
          </p>

          <FormInput
            label="Verification Code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            helperText="Check your email for the 6-digit code (expires in 10 minutes)"
          />

          <div className="flex gap-3">
            <Button
              onClick={handleVerifyCode}
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? (
                <>
                  <InlineLoader />
                  <span className="ml-2">Verifying...</span>
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                setCodeSent(false);
                setCode("");
                setError(null);
                setSuccess(null);
              }}
              disabled={isLoading}
            >
              Resend Code
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
