import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Map LINE category name to our slug + icon
const categoryMap: Record<string, { slug: string; name: string; nameEn: string; icon: string; description: string }> = {
  'รองเท้า': { slug: 'shoes', name: 'รองเท้าคอมแบท', nameEn: 'Combat Boots', icon: '👟', description: 'รองเท้าหนังวัวแท้ 100% พื้นยางพาราอย่างดี ทนทาน ใส่สบาย' },
  'เสื้อเกราะ': { slug: 'armor', name: 'เสื้อเกราะ', nameEn: 'Tactical Vest / Body Armor', icon: '🦺', description: 'เสื้อเกราะยุทธวิธี ระบบปลดเร็ว MOLLE compatible หลายรุ่นให้เลือก' },
  'กางเกง': { slug: 'pants', name: 'กางเกงยุทธวิธี', nameEn: 'Tactical Pants', icon: '👖', description: 'กางเกงยุทธวิธี ทนทาน กระเป๋าหลายช่อง เหมาะทุกภารกิจ' },
  'เข็มขัด': { slug: 'belts', name: 'เข็มขัดยุทธวิธี', nameEn: 'Tactical Belts', icon: '🔗', description: 'เข็มขัดยุทธวิธีหลายรุ่น ระบบ Cobra ทนทาน ใช้งานได้จริง' },
  'ซองปืน': { slug: 'holsters', name: 'ซองปืน-ซองแม็ก', nameEn: 'Holsters & Mag Pouches', icon: '🔫', description: 'ซองปืนโพลิเมอร์ ซองแม็ก เพลทเหน็บ รองรับปืนหลายรุ่น' },
  'กระเป๋าซ่อนปืน': { slug: 'conceal-bags', name: 'กระเป๋าซ่อนปืน', nameEn: 'Concealed Carry Bags', icon: '👜', description: 'กระเป๋าซ่อนปืนหลายทรง คาดเอว สะพายข้าง ร้อยเข็มขัด' },
  'กระเป๋าสะพาย': { slug: 'backpacks', name: 'เป้-กระเป๋าสะพาย', nameEn: 'Backpacks & Bags', icon: '🎒', description: 'เป้ยุทธวิธี กระเป๋าสะพาย MOLLE compatible วัสดุ Cordura อย่างดี' },
  'เสื้อยืด': { slug: 'shirts', name: 'เสื้อยืด-โปโล', nameEn: 'T-Shirts & Polo', icon: '👕', description: 'เสื้อยืด เสื้อโปโล Combat Shirt ผ้าระบายอากาศ เหมาะชุดฝึก' },
  'เสื้อกั๊ก': { slug: 'vests', name: 'เสื้อกั๊ก-ชุดเวส', nameEn: 'Vests & Duty Wear', icon: '🦺', description: 'เสื้อกั๊กตำรวจ สะท้อนแสง ชุดเวสฝึก ชุด คฝ. หลายแบบ' },
  'อุปกรณ์ติดเกราะ': { slug: 'armor-accessories', name: 'อุปกรณ์ติดเสื้อเกราะ', nameEn: 'Armor Accessories', icon: '⚙️', description: 'ซองแมก กระเป๋าเอนกประสงค์ เพลท ซองวิทยุ สำหรับติดเสื้อเกราะ' },
  'แจ็กเก็ต': { slug: 'jackets', name: 'แจ็กเก็ต', nameEn: 'Jackets', icon: '🧥', description: 'แจ็กเก็ตยุทธวิธี กันลม สะท้อนแสง FBI Flight Jacket' },
  'Other': { slug: 'accessories', name: 'สินค้าอื่นๆ', nameEn: 'Accessories & Equipment', icon: '🔦', description: 'ซองไฟฉาย หมวก FAST ดิ้ว ไฟฉาย ซองวิทยุ และอุปกรณ์เสริมอื่นๆ' },
};

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function matchCategoryByName(productName: string): typeof categoryMap[string] {
  const name = productName.toLowerCase();
  if (name.includes('รองเท้า')) return categoryMap['รองเท้า'];
  if (name.includes('เสื้อเกราะ') || name.includes('เป้เกราะ') || name.includes('แผ่นเปลี่ยนข้าง')) return categoryMap['เสื้อเกราะ'];
  if (name.includes('กางเกง') || name.includes('ชุดวอร์ม')) return categoryMap['กางเกง'];
  if (name.includes('เข็มขัด') || name.includes('สายเก่ง') || name.includes('สายโยง')) return categoryMap['เข็มขัด'];
  if (name.includes('ซองปืน') || name.includes('ซองแมก') || name.includes('ซองแม็ก') || name.includes('เพลทเหน็บ')) return categoryMap['ซองปืน'];
  if (name.includes('กระเป๋าซ่อนปืน') || name.includes('กระเป๋าพกใน') || name.includes('กระเป๋าคาดเอว') || name.includes('กระเป๋าร้อยเข็มขัด')) return categoryMap['กระเป๋าซ่อนปืน'];
  if (name.includes('เป้') || name.includes('กระเป๋าสะพาย') || name.includes('กระเป๋าปืนทรง') || name.includes('banger') || name.includes('rigger') || name.includes('slide bag') || name.includes('smc') || name.includes('gepäck') || name.includes('ถุงทะเล')) return categoryMap['กระเป๋าสะพาย'];
  if (name.includes('เสื้อโปโล') || name.includes('เสื้อยืด') || name.includes('เสื้อนาโน') || name.includes('เสื้อคอมแบทเชิ้ต') || name.includes('เสื้อเชิ้ต') || name.includes('เสื้อคอกลม') || name.includes('เสื้อคอแหลม') || name.includes('เสื้อคอเต่า')) return categoryMap['เสื้อยืด'];
  if (name.includes('เสื้อกั๊ก') || name.includes('ชุดเวส') || name.includes('ชุดฝึก') || name.includes('ชุด คฝ') || name.includes('ชุดคฝ')) return categoryMap['เสื้อกั๊ก'];
  if (name.includes('แจ็กเก็ต') || name.includes('แจ็คเก็ต') || name.includes('flight jacket')) return categoryMap['แจ็กเก็ต'];
  if (name.includes('ซองวิทยุ') || name.includes('ซองกุญแจมือ') || name.includes('ซองไฟฉาย') || name.includes('ดิ้ว') || name.includes('หมวก') || name.includes('ไฟฉาย') || name.includes('ซองโทรศัพท์')) return categoryMap['Other'];
  if (name.includes('กระเป๋าเอนก') || name.includes('กระเป๋ายา') || name.includes('กระเป๋าพยาบาล') || name.includes('กระเป๋าน้ำ') || name.includes('เป้น้ำ') || name.includes('กระเป๋าลูกระเบิด') || name.includes('เพลทเอนก') || name.includes('ซองวิทยุติดเกราะ') || name.includes('ซองปืนติดเกราะ') || name.includes('ติดเสื้อเกราะ') || name.includes('ติดเกราะ')) return categoryMap['อุปกรณ์ติดเกราะ'];
  return categoryMap['Other'];
}

