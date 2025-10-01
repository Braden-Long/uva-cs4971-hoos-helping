import Link from "next/link";

export default function Home() {
  return (
    <>
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold">
                Hoos Helping
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Hoos Helping
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with helpers in the UVA and Charlottesville community for
              one-time tasks like moving, errands, pet sitting, and more.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="border border-gray-300 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Browse Tasks
              </Link>
            </div>
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Post a Task</h3>
              <p className="text-gray-600">
                Describe what you need help with and set your budget
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Find Helpers</h3>
              <p className="text-gray-600">
                Connect with trusted community members ready to assist
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Get It Done</h3>
              <p className="text-gray-600">
                Complete the task and rate your experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
