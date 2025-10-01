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
          <div className="flex justify-center mb-6">
            <div className="bg-uva-orange rounded-lg p-2.5 flex items-center justify-center w-14 h-14">
              <svg
                width="32"
                height="32"
                viewBox="0 0 500 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-uva-blue"
              >
                <path
                  d="M488 0C494.627 1.28852e-06 500 5.37258 500 12V488C500 494.627 494.627 500 488 500H408C401.373 500 396 494.627 396 488V282H302V447C302 452.523 297.523 457 292 457H208C202.477 457 198 452.523 198 447V282H104V392C104 397.523 99.5228 402 94 402H10C4.47715 402 1.93283e-07 397.523 0 392V108C0 102.477 4.47715 98 10 98H94C99.5228 98 104 102.477 104 108V218H198V53C198 47.4772 202.477 43 208 43H292C297.523 43 302 47.4772 302 53V218H396V12C396 5.37258 401.373 3.22128e-08 408 0H488Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
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
          <Link
            href="/"
            className="text-sm text-primary hover:text-primary-hover"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
