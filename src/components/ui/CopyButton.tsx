"use client";
import { useState } from "react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200
        ${copied
          ? "bg-emerald-500 text-white"
          : "bg-brand-500 text-white hover:bg-brand-600"
        } ${className}`}
    >
      {copied ? "已复制 ✓" : "一键复制"}
    </button>
  );
}
