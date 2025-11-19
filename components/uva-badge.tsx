interface UvaBadgeProps {
  className?: string;
}

export default function UvaBadge({ className = "" }: UvaBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${className}`}
      style={{
        backgroundColor: "#E57200", // UVA Orange
        border: "1.5px solid #D16800", // Darker orange border
        color: "#232D4B", // UVA Navy Blue
      }}
      title="UVA Verified - @virginia.edu email"
    >
      UVA
    </span>
  );
}