async function main() {
  const jsonPath = path.join(__dirname, 'line-products.json');
  const raw = fs.readFileSync(jsonPath, 'utf8').replace(/^\uFEFF/, '');
  const products = JSON.parse(raw);

  console.log(`Found ${products.length} products from LINE MyShop`);

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const categoryCache: Record<string, number> = {};
  for (const catData of Object.values(categoryMap)) {
    const cat = await prisma.category.create({ data: catData });
    categoryCache[catData.slug] = cat.id;
    console.log(`Created category: ${catData.name}`);
  }

  // Import products
  let imported = 0;
  for (const p of products) {
    const catInfo = matchCategoryByName(p.name || '');
    const categoryId = categoryCache[catInfo.slug];

    const variant = p.variants?.[0];
    const price = variant?.price ?? 0;
    const originalPrice = variant?.discountedPrice ? price : null;
    const finalPrice = variant?.discountedPrice ?? price;

    const description = p.description ? stripHtml(p.description) : null;
    const imageUrl = p.imageUrls?.[0] ?? variant?.imageUrl ?? null;

    await prisma.product.create({
      data: {
        name: p.name,
        price: finalPrice,
        originalPrice: originalPrice,
        discount: originalPrice ? Math.round((1 - finalPrice / originalPrice) * 100) : null,
        description: description,
        imageUrl: imageUrl,
        categoryId: categoryId,
      },
    });
    imported++;
  }

  console.log(`\nImported ${imported} products successfully!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
