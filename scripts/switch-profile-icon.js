// 切换「我的」图标性别
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '..', 'miniprogram', 'images');
const gender = process.argv[2];

if (!gender || !['male', 'female'].includes(gender)) {
  console.log('用法: node scripts/switch-profile-icon.js <male|female>');
  process.exit(1);
}

const suffix = ['', '-active'];
suffix.forEach(s => {
  const src = path.join(IMAGES_DIR, `tab-profile-${gender}${s}.png`);
  const dst = path.join(IMAGES_DIR, `tab-profile${s}.png`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    console.log(`✅ tab-profile-${gender}${s}.png → tab-profile${s}.png`);
  } else {
    console.error(`❌ 源文件不存在: ${src}`);
    console.log('请先运行 node scripts/generate-icons.js');
    process.exit(1);
  }
});

console.log(`\n✨ 已切换为${gender === 'male' ? '👦 男性' : '👧 女性'}图标`);
