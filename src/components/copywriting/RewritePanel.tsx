"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { Tag } from "@/components/ui/Tag";

const STYLES = ["文艺清新", "幽默搞笑", "温暖治愈", "霸气高冷", "简短精炼", "深情走心"];
const WORD_OPTIONS = [30, 50, 100, 150];

export function RewritePanel({ original }: { original: string }) {
  const [style, setStyle] = useState("文艺清新");
  const [wordLimit, setWordLimit] = useState(100);
  const [addEmoji, setAddEmoji] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ variants: string[]; remaining: number; limit: number; fallback?: boolean } | null>(null);
  const [error, setError] = useState("");

  const handleRewrite = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original, style, wordLimit, addEmoji }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data);
      } else {
        setError(json.error || "改写失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-slate-500 mb-2 block">选择风格</label>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <Tag key={s} label={s} active={style === s} onClick={() => setStyle(s)} />
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500 mb-2 block">字数限制</label>
        <div className="flex gap-2">
          {WORD_OPTIONS.map((w) => (
            <Tag key={w} label={`≤${w}字`} active={wordLimit === w} onClick={() => setWordLimit(w)} />
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={addEmoji}
          onChange={(e) => setAddEmoji(e.target.checked)}
          className="rounded accent-brand-500"
        />
        添加 emoji 和话题标签
      </label>

      <Button onClick={handleRewrite} loading={loading} className="w-full">
        ✨ AI 改写
      </Button>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {result && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400">
              今日剩余 {result.remaining}/{result.limit} 次
              {result.fallback && "（离线模式）"}
            </span>
          </div>
          {result.variants.map((v, i) => (
            <div key={i} className="card">
              <p className="text-base leading-relaxed mb-3">{v}</p>
              <CopyButton text={v} className="!py-1.5 !px-4 !text-xs" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
