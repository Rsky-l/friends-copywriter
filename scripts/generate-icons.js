// 生成 Tab 图标的脚本
// 生成 81x81 的简单几何图标 PNG 文件
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const SIZE = 81;
const IMAGES_DIR = path.join(__dirname, '..', 'miniprogram', 'images');

// PNG 工具函数
function crc32(buf) {
  let crc = 0xFFFFFFFF;
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function createChunk(type, data) {
  const typeData = Buffer.concat([Buffer.from(type), data]);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(typeData));
  return Buffer.concat([len, typeData, crcBuf]);
}

function createPNG(pixels) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(SIZE, 0);   // width
  ihdr.writeUInt32BE(SIZE, 4);   // height
  ihdr[8] = 8;                    // bit depth
  ihdr[9] = 6;                    // color type: RGBA
  ihdr[10] = 0;                   // compression
  ihdr[11] = 0;                   // filter
  ihdr[12] = 0;                   // interlace

  // IDAT - 原始像素数据加 filter byte
  const raw = Buffer.alloc(SIZE * (1 + SIZE * 4));
  for (let y = 0; y < SIZE; y++) {
    const rowStart = y * (1 + SIZE * 4);
    raw[rowStart] = 0; // filter: none
    for (let x = 0; x < SIZE; x++) {
      const idx = rowStart + 1 + x * 4;
      const px = pixels(x, y);
      raw[idx] = px[0];     // R
      raw[idx + 1] = px[1]; // G
      raw[idx + 2] = px[2]; // B
      raw[idx + 3] = px[3]; // A
    }
  }

  const compressed = zlib.deflateSync(raw);
  const iend = Buffer.alloc(0);

  return Buffer.concat([
    signature,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', compressed),
    createChunk('IEND', iend)
  ]);
}

// 颜色定义
const ORANGE = [255, 122, 69, 255];   // #FF7A45
const ORANGE_LIGHT = [255, 180, 150, 180]; // 半透明橙（腮红）
const GRAY = [180, 180, 180, 255];     // 未选中灰色
const GRAY_LIGHT = [210, 200, 195, 150];  // 灰色腮红
const WHITE = [255, 255, 255, 255];
const TRANS = [0, 0, 0, 0];
const SKIN = [255, 245, 240, 255];     // 暖肤色
const EYE_DARK = [80, 55, 40, 255];    // 深棕眼睛

// 辅助：画圆
function circle(cx, cy, r, color) {
  return (x, y) => {
    const dx = x - cx, dy = y - cy;
    return (dx * dx + dy * dy <= r * r) ? color : null;
  };
}

// 辅助：画圆环
function ring(cx, cy, outerR, innerR, color) {
  return (x, y) => {
    const dx = x - cx, dy = y - cy;
    const d2 = dx * dx + dy * dy;
    return (d2 <= outerR * outerR && d2 >= innerR * innerR) ? color : null;
  };
}

// 辅助：画矩形
function rect(x1, y1, x2, y2, color) {
  return (x, y) => (x >= x1 && x <= x2 && y >= y1 && y <= y2) ? color : null;
}

// 辅助：画圆角矩形
function roundRect(x1, y1, x2, y2, r, color) {
  return (x, y) => {
    if (x < x1 || x > x2 || y < y1 || y > y2) return null;
    // 四个角
    if (x < x1 + r && y < y1 + r) {
      const dx = x - (x1 + r), dy = y - (y1 + r);
      return (dx * dx + dy * dy <= r * r) ? color : null;
    }
    if (x > x2 - r && y < y1 + r) {
      const dx = x - (x2 - r), dy = y - (y1 + r);
      return (dx * dx + dy * dy <= r * r) ? color : null;
    }
    if (x < x1 + r && y > y2 - r) {
      const dx = x - (x1 + r), dy = y - (y2 - r);
      return (dx * dx + dy * dy <= r * r) ? color : null;
    }
    if (x > x2 - r && y > y2 - r) {
      const dx = x - (x2 - r), dy = y - (y2 - r);
      return (dx * dx + dy * dy <= r * r) ? color : null;
    }
    return color;
  };
}

// 辅助：画椭圆
function ellipse(cx, cy, rx, ry, color) {
  return (x, y) => {
    if (rx === 0 || ry === 0) return null;
    const dx = (x - cx) / rx, dy = (y - cy) / ry;
    return (dx * dx + dy * dy <= 1) ? color : null;
  };
}

// 辅助：画半圆（下半部分=微笑）
function smileArc(cx, cy, rx, ry, color) {
  return (x, y) => {
    if (y < cy) return null;
    const dx = (x - cx) / rx, dy = (y - cy) / ry;
    return (dx * dx + dy * dy <= 1) ? color : null;
  };
}

// 组合多个形状
function compose(...shapes) {
  return (x, y) => {
    for (const s of shapes) {
      const c = s(x, y);
      if (c !== null && c !== undefined) return c;
    }
    return TRANS;
  };
}

// ===== 场景广场图标：4个方块组成的网格 =====
function sceneIcon(color) {
  const s = 12;  // 方块大小
  const gap = 6; // 间距
  const ox = (SIZE - s * 2 - gap) / 2;
  const oy = (SIZE - s * 2 - gap) / 2;
  return compose(
    rect(ox, oy, ox + s, oy + s, color),
    rect(ox + s + gap, oy, ox + s * 2 + gap, oy + s, color),
    rect(ox, oy + s + gap, ox + s, oy + s * 2 + gap, color),
    rect(ox + s + gap, oy + s + gap, ox + s * 2 + gap, oy + s * 2 + gap, color),
  );
}

