import { auth } from "@/auth";
import Link from "next/link";
import { PrismaClient } from "@/app/generated/prisma";
import UvaBadge from "@/components/uva-badge";
import Card from "@/components/ui/card";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const session = await auth();

  // Fetch user data to get isUvaVerified and helper profile status
  const user = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          isUvaVerified: true,
          isHelperProfileComplete: true,
          skills: true,
          hourlyRate: true,
        },
      })
    : null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-8 flex items-center gap-2">
        Welcome, {session?.user?.email}
        {user?.isUvaVerified && <UvaBadge />}
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card hover>
          <h2 className="text-xl font-semibold mb-2">My Tasks</h2>
          <p className="text-gray-600 mb-4">
            View tasks you posted, applied to, and are assigned to
          </p>
          <Link
            href="/app/my-tasks"
            className="text-primary hover:text-primary-hover font-medium text-sm"
          >
            Manage my tasks →
          </Link>
        </Card>

        <Card hover>
          <h2 className="text-xl font-semibold mb-2">Browse Tasks</h2>
          <p className="text-gray-600 mb-4">
            Find tasks in your area that you can help with and earn money
          </p>
          <Link
            href="/app/tasks"
            className="text-primary hover:text-primary-hover font-medium text-sm"
          >
            View all tasks →
          </Link>
        </Card>

        <Card hover>
          <h2 className="text-xl font-semibold mb-2">Post a Task</h2>
          <p className="text-gray-600 mb-4">
            Need help? Post a task and get matched with skilled helpers
          </p>
          <Link
            href="/app/tasks/new"
            className="text-primary hover:text-primary-hover font-medium text-sm"
          >
            Create task →
          </Link>
        </Card>

        {user?.isHelperProfileComplete ? (
          <Card hover>
            <h2 className="text-xl font-semibold mb-2">Helper Profile</h2>
            <p className="text-gray-600 mb-2">
              {user.skills && user.skills.length > 0
                ? `Skills: ${user.skills.join(", ")}`
                : "Your helper profile is active"}
            </p>
            {user.hourlyRate && (
              <p className="text-gray-600 mb-4">
                Rate: ${user.hourlyRate.toFixed(2)}/hr
              </p>
            )}
            <Link
              href="/app/profile"
              className="text-primary hover:text-primary-hover font-medium text-sm"
            >
              Manage profile →
            </Link>
          </Card>
        ) : (
          <Card hover>
            <h2 className="text-xl font-semibold mb-2">Become a Helper</h2>
            <p className="text-gray-600 mb-4">
              Set up your helper profile and start earning by helping others
            </p>
            <Link
              href="/onboarding/helper"
              className="text-primary hover:text-primary-hover font-medium text-sm"
            >
              Setup profile →
            </Link>
          </Card>
        )}

        <Card hover>
          <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
          <p className="text-gray-600 mb-4">
            Manage your account, helper settings, and view your ratings
          </p>
          <Link
            href="/app/profile"
            className="text-primary hover:text-primary-hover font-medium text-sm"
          >
            View profile →
          </Link>
        </Card>
      </div>
    </div>
  );
}
