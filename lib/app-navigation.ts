export type AppNavLinkConfig = {
  label: string;
  href: string;
};

export const APP_NAV_LINKS: AppNavLinkConfig[] = [
  { label: "Dashboard", href: "/app/dashboard" },
  { label: "Browse Tasks", href: "/app/tasks" },
  { label: "My Tasks", href: "/app/my-tasks" },
  { label: "Profile", href: "/app/profile" },
];

export const APP_NAV_CTA = {
  label: "Post a Task",
  href: "/app/tasks/new",
};

export function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/app/dashboard") {
    return pathname === "/app" || pathname.startsWith("/app/dashboard");
  }
  return pathname.startsWith(href);
}
