/**
 * Script สำหรับ assign ตารางไซส์ให้สินค้า
 * รูปภาพในโฟลเดอร์ public/size-charts/ จะถูก map กับสินค้าใน DB
 *
 * วิธีใช้: แก้ไข mapping ด้านล่าง แล้ว run script
 * Run: node -e "require('ts-node').register({compilerOptions:{module:'CommonJS'}}); require('./prisma/assign-size-charts.ts')"
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// ============================================================
// MAPPING: ชื่อสินค้า (บางส่วน) → ไฟล์รูปตารางไซส์
// แก้ไข mapping ด้านล่างตามต้องการ
// ชื่อรูปจาก public/size-charts/
// ============================================================
const sizeChartMapping: Record<string, string> = {
  // รองเท้า - ใส่ชื่อสินค้า (บางส่วน) และชื่อไฟล์
  // ตัวอย่าง:
  // 'รองเท้าคอมแบท รุ่น E1': '/size-charts/945090_0.jpg',
  // 'รองเท้าคอมแบท รุ่น 9H': '/size-charts/945091_0.jpg',

  // กางเกง
  // 'กางเกงยุทธวิธี รุ่น IX10': '/size-charts/945064_0.jpg',

  // เสื้อ
  // 'เสื้อโปโล': '/size-charts/945118_0.jpg',
};

// ============================================================
// หรือ assign ทั้ง category ด้วย default size chart
// ============================================================
const categoryDefaultSizeChart: Record<string, string> = {
  // 'shoes': '/size-charts/1.jpg',        // รองเท้า
  // 'pants': '/size-charts/945064_0.jpg', // กางเกง
  // 'shirts': '/size-charts/945118_0.jpg', // เสื้อ
};

async function main() {
  // แสดงรายการสินค้าทั้งหมดพร้อม category
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ categoryId: 'asc' }, { name: 'asc' }],
  });

  console.log('\n=== รายการสินค้าทั้งหมด ===');
  let currentCat = '';
  for (const p of products) {
    if (p.category.slug !== currentCat) {
      currentCat = p.category.slug;
      console.log(`\n[${p.category.name}] (slug: ${p.category.slug})`);
    }
    console.log(`  ID:${p.id} | ${p.name} | sizeChart: ${p.sizeChartUrl ?? '-'}`);
  }

  // แสดงรายการรูปที่มี
  const chartsDir = path.join(__dirname, '../public/size-charts');
  const files = fs.readdirSync(chartsDir).filter(f => /\.(jpg|png)$/i.test(f));
  console.log(`\n=== รูปตารางไซส์ที่มี (${files.length} ไฟล์) ===`);
  console.log(files.join(', '));

  if (Object.keys(sizeChartMapping).length === 0 && Object.keys(categoryDefaultSizeChart).length === 0) {
    console.log('\n⚠️  ยังไม่มี mapping - แก้ไข sizeChartMapping หรือ categoryDefaultSizeChart ในไฟล์นี้');
    console.log('จากนั้น run script อีกครั้ง');
    return;
  }

  // Apply mapping by product name
  let updated = 0;
  for (const [namePart, chartUrl] of Object.entries(sizeChartMapping)) {
    const matches = products.filter(p => p.name.includes(namePart));
    for (const p of matches) {
      await prisma.product.update({ where: { id: p.id }, data: { sizeChartUrl: chartUrl } });
      console.log(`✅ Updated: ${p.name} → ${chartUrl}`);
      updated++;
    }
  }

  // Apply category default (only for products without sizeChartUrl)
  for (const [slug, chartUrl] of Object.entries(categoryDefaultSizeChart)) {
    const catProducts = products.filter(p => p.category.slug === slug && !p.sizeChartUrl);
    for (const p of catProducts) {
      await prisma.product.update({ where: { id: p.id }, data: { sizeChartUrl: chartUrl } });
      console.log(`✅ Default for ${slug}: ${p.name} → ${chartUrl}`);
      updated++;
    }
  }

  console.log(`\nอัปเดตแล้ว ${updated} สินค้า`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
