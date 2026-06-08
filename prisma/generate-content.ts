import { PrismaClient } from "@prisma/client";
import OpenAI from "openai";

const db = new PrismaClient();

const client = new OpenAI({
  apiKey: process.env.AI_API_KEY || "sk-xxx",
  baseURL: process.env.AI_BASE_URL || "https://api.deepseek.com/v1",
});

const MODEL = process.env.AI_MODEL || "deepseek-chat";

async function generateCopywritings(
  scene: string,
  mood: string,
  count: number
): Promise<string[]> {
  const prompt = `你是一个朋友圈文案专家。请为「${scene}」场景、「${mood}」风格生成${count}条不同的朋友圈文案。

要求：
- 每条一行，用数字序号1. 2. 3. 分隔
- 每条15-80字，风格和情绪要匹配
- 适当加入emoji
- 不要重复，每条都不同
- 直接输出文案，不要解释`;

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 1500,
    });

    const text = response.choices[0]?.message?.content || "";
    const lines = text
      .split("\n")
      .filter((l) => /^\d+[.、)\s]/.test(l.trim()))
      .map((l) => l.replace(/^\d+[.、)\s]+/, "").trim())
      .filter((l) => l.length > 5);

    return lines;
  } catch (error) {
    console.error(`  ❌ AI调用失败:`, (error as Error).message);
    return [];
  }
}

async function main() {
  console.log("🚀 开始批量生成文案...\n");

  const categories = await db.category.findMany({ orderBy: { sortOrder: "asc" } });
  const moods = await db.mood.findMany({ orderBy: { sortOrder: "asc" } });

  let totalGenerated = 0;
  let totalPaid = 0;

  for (const cat of categories) {
    console.log(`📂 ${cat.icon} ${cat.name}`);

    for (const mood of moods) {
      // 检查当前组合已有多少条
      const existingCount = await db.copywriting.count({
        where: { categoryId: cat.id, moodId: mood.id },
      });

      const needed = Math.max(0, 5 - existingCount);
      if (needed === 0) {
        console.log(`   ${mood.icon} ${mood.name}: 已有${existingCount}条 ✅`);
        continue;
      }

      console.log(`   ${mood.icon} ${mood.name}: 缺${needed}条，AI生成中...`);
      const generated = await generateCopywritings(cat.name, mood.name, needed);

      if (generated.length === 0) {
        console.log(`   ⚠️ 未生成到内容`);
        continue;
      }

      // 插入文案，30%设为付费
      for (let i = 0; i < generated.length; i++) {
        const isPaid = i < Math.ceil(generated.length * 0.3); // 前30%是付费
        await db.copywriting.create({
          data: {
            content: generated[i],
            categoryId: cat.id,
            moodId: mood.id,
            wordCount: generated[i].length,
            isFree: !isPaid,
            isOriginal: false,
            suggestImageStyle: "",
            usageCount: 0,
          },
        });
        if (isPaid) totalPaid++;
      }

      totalGenerated += generated.length;
      console.log(`   ✅ 新增${generated.length}条 (其中${Math.ceil(generated.length * 0.3)}条付费)`);

      // 小延迟避免API限流
      await new Promise((r) => setTimeout(r, 500));
    }
    console.log("");
  }

  console.log(`\n🎉 完成！共生成 ${totalGenerated} 条文案（${totalPaid}条付费）`);

  const total = await db.copywriting.count();
  const free = await db.copywriting.count({ where: { isFree: true } });
  const paid = await db.copywriting.count({ where: { isFree: false } });
  console.log(`📊 数据库总计: ${total}条 (免费${free} + 付费${paid})`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
