import { auth } from "@/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome back, {session?.user?.email}!
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Browse Tasks</h2>
          <p className="text-gray-600 mb-4">
            Find tasks in your area that you can help with
          </p>
          <Link
            href="/app/tasks"
            className="text-blue-600 hover:underline text-sm"
          >
            View all tasks →
          </Link>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Post a Task</h2>
          <p className="text-gray-600 mb-4">
            Need help with something? Post a task and get matched with helpers
          </p>
          <Link
            href="/app/tasks/new"
            className="text-blue-600 hover:underline text-sm"
          >
            Create task →
          </Link>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
          <p className="text-gray-600 mb-4">
            Manage your account settings and preferences
          </p>
          <Link
            href="/app/profile"
            className="text-blue-600 hover:underline text-sm"
          >
            View profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
