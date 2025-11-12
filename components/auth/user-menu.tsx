"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const initials = user.email ? user.email.substring(0, 2).toUpperCase() : "??";
  const menuItems = [
    { label: "Tasker profile", href: "/app/profile" },
    { label: "Helper profile", href: "/profile/edit" },
  ];

  return (
    <div className="relative ml-3" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uva-orange"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="absolute -inset-1.5" aria-hidden="true" />
        <span className="sr-only">Open user menu</span>
        <div className="size-9 rounded-full bg-uva-blue text-white flex items-center justify-center text-sm font-semibold outline -outline-offset-1 outline-black/5">
          {initials}
        </div>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition data-[state=closed]:scale-95 data-[state=closed]:opacity-0"
          role="menu"
          aria-label="User menu"
        >
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
              role="menuitem"
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-hidden"
            role="menuitem"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
