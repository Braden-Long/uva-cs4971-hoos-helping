interface BadgeProps {
  children: React.ReactNode;
  variant?: "category" | "status" | "default";
  status?:
    | "open"
    | "assigned"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "pending"
    | "accepted"
    | "rejected";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  status,
  size = "md",
  className = "",
}: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full font-medium";

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  const variantStyles = {
    category: "bg-primary/10 text-primary",
    default: "bg-gray-100 text-gray-700",
    status: getStatusStyles(status),
  };

  function getStatusStyles(status?: string): string {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  const combinedStyles = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  return <span className={combinedStyles}>{children}</span>;
}
