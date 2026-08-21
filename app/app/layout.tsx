import { ReactNode } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import UserMenu from "@/components/auth/user-menu";
import AppMobileMenu from "@/components/app/mobile-nav";
import AppNavLink from "@/components/app/app-nav-link";
import { APP_NAV_LINKS, APP_NAV_CTA } from "@/lib/app-navigation";
import { ViewOnGitHubLink } from "@/components/view-on-github";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <Link
                href="/app/dashboard"
                className="flex shrink-0 items-center -m-1.5 p-1.5"
              >
                <span className="sr-only">Hoos Helping</span>
                <div className="bg-uva-orange rounded-lg p-1.5 flex items-center justify-center w-8 h-8">
                  <svg
                    width="18"
                    height="18"
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
                <span className="ml-2 text-lg font-bold text-uva-blue">
                  Hoos Helping
                </span>
              </Link>
              <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                {APP_NAV_LINKS.map((link) => (
                  <AppNavLink key={link.href} {...link} />
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center gap-4">
              <Link
                href={APP_NAV_CTA.href}
                className="inline-flex rounded-full bg-uva-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e66c00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uva-orange"
              >
                {APP_NAV_CTA.label}
              </Link>
              <UserMenu user={session.user} />
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 sm:hidden">
          <AppMobileMenu user={session.user} />
        </div>
      </nav>
      <div className="flex-1 py-8 sm:py-10">
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-4 text-sm text-gray-500 sm:px-6 lg:px-8">
          <span>
            © {new Date().getFullYear()} Hoos Helping · University of Virginia
          </span>
          <span aria-hidden="true" className="text-gray-300">
            |
          </span>
          <ViewOnGitHubLink className="hover:text-gray-900" />
        </div>
      </footer>
    </div>
  );
}
