import { PrismaClient } from '@prisma/client';
import { categories } from '../lib/products';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        nameEn: cat.nameEn,
        icon: cat.icon,
        description: cat.description,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        nameEn: cat.nameEn,
        icon: cat.icon,
        description: cat.description,
      },
    });

    for (const product of cat.products) {
      await prisma.product.create({
        data: {
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice ?? null,
          discount: product.discount ?? null,
          categoryId: category.id,
        },
      });
    }

    console.log(`✓ ${cat.name} (${cat.products.length} products)`);
  }

  console.log('Done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
