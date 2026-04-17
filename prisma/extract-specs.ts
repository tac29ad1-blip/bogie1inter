/**
 * Script สกัด material, sizes, colors จาก description แล้วใส่ใน field ที่ถูกต้อง
 * Run: node -e "require('ts-node').register({compilerOptions:{module:'CommonJS'}}); require('./prisma/extract-specs.ts')"
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function extractSpecs(desc: string): { material?: string; sizes?: string; colors?: string } {
  const result: { material?: string; sizes?: string; colors?: string } = {};

  // ---- MATERIAL ----
  const materialPatterns = [
    /วัสดุ\s*[:：]?\s*([^\n,，.。]+)/i,
    /ผลิตจาก([^\n,，.。]{3,40})/i,
    /เนื้อผ้า\s*[:：]?\s*([^\n,，.。]+)/i,
    /วัสดุหลัก\s*[:：]?\s*([^\n,，.。]+)/i,
  ];
  const materialKeywords = [
    'โพลิเมอร์', 'คอร์ดูร่า', 'cordura', 'nylon', 'ไนลอน', '1000D', '500D', '600D',
    'ripstop', 'ริปสต็อป', 'หนังวัว', 'หนังแท้', 'canvas', 'แคนวาส',
    'สแตนเลส', 'อะลูมิเนียม', 'โลหะ', 'เหล็ก', 'ยางพารา', 'EVA', 'PU',
    'ผ้าโพลีเอสเตอร์', 'โพลีเอสเตอร์', 'polyester', 'ผ้าทอ', 'ผ้าถัก',
    'Teflon', 'เทฟลอน', 'Gore-TEX', 'Gore-Tex', 'G-TEX', 'G-tex',
  ];

  for (const pat of materialPatterns) {
    const m = desc.match(pat);
    if (m) {
      result.material = m[1].trim().replace(/\s+/g, ' ').substring(0, 100);
      break;
    }
  }
  if (!result.material) {
    for (const kw of materialKeywords) {
      const re = new RegExp(`([^\\n]{0,20}${kw}[^\\n]{0,30})`, 'i');
      const m = desc.match(re);
      if (m) {
        result.material = m[1].trim().replace(/\s+/g, ' ').substring(0, 100);
        break;
      }
    }
  }

  // ---- SIZES ----
  const sizePatterns = [
    /ไซส์\s*[:：]?\s*([^\n]+)/i,
    /ขนาด\s*[:：]?\s*([^\n]+)/i,
    /size\s*[:：]?\s*([^\n]+)/i,
    /เบอร์\s*[:：]?\s*([^\n]+)/i,
    /มีให้เลือก\s*[:：]?\s*([^\n]+)/i,
  ];
  const sizeRegex = /\b(XS|S|M|L|XL|2XL|3XL|XXL|XXXL|เบอร์\s*\d+|เบอร์ \d+[-–]\d+|\d{2,3}\s*[-–]\s*\d{2,3}|\d{2,3}cm|\d{2,3} ?cm)\b/gi;

  for (const pat of sizePatterns) {
    const m = desc.match(pat);
    if (m) {
      result.sizes = m[1].trim().replace(/\s+/g, ' ').substring(0, 200);
      break;
    }
  }
  if (!result.sizes) {
    const allSizes = [...desc.matchAll(sizeRegex)].map(m => m[0].trim());
    const unique = [...new Set(allSizes)];
    if (unique.length > 0) {
      result.sizes = unique.join(', ').substring(0, 200);
    }
  }

  // ---- COLORS ----
  const colorPatterns = [
    /สี\s*[:：]\s*([^\n]+)/i,
    /สีที่มี\s*[:：]?\s*([^\n]+)/i,
    /มีสี\s*[:：]?\s*([^\n]+)/i,
    /color\s*[:：]?\s*([^\n]+)/i,
  ];
  const colorKeywords = [
    'ดำ', 'ด่าง', 'เขียว', 'ทราย', 'มัลติแคม', 'multicam', 'coyote', 'โคโยตี้',
    'ดิจิตัล', 'digital', 'ranger green', 'เรนเจอร์กรีน', 'wolf grey', 'โอดี',
    'OD', 'FG', 'CB', 'TAN', 'tan', 'khaki', 'กากี', 'navy', 'กรมท่า',
    'ฟ้า', 'น้ำเงิน', 'แดง', 'เทา', 'ขาว', 'ครีม',
  ];

  for (const pat of colorPatterns) {
    const m = desc.match(pat);
    if (m) {
      const val = m[1].trim().replace(/\s+/g, ' ');
      // ตัดถ้ายาวเกินไป (น่าจะเป็น description ทั่วไป ไม่ใช่สี)
      if (val.length <= 100) {
        result.colors = val.substring(0, 100);
        break;
      }
    }
  }
  if (!result.colors) {
    const foundColors: string[] = [];
    for (const kw of colorKeywords) {
      if (desc.toLowerCase().includes(kw.toLowerCase())) {
        foundColors.push(kw);
      }
    }
    if (foundColors.length > 0) {
      result.colors = foundColors.slice(0, 6).join(', ').substring(0, 100);
    }
  }

  return result;
}

async function main() {
  const products = await prisma.product.findMany({
    where: { description: { not: null } },
    select: { id: true, name: true, description: true, material: true, sizes: true, colors: true },
  });

  console.log(`Processing ${products.length} products...`);
  let updated = 0;

  for (const p of products) {
    if (!p.description) continue;
    const extracted = extractSpecs(p.description);

    const updateData: Record<string, string | null> = {};
    if (extracted.material && !p.material) updateData.material = extracted.material;
    if (extracted.sizes && !p.sizes) updateData.sizes = extracted.sizes;
    if (extracted.colors && !p.colors) updateData.colors = extracted.colors;

    if (Object.keys(updateData).length > 0) {
      await prisma.product.update({ where: { id: p.id }, data: updateData });
      console.log(`✅ [${p.id}] ${p.name.substring(0, 40)}`);
      if (updateData.material) console.log(`   material: ${updateData.material}`);
      if (updateData.sizes)    console.log(`   sizes:    ${updateData.sizes}`);
      if (updateData.colors)   console.log(`   colors:   ${updateData.colors}`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} products`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
