"use client";
import type { TemplateConfig } from "@/types";

interface TemplatePickerProps {
  templates: { id: number; name: string; isFree: boolean; config: TemplateConfig }[];
  selected: number;
  onSelect: (id: number) => void;
  isPaid: boolean;
}

export function TemplatePicker({ templates, selected, onSelect, isPaid }: TemplatePickerProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {templates.map((tpl) => {
        const locked = !isPaid && !tpl.isFree;
        return (
          <button
            key={tpl.id}
            onClick={() => !locked && onSelect(tpl.id)}
            disabled={locked}
            className={`flex-shrink-0 w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1
              transition-all duration-200 text-xs font-medium
              ${selected === tpl.id
                ? "ring-2 ring-brand-500 ring-offset-2"
                : "border border-gray-200"
              }
              ${locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-brand-300"}
            `}
            style={{ backgroundColor: tpl.config.bgColor }}
          >
            <span style={{ color: tpl.config.textColor, fontFamily: tpl.config.fontFamily }}>
              Aa
            </span>
            <span className="text-[10px] truncate px-1" style={{ color: tpl.config.accentColor }}>
              {tpl.name}
            </span>
            {locked && <span className="text-[10px] text-amber-500">🔒</span>}
          </button>
        );
      })}
    </div>
  );
}
