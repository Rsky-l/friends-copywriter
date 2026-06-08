import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const scenes = [
  { name: "旅行打卡", slug: "travel", icon: "✈️", sortOrder: 1 },
  { name: "美食分享", slug: "food", icon: "🍜", sortOrder: 2 },
  { name: "日常生活", slug: "daily", icon: "🌿", sortOrder: 3 },
  { name: "工作奋斗", slug: "work", icon: "💼", sortOrder: 4 },
  { name: "聚会嗨皮", slug: "party", icon: "🎉", sortOrder: 5 },
  { name: "深夜emo", slug: "night", icon: "🌙", sortOrder: 6 },
  { name: "节日祝福", slug: "festival", icon: "🎊", sortOrder: 7 },
  { name: "秀恩爱", slug: "love", icon: "💕", sortOrder: 8 },
  { name: "励志鸡汤", slug: "motivation", icon: "🔥", sortOrder: 9 },
];

const moods = [
  { name: "文艺清新", slug: "artsy", icon: "🌸", sortOrder: 1 },
  { name: "幽默搞笑", slug: "funny", icon: "😂", sortOrder: 2 },
  { name: "温暖治愈", slug: "warm", icon: "☀️", sortOrder: 3 },
  { name: "霸气高冷", slug: "cool", icon: "🖤", sortOrder: 4 },
  { name: "简短精炼", slug: "short", icon: "💎", sortOrder: 5 },
  { name: "深情走心", slug: "deep", icon: "💫", sortOrder: 6 },
];

const sampleCopywritings = [
  { content: "换个地方看看人间烟火 🏔️\n\n#旅行 #在路上", scene: "travel", mood: "artsy", isFree: true },
  { content: "身体和灵魂，总有一个在路上。今天的风景，值得所有奔波 ✈️", scene: "travel", mood: "warm", isFree: true },
  { content: "这辈子的碗，是洗不完了。但先吃完这顿再说 🍜", scene: "food", mood: "funny", isFree: true },
  { content: "人间烟火气，最抚凡人心。干了这碗人间烟火 🥢", scene: "food", mood: "deep", isFree: true },
  { content: "生活不是为了赶路，而是为了感受路 🌿", scene: "daily", mood: "artsy", isFree: true },
  { content: "今日份小确幸：一杯热咖啡+一个下午 ☕\n\n#日常 #慢生活", scene: "daily", mood: "warm", isFree: true },
  { content: "努力搬砖，为了有一天可以不用搬砖 💼", scene: "work", mood: "funny", isFree: true },
  { content: "这个点还在加班的人，都是在偷偷改变世界 🌙", scene: "work", mood: "cool", isFree: false },
  { content: "好朋友就是我亲自挑选的家人 💕\n\n#闺蜜 #聚会", scene: "party", mood: "warm", isFree: true },
  { content: "有些情绪，只适合在深夜与自己和解 🌙", scene: "night", mood: "deep", isFree: false },
  { content: "愿你遍历山河，觉得人间值得 🎊", scene: "festival", mood: "warm", isFree: true },
  { content: "遇见你，是我所有美好故事的开始 💕", scene: "love", mood: "deep", isFree: false },
  { content: "没有人可以回到过去，但谁都可以从现在开始 🔥", scene: "motivation", mood: "cool", isFree: true },
  { content: "今天的自己比昨天优秀一点点，就够了 ✨", scene: "motivation", mood: "warm", isFree: true },
  { content: "万物皆有裂痕，那是光照进来的地方 🌸", scene: "daily", mood: "artsy", isFree: true },
  { content: "周末的正确打开方式：睡到自然醒，然后继续躺 ☀️", scene: "daily", mood: "funny", isFree: true },
  { content: "吃饱了才有力气减肥，这是科学 🍔", scene: "food", mood: "funny", isFree: true },
  { content: "行李收拾好了，灵魂也准备好了，出发！🧳", scene: "travel", mood: "short", isFree: true },
  { content: "聚是一团火，散是满天星 ✨", scene: "party", mood: "short", isFree: true },
  { content: "先把自己变成想要的样子，然后遇见无需取悦的人 💫", scene: "motivation", mood: "deep", isFree: false },
  { content: "路途虽远，行则将至 🌄", scene: "travel", mood: "short", isFree: true },
  { content: "咖啡续命中...老板在身后 ☠️", scene: "work", mood: "funny", isFree: true },
  { content: "幸福就是：白天有说有笑，晚上睡个好觉 🌛", scene: "daily", mood: "warm", isFree: true },
];

