import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variantStyles = {
      primary:
        "bg-primary text-white hover:bg-primary-hover disabled:hover:bg-primary",
      secondary:
        "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:hover:bg-white",
      ghost: "text-primary hover:bg-primary/10 disabled:hover:bg-transparent",
      danger:
        "bg-red-600 text-white hover:bg-red-700 disabled:hover:bg-red-600",
    };

    const sizeStyles = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    const widthStyles = fullWidth ? "w-full" : "";

    const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

    return (
      <button
        ref={ref}
        className={combinedStyles}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
