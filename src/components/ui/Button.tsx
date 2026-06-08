"use client";
import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "gold" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600",
  outline: "border-2 border-brand-500 text-brand-500 hover:bg-brand-50",
  gold: "bg-amber-500 text-white hover:bg-amber-600",
  ghost: "text-slate-500 hover:bg-gray-100",
};

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-full px-6 py-3 font-medium text-sm
        active:scale-95 transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          处理中...
        </span>
      ) : children}
    </button>
  );
}
