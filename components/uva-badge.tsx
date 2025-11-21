interface UvaBadgeProps {
  className?: string;
}

export default function UvaBadge({ className = "" }: UvaBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${className}`}
      style={{
        backgroundColor: "#E57200", // UVA Orange
        border: "1.5px solid #D16800", // Darker orange border
        color: "#FFFFFF", // White text
      }}
      title="UVA Verified - @virginia.edu email"
    >
      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      UVA
    </span>
  );
}
