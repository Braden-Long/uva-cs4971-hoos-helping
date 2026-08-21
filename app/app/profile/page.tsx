import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import UvaBadge from "@/components/uva-badge";
import BgVerifiedBadge from "@/components/bg-verified-badge";
import BackgroundVerificationBadge from "@/components/background-verification-badge";
import UvaVerificationSection from "@/components/uva-verification-section";
import EditProfileInfoForm from "@/components/edit-profile-info-form";

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
            <p className="text-gray-600 flex items-center gap-2">
              {user.email}
              {user.isUvaVerified && <UvaBadge />}
              {user.isBackgroundVerified && <BgVerifiedBadge />}
            </p>
            <p className="text-sm text-gray-500">
              Member since{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-md bg-white px-6 py-6 shadow-sm">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Account information
            </h3>
            <p className="text-sm text-gray-500">
              Keep your contact details up to date. Address is required for
              background verification.
            </p>
          </div>
          <div className="mt-6">
            <EditProfileInfoForm />
          </div>
        </div>

        <div className="overflow-hidden rounded-md bg-white px-6 py-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="h-6 w-6 text-uva-orange"
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
            <h3 className="text-xl font-semibold text-gray-900">
              UVA Verification
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Verify your UVA affiliation to receive a verified badge on your
            profile and tasks.
          </p>
          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <div className="flex items-start gap-2">
              <svg
                className="h-5 w-5 text-uva-orange mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Trusted community member:</strong> Show you&apos;re part
                of UVA
              </span>
            </div>
            <div className="flex items-start gap-2">
              <svg
                className="h-5 w-5 text-uva-orange mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Quick verification:</strong> Receive a code via email
              </span>
            </div>
            <div className="flex items-start gap-2">
              <svg
                className="h-5 w-5 text-uva-orange mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Separate from login:</strong> Use any email for your
                account
              </span>
            </div>
          </div>
          <UvaVerificationSection
            isVerified={user.isUvaVerified}
            uvaEmail={user.uvaEmail}
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-md bg-white px-6 py-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="h-6 w-6 text-blue-600"
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
            <h3 className="text-xl font-semibold text-gray-900">
              Background Verification
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Build trust in the Hoos Helping community by completing a background
            verification. This automated check helps taskers feel confident when
            hiring helpers.
          </p>
          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <div className="flex items-start gap-2">
              <svg
                className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Increases trust:</strong> Verified helpers are more
                likely to be hired
              </span>
            </div>
            <div className="flex items-start gap-2">
              <svg
                className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Quick & automated:</strong> Verification completes in
                seconds
              </span>
            </div>
            <div className="flex items-start gap-2">
              <svg
                className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Privacy-focused:</strong> Uses publicly available
                information only
              </span>
            </div>
            <div className="flex items-start gap-2">
              <svg
                className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>
                <strong>Especially for helpers:</strong> Stand out when applying
                for tasks
              </span>
            </div>
          </div>
          <BackgroundVerificationBadge
            isVerified={user.isBackgroundVerified}
            status={user.backgroundVerificationStatus}
            userId={user.id}
            userName={user.name}
            userBio={user.bio}
            userAddressLine1={user.addressLine1}
            userCity={user.city}
            userState={user.state}
            userZipCode={user.zipCode}
          />
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
              {/* Total Earnings Display */}
              <div className="mt-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <dt className="text-sm font-medium text-green-700">
                      Total Earnings
                    </dt>
                    <dd className="text-4xl font-bold text-green-600">
                      ${user.totalEarnings.toFixed(2)}
                    </dd>
                  </div>
                </div>
                <p className="text-xs text-green-700">
                  Earned from {tasksCompletedForOthers} completed task
                  {tasksCompletedForOthers !== 1 ? "s" : ""}
                </p>
              </div>

              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-gray-500">
                    Tasks completed for others
                  </dt>
                  <dd className="text-3xl font-bold text-purple-600">
                    {tasksCompletedForOthers}
                  </dd>
                  <p className="text-xs text-gray-500">Completed assignments</p>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Active assignments</dt>
                  <dd className="text-3xl font-bold text-green-600">
                    {helperActiveTasks}
                  </dd>
                  <p className="text-xs text-gray-500">Currently in progress</p>
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
    </div>
  );
}
