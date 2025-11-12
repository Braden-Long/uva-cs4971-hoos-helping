"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAV_LINKS, APP_NAV_CTA, isActivePath } from "@/lib/app-navigation";

type MobileMenuUser = {
  name?: string | null;
  email?: string | null;
};

interface AppMobileMenuProps {
  user?: MobileMenuUser | null;
}

export default function AppMobileMenu({ user }: AppMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const initials = user?.email
    ? user.email.substring(0, 2).toUpperCase()
    : "??";
  const userName = user?.name || "Your profile";
  const userEmail = user?.email || "Signed in";

  return (
    <div className="sm:hidden">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-2 focus:outline-offset-2 focus:outline-uva-blue"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
            className={`size-6 ${isOpen ? "hidden" : "block"}`}
          >
            <path
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
            className={`size-6 ${isOpen ? "block" : "hidden"}`}
          >
            <path
              d="M6 18 18 6M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="space-y-1 pb-3">
            {APP_NAV_LINKS.map((link) => {
              const active = isActivePath(pathname, link.href);
              const activeClasses =
                "border-l-4 border-uva-blue bg-uva-blue/5 text-uva-blue";
              const inactiveClasses =
                "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800";

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block border-l-4 py-2 pr-4 pl-3 text-base font-medium ${active ? activeClasses : inactiveClasses}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="flex items-center px-4">
              <div className="shrink-0">
                <div className="size-10 rounded-full bg-uva-blue text-white flex items-center justify-center text-sm font-semibold">
                  {initials}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {userName}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {userEmail}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-4">
              <Link
                href="/app/profile"
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                Your profile
              </Link>
              <Link
                href={APP_NAV_CTA.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-semibold text-white bg-uva-orange text-center hover:bg-[#e66c00]"
              >
                {APP_NAV_CTA.label}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
