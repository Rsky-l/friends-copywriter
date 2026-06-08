import { GeneratePanel } from "@/components/copywriting/GeneratePanel";

export default function GeneratePage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-1">✨ 原创定制文案</h1>
      <p className="text-sm text-slate-500 mb-4">
        告诉 AI 你的主题和风格偏好，为你从零生成独一无二的朋友圈文案
      </p>
      <GeneratePanel />
    </div>
  );
}
