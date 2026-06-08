"use client";
import { useState } from "react";
import { RewritePanel } from "@/components/copywriting/RewritePanel";

export default function RewritePage() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!submitted || !text) {
    return (
      <div>
        <h1 className="text-xl font-bold text-slate-800 mb-4">✏️ AI 改写文案</h1>
        <p className="text-sm text-slate-500 mb-4">
          输入你已有的文案，AI 帮你改写为不同风格
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="在这里粘贴你想改写的文案..."
          className="input min-h-[150px] resize-y mb-4"
        />
        <button
          onClick={() => text.trim() && setSubmitted(true)}
          disabled={!text.trim()}
          className="btn-primary w-full"
        >
          开始改写
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => { setSubmitted(false); setText(""); }}
          className="text-sm text-brand-500 hover:text-brand-600"
        >
          ← 重新输入
        </button>
        <h1 className="text-lg font-bold text-slate-800">改写结果</h1>
      </div>
      <div className="card mb-4 p-3 bg-gray-50">
        <p className="text-sm text-slate-500 line-clamp-2">原文：{text}</p>
      </div>
      <RewritePanel original={text} />
    </div>
  );
}
