interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export default function LoadingSpinner({
  size = "md",
  className = "",
  text,
}: LoadingSpinnerProps) {
  const sizeStyles = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeStyles[size]} animate-spin rounded-full border-solid border-primary border-r-transparent`}
        role="status"
        aria-label="Loading"
      />
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
}

export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="text-center py-12">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

export function InlineLoader({ text }: { text?: string }) {
  return <LoadingSpinner size="sm" text={text} className="py-2" />;
}
