import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import UserMenu from "@/components/auth/user-menu";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <>
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link href="/app/dashboard" className="text-xl font-bold">
                Hoos Helping
              </Link>
              <div className="hidden md:flex gap-6">
                <Link href="/app/tasks" className="text-sm hover:text-gray-600">
                  Browse Tasks
                </Link>
                <Link
                  href="/app/tasks/new"
                  className="text-sm hover:text-gray-600"
                >
                  Post a Task
                </Link>
                <Link
                  href="/app/my-tasks"
                  className="text-sm hover:text-gray-600"
                >
                  My Tasks
                </Link>
                <Link
                  href="/app/profile"
                  className="text-sm hover:text-gray-600"
                >
                  Profile
                </Link>
              </div>
            </div>
            <UserMenu user={session.user} />
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </>
  );
}
