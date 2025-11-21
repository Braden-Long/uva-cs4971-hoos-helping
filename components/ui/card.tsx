import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
}: CardProps) {
  const baseStyles = "overflow-hidden rounded-md bg-white shadow-sm";
  const hoverStyles = hover ? "transition hover:shadow-md" : "";

  const paddingStyles = {
    none: "",
    sm: "px-4 py-3",
    md: "px-6 py-5",
    lg: "px-8 py-6",
  };

  const combinedStyles = `${baseStyles} ${hoverStyles} ${paddingStyles[padding]} ${className}`;

  return <div className={combinedStyles}>{children}</div>;
}

export function CardHeader({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-b border-gray-100 pb-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
}
