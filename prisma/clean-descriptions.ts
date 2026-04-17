import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function cleanDescription(desc: string | null): string | null {
  if (!desc) return null;
  // ตัดส่วน contact info ที่ต่อท้ายทุกสินค้า
  const cutWords = ['สั่งซื้อ', 'ติดต่อ', 'Line:', 'line:', 'Call:', 'Facebook:', 'Inbox:', 'Youtube:', '@bg1inter', '096-923'];
  let lines = desc.split('\n');
  let cutIndex = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (cutWords.some(w => lines[i].includes(w))) {
      cutIndex = i;
      break;
    }
  }
  const cleaned = lines.slice(0, cutIndex).join('\n').trim();
  return cleaned || null;
}

async function main() {
  const products = await prisma.product.findMany({ where: { description: { not: null } } });
  console.log(`Cleaning ${products.length} product descriptions...`);
  let updated = 0;
  for (const p of products) {
    const clean = cleanDescription(p.description);
    if (clean !== p.description) {
      await prisma.product.update({ where: { id: p.id }, data: { description: clean } });
      updated++;
    }
  }
  console.log(`Updated ${updated} descriptions`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