const templates = [
  {
    name: "简约白", isFree: true, category: "简约",
    configJson: JSON.stringify({
      bgColor: "#FFFFFF", fontFamily: "PingFang SC", fontSize: 24,
      textColor: "#1E293B", accentColor: "#4A90D9", layout: "centered",
      padding: 48, decorations: [], watermark: true,
    }),
  },
  {
    name: "清新绿", isFree: true, category: "清新",
    configJson: JSON.stringify({
      bgColor: "#F0FDF4", fontFamily: "PingFang SC", fontSize: 22,
      textColor: "#166534", accentColor: "#22C55E", layout: "centered",
      padding: 48, decorations: ["top_line"], watermark: true,
    }),
  },
  {
    name: "暖阳米", isFree: true, category: "温暖",
    configJson: JSON.stringify({
      bgColor: "#FFFBF0", fontFamily: "PingFang SC", fontSize: 24,
      textColor: "#78350F", accentColor: "#F59E0B", layout: "centered",
      padding: 48, decorations: [], watermark: true,
    }),
  },
  {
    name: "暗夜黑", isFree: false, category: "高级",
    configJson: JSON.stringify({
      bgColor: "#1E293B", fontFamily: "PingFang SC", fontSize: 24,
      textColor: "#F8FAFC", accentColor: "#94A3B8", layout: "centered",
      padding: 48, decorations: ["top_line"], watermark: false,
    }),
  },
  {
    name: "日系文艺", isFree: false, category: "文艺",
    configJson: JSON.stringify({
      bgColor: "#FFF8F0", fontFamily: "Noto Serif SC", fontSize: 22,
      textColor: "#4A3728", accentColor: "#D4A574", layout: "centered",
      padding: 48, decorations: ["top_line"], watermark: false,
    }),
  },
  {
    name: "天空蓝", isFree: false, category: "清新",
    configJson: JSON.stringify({
      bgColor: "#EBF4FD", fontFamily: "PingFang SC", fontSize: 22,
      textColor: "#1E40AF", accentColor: "#3B82F6", layout: "bottom-heavy",
      padding: 48, decorations: [], watermark: false,
    }),
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  await db.copywriting.deleteMany();
  await db.category.deleteMany();
  await db.mood.deleteMany();
  await db.cardTemplate.deleteMany();

  for (const scene of scenes) {
    await db.category.create({ data: scene });
  }

  for (const mood of moods) {
    await db.mood.create({ data: mood });
  }

  for (const tpl of templates) {
    await db.cardTemplate.create({ data: tpl });
  }

  const categoryMap = new Map(
    (await db.category.findMany()).map((c) => [c.slug, c.id])
  );
  const moodMap = new Map(
    (await db.mood.findMany()).map((m) => [m.slug, m.id])
  );

  for (const cw of sampleCopywritings) {
    await db.copywriting.create({
      data: {
        content: cw.content,
        categoryId: categoryMap.get(cw.scene)!,
        moodId: moodMap.get(cw.mood)!,
        wordCount: cw.content.length,
        isFree: cw.isFree,
        suggestImageStyle: cw.mood === "artsy" ? "日系清新胶片风" : "生活感氛围图",
      },
    });
  }

  await db.user.upsert({
    where: { openid: "mock_openid_dev_user" },
    create: { openid: "mock_openid_dev_user", nickname: "测试用户", isPaid: false },
    update: {},
  });

  await db.admin.upsert({
    where: { username: "admin" },
    create: { username: "admin", password: "admin123" },
    update: {},
  });

  console.log("✅ Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