// ===== 训练场图标：靶心/准星 =====
function trainingIcon(color) {
  const cx = 40, cy = 40;
  return compose(
    circle(cx, cy, 22, TRANS),  // 确保背景透明
    circle(cx, cy, 20, color),
    circle(cx, cy, 12, WHITE),
    circle(cx, cy, 6, color),
    rect(cx - 2, 8, cx + 2, cy - 22, color),   // 上十字
    rect(cx - 2, cy + 22, cx + 2, 72, color),   // 下十字
    rect(8, cy - 2, cx - 22, cy + 2, color),    // 左十字
    rect(cx + 22, cy - 2, 72, cy + 2, color),   // 右十字
  );
}

// ===== 我的图标 - 女性（丸子头可爱风） =====
function femaleIcon(mainColor) {
  const blush = mainColor === ORANGE ? ORANGE_LIGHT : GRAY_LIGHT;
  const cx = 40, cy = 24;
  const headR = 11;

  return compose(
    // 头发（背后层，比脸宽，打造 bob 短发效果）
    ellipse(cx, cy + 1, headR + 5, headR + 4, mainColor),
    // 右边小丸子
    circle(cx + 8, cy - headR + 1, 5, mainColor),
    // 身体（圆角，上窄下宽）
    roundRect(cx - 11, cy + headR + 2, cx - 4, cy + 50, 5, mainColor),
    roundRect(cx + 4, cy + headR + 2, cx + 11, cy + 50, 5, mainColor),
    // 身体连接
    rect(cx - 4, cy + headR + 2, cx + 4, cy + 50, mainColor),
    // 脸
    circle(cx, cy, headR, SKIN),
    // 腮红
    circle(cx - 6, cy + 3, 3, blush),
    circle(cx + 6, cy + 3, 3, blush),
    // 眼睛（大圆眼可爱风）
    circle(cx - 4, cy - 1, 2.5, EYE_DARK),
    circle(cx + 4, cy - 1, 2.5, EYE_DARK),
    // 眼睛高光
    circle(cx - 3, cy - 2, 1, WHITE),
    circle(cx + 5, cy - 2, 1, WHITE),
    // 微笑
    smileArc(cx, cy + 3, 3.5, 2.5, [255, 140, 120, 220]),
  );
}

// ===== 我的图标 - 男性（阳光短发风） =====
function maleIcon(mainColor) {
  const blush = mainColor === ORANGE ? ORANGE_LIGHT : GRAY_LIGHT;
  const cx = 40, cy = 24;
  const headR = 11;

  return compose(
    // 头发（短寸，紧贴头部上方）
    ellipse(cx, cy - 2, headR + 3, headR + 1, mainColor),
    // 两侧鬓角
    rect(cx - headR - 3, cy - 4, cx - headR + 2, cy + 5, mainColor),
    rect(cx + headR - 2, cy - 4, cx + headR + 3, cy + 5, mainColor),
    // 身体（稍宽，更有力量感）
    roundRect(cx - 14, cy + headR + 3, cx - 6, cy + 50, 5, mainColor),
    roundRect(cx + 6, cy + headR + 3, cx + 14, cy + 50, 5, mainColor),
    rect(cx - 6, cy + headR + 3, cx + 6, cy + 50, mainColor),
    // 脸
    circle(cx, cy, headR, SKIN),
    // 腮红（比女性淡一点）
    circle(cx - 6, cy + 4, 2, blush),
    circle(cx + 6, cy + 4, 2, blush),
    // 眼睛
    circle(cx - 4, cy - 1, 2, EYE_DARK),
    circle(cx + 4, cy - 1, 2, EYE_DARK),
    // 眼睛高光
    circle(cx - 3, cy - 2, 0.8, WHITE),
    circle(cx + 5, cy - 2, 0.8, WHITE),
    // 微笑（更含蓄）
    smileArc(cx, cy + 3, 3, 2, [255, 140, 120, 200]),
  );
}

// 生成图标（通用）
function generateIcon(basename, active, iconFn) {
  const color = active ? ORANGE : GRAY;
  const suffix = active ? '-active' : '';
  const filename = `${basename}${suffix}.png`;
  const filepath = path.join(IMAGES_DIR, filename);
  const png = createPNG(iconFn(color));
  fs.writeFileSync(filepath, png);
  console.log(`✅ 生成: ${filename} (${png.length} bytes)`);
  return filename;
}

// 生成全部图标
console.log('🎨 正在生成 Tab 图标...\n');

// 场景广场 & 训练场
['tab-scene', 'tab-training'].forEach(name => {
  const fn = name === 'tab-scene' ? sceneIcon : trainingIcon;
  generateIcon(name, false, fn);
  generateIcon(name, true, fn);
});

// 我的 - 女性
console.log('\n👧 女性款:');
generateIcon('tab-profile-female', false, femaleIcon);
generateIcon('tab-profile-female', true, femaleIcon);

// 我的 - 男性
console.log('\n👦 男性款:');
generateIcon('tab-profile-male', false, maleIcon);
generateIcon('tab-profile-male', true, maleIcon);

// 默认设为女性款（可手动替换）
const copySuffix = (s) => {
  const src = path.join(IMAGES_DIR, `tab-profile-female${s}.png`);
  const dst = path.join(IMAGES_DIR, `tab-profile${s}.png`);
  fs.copyFileSync(src, dst);
  console.log(`📋 复制 tab-profile-female${s}.png → tab-profile${s}.png`);
};
copySuffix('');
copySuffix('-active');

console.log('\n✨ 图标生成完成！');
console.log('💡 想要切换男性图标？运行 node scripts/switch-profile-icon.js male');
