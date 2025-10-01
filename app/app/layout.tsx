import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
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
              <a href="/app/dashboard" className="text-xl font-bold">
                Hoos Helping
              </a>
              <div className="hidden md:flex gap-6">
                <a
                  href="/app/dashboard"
                  className="text-sm hover:text-gray-600"
                >
                  Browse Tasks
                </a>
                <a href="/app/tasks/new" className="text-sm hover:text-gray-600">
                  Post a Task
                </a>
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
