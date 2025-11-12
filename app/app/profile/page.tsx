import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@/app/generated/prisma";
import Link from "next/link";

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
      assignedTasks: true,
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
  const helperAssignments = user.assignedTasks || [];
  const tasksCompletedForOthers = helperAssignments.filter(
    (task) => task.status === "completed"
  ).length;
  const helperActiveTasks = helperAssignments.filter((task) =>
    ["assigned", "in_progress"].includes(task.status)
  ).length;

  const isHelper = user.isHelperProfileComplete;
  const isTasker = totalTasksPosted > 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">Profile</p>
          <h1 className="text-3xl font-bold text-gray-900">Your profile</h1>
          <p className="text-gray-600">
            View your stats and account information in one place.
          </p>
        </div>
        <div className="rounded-full bg-uva-blue px-4 py-2 text-sm font-semibold text-white shadow-sm">
          {user.role}
        </div>
      </header>

      <section className="overflow-hidden rounded-md bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-uva-orange text-3xl font-semibold text-white">
            {(user.name || user.email).slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-[200px] flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-semibold text-gray-900">
                {user.name || "Your name"}
              </h2>
              {isTasker && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  Tasker
                </span>
              )}
              {isHelper && (
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
                  Helper
                </span>
              )}
            </div>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">
              Member since{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {user.emailVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-green-700">
                ✓ Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-yellow-700">
                Pending verification
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-md bg-white px-6 py-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">
                Tasker profile
              </p>
              <h3 className="text-lg font-semibold text-gray-900">
                Task posting overview
              </h3>
            </div>
            <Link
              href="/app/tasks/new"
              className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary hover:bg-primary/20"
            >
              Post a task
            </Link>
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-gray-500">Tasks posted</dt>
              <dd className="text-3xl font-bold text-uva-blue">
                {totalTasksPosted}
              </dd>
              <p className="text-xs text-gray-500">Total tasks created</p>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Tasks completed</dt>
              <dd className="text-3xl font-bold text-green-600">
                {completedTasksPosted}
              </dd>
              <p className="text-xs text-gray-500">
                Completed by helpers you hired
              </p>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/app/my-tasks"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Manage tasks
            </Link>
            <Link
              href="/app/tasks"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              Browse helpers
            </Link>
          </div>
        </div>

        <div className="rounded-md bg-white px-6 py-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500">
                Helper profile
              </p>
              <h3 className="text-lg font-semibold text-gray-900">
                Helping overview
              </h3>
            </div>
            {isHelper ? (
              <Link
                href="/profile/edit"
                className="rounded-full border border-gray-300 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Edit helper profile
              </Link>
            ) : (
              <Link
                href="/onboarding/helper"
                className="rounded-full bg-primary px-3 py-1 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                Become a helper
              </Link>
            )}
          </div>

          {isHelper ? (
            <>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-gray-500">
                    Tasks completed for others
                  </dt>
                  <dd className="text-3xl font-bold text-purple-600">
                    {tasksCompletedForOthers}
                  </dd>
                  <p className="text-xs text-gray-500">
                    Completed assignments
                  </p>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Active assignments</dt>
                  <dd className="text-3xl font-bold text-green-600">
                    {helperActiveTasks}
                  </dd>
                  <p className="text-xs text-gray-500">
                    Currently in progress
                  </p>
                </div>
              </dl>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-gray-100 p-4">
                  <dt className="text-sm text-gray-500">Hourly rate</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {user.hourlyRate
                      ? `$${user.hourlyRate.toFixed(2)}/hr`
                      : "Not set"}
                  </dd>
                  <p className="text-xs text-gray-500">
                    {user.hasCar ? "Has car for errands" : "No car listed"}
                  </p>
                </div>
                <div className="rounded-md border border-gray-100 p-4">
                  <dt className="text-sm text-gray-500">Skills</dt>
                  <dd className="text-sm text-gray-900">
                    {user.skills?.length
                      ? user.skills.join(", ")
                      : "No skills listed"}
                  </dd>
                </div>
              </div>
            </>
          ) : (
            <p className="mt-6 text-sm text-gray-600">
              You haven&apos;t created a helper profile yet. Set up your helper
              profile to start earning by helping other taskers.
            </p>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-md bg-white px-6 py-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Account information
            </h3>
            <p className="text-sm text-gray-500">
              Keep your contact details up to date.
            </p>
          </div>
          <button
            disabled
            className="rounded-full border border-gray-300 px-4 py-1 text-sm font-semibold text-gray-400"
          >
            Edit coming soon
          </button>
        </div>
        <dl className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-600">Email address</dt>
            <dd className="text-gray-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">Display name</dt>
            <dd className="text-gray-900">{user.name || "Not set"}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
