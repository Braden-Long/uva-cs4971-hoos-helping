"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppNavLinkConfig, isActivePath } from "@/lib/app-navigation";

interface AppNavLinkProps extends AppNavLinkConfig {
  className?: string;
}

export default function AppNavLink({ href, label, className = "" }: AppNavLinkProps) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  const baseClasses =
    "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors";
  const activeClasses = "border-uva-blue text-gray-900";
  const inactiveClasses =
    "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700";

  return (
    <Link
      href={href}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses} ${className}`}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}
