"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { Tag } from "@/components/ui/Tag";

const SCENES = ["旅行打卡", "美食分享", "日常生活", "工作奋斗", "聚会嗨皮", "深夜emo", "节日祝福", "秀恩爱"];
const MOODS = ["文艺清新", "幽默搞笑", "温暖治愈", "霸气高冷", "简短精炼", "深情走心"];
const WORD_OPTIONS = [30, 50, 100, 150];

export function GeneratePanel() {
  const [topic, setTopic] = useState("");
  const [scene, setScene] = useState("日常生活");
  const [mood, setMood] = useState("温暖治愈");
  const [wordLimit, setWordLimit] = useState(100);
  const [addEmoji, setAddEmoji] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, scene, mood, wordLimit, addEmoji }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.data.content);
      } else {
        setError(json.error || "生成失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="输入主题，如：周末露营、加班到凌晨…"
        className="input"
        maxLength={50}
      />

      <div>
        <label className="text-xs font-medium text-slate-500 mb-2 block">场景</label>
        <div className="flex flex-wrap gap-2">
          {SCENES.map((s) => (
            <Tag key={s} label={s} active={scene === s} onClick={() => setScene(s)} />
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500 mb-2 block">情绪风格</label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <Tag key={m} label={m} active={mood === m} onClick={() => setMood(m)} />
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500 mb-2 block">字数</label>
        <div className="flex gap-2">
          {WORD_OPTIONS.map((w) => (
            <Tag key={w} label={`≤${w}字`} active={wordLimit === w} onClick={() => setWordLimit(w)} />
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={addEmoji} onChange={(e) => setAddEmoji(e.target.checked)} className="rounded accent-brand-500" />
        添加 emoji 和话题标签
      </label>

      <Button onClick={handleGenerate} loading={loading} className="w-full">
        ✨ AI 生成原创文案
      </Button>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {result && (
        <div className="card">
          <p className="text-base leading-relaxed mb-3">{result}</p>
          <CopyButton text={result} />
        </div>
      )}
    </div>
  );
}
