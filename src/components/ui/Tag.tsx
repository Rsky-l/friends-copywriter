"use client";

interface TagProps {
  label: string;
  active?: boolean;
  paid?: boolean;
  onClick?: () => void;
}

export function Tag({ label, active = false, paid = false, onClick }: TagProps) {
  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
        transition-colors duration-150 select-none
        ${onClick ? "cursor-pointer" : ""}
        ${active
          ? "bg-brand-500 text-white"
          : paid
            ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
            : "bg-brand-50 text-brand-600 hover:bg-brand-100"
        }`}
    >
      {label}
    </span>
  );
}
