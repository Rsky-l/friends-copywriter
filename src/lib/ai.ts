import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_API_KEY || "sk-xxx",
  baseURL: process.env.AI_BASE_URL || "https://api.deepseek.com/v1",
});

const MODEL = process.env.AI_MODEL || "deepseek-chat";

interface RewriteInput {
  original: string;
  style: string;
  wordLimit: number;
  addEmoji: boolean;
}

export async function rewrite(input: RewriteInput): Promise<string[]> {
  const prompt = `你是一个朋友圈文案专家。请将以下文案改写为${input.style}风格，保持${input.wordLimit}字以内，${input.addEmoji ? "适当添加" : "不加"}emoji。输出3个版本，用数字序号 1. 2. 3. 分隔，每个版本独占一行。

原文：${input.original}`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 600,
  });

  const text = response.choices[0]?.message?.content || "";
  // Split by lines starting with digit+delimiter (1. 1) 1、etc)
  const lines = text
    .split(/\n/)
    .filter((l) => /^\s*\d+[.、)）]\s/.test(l))
    .map((l) => l.replace(/^\s*\d+[.、)）]\s*/, "").trim())
    .filter((l) => l.length > 3);
  return lines.slice(0, 3);
}

interface GenerateInput {
  topic: string;
  scene: string;
  mood: string;
  wordLimit: number;
  addEmoji: boolean;
}

export async function generateOriginal(input: GenerateInput): Promise<string> {
  const prompt = `你是一个朋友圈文案专家。请为「${input.topic}」写一条朋友圈文案。
场景：${input.scene}
情绪风格：${input.mood}
字数：${input.wordLimit}字以内
${input.addEmoji ? "请添加适当的emoji和话题标签。" : "不加emoji。"}

直接输出文案，不需要解释。`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
    max_tokens: 400,
  });

  return response.choices[0]?.message?.content || "";
}

export async function extractImageStyle(copywriting: string): Promise<string> {
  const prompt = `分析以下朋友圈文案，用简短的一句话描述适合搭配的图片风格（如"日落逆光自拍"、"简约咖啡杯俯拍"）。直接输出描述，不超过20字。\n\n文案：${copywriting}`;

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    max_tokens: 80,
  });

  return response.choices[0]?.message?.content || "";
}
