import SignInForm from "@/components/auth/sign-in-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LoginPage() {
  const session = await auth();

  // If user is already signed in, redirect to dashboard
  if (session?.user) {
    redirect("/app/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Hoos Helping
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email to receive a magic link
          </p>
        </div>
        <div className="mt-8 bg-white py-8 px-6 shadow rounded-lg">
          <SignInForm />
        </div>
        <div className="text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
