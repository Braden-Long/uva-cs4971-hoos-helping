import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get user data with task counts
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      tasks: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Calculate statistics
  const totalTasksPosted = user.tasks.length;
  const completedTasksPosted = user.tasks.filter(
    (task) => task.status === "completed"
  ).length;

  // For now, we'll set tasks completed for others to 0
  // We'll implement this properly when we add task acceptance/helper tracking
  const tasksCompletedForOthers = 0;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      {/* Profile Information Card */}
      <div className="bg-white border rounded-lg p-8 mb-6">
        <div className="flex items-start gap-6">
          {/* Profile Picture Placeholder */}
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-semibold text-gray-600">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : user.email.charAt(0).toUpperCase()}
          </div>

          {/* User Details */}
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">
              {user.name || "User"}
            </h2>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {user.role}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div className="bg-white border rounded-lg p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {totalTasksPosted}
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Tasks Posted
          </h3>
          <p className="text-xs text-gray-500">Total tasks you created</p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {completedTasksPosted}
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Tasks Completed
          </h3>
          <p className="text-xs text-gray-500">
            Your posted tasks that were completed
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {tasksCompletedForOthers}
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Helped Others
          </h3>
          <p className="text-xs text-gray-500">
            Tasks you completed for others
          </p>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white border rounded-lg p-8">
        <h3 className="text-xl font-semibold mb-6">Account Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Email Address
            </label>
            <p className="text-gray-900">{user.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Display Name
            </label>
            <p className="text-gray-900">{user.name || "Not set"}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Member Since
            </label>
            <p className="text-gray-900">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1">
              Account Status
            </label>
            <p className="text-gray-900">
              {user.emailVerified ? (
                <span className="text-green-600">✓ Verified</span>
              ) : (
                <span className="text-yellow-600">Pending verification</span>
              )}
            </p>
          </div>
        </div>

        {/* Edit Profile Button - Coming Soon */}
        <div className="mt-6 pt-6 border-t">
          <button
            disabled
            className="px-4 py-2 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed"
          >
            Edit Profile (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}
