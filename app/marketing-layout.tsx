import { ReactNode } from "react";
import Link from "next/link";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold">
                Hoos Helping
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </>
  );
}
