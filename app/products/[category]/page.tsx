import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategoryBySlug } from "@/lib/products";

export function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};
  return {
    title: `${cat.name} | Bogie1 Inter`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-20">
      {/* Breadcrumb */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-sm text-white/40">
          <Link href="/" className="hover:text-white transition-colors">หน้าแรก</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">สินค้าทั้งหมด</Link>
          <span>/</span>
          <span className="text-white">{cat.name}</span>
        </div>
      </div>

      {/* Header */}
      <section className="border-b border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 flex items-start gap-6">
          <span className="text-5xl">{cat.icon}</span>
          <div>
            <p className="text-[#4a7c59] text-xs tracking-[0.3em] uppercase mb-1">{cat.nameEn}</p>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{cat.name}</h1>
            <p className="text-white/50">{cat.description}</p>
            <p className="text-white/30 text-sm mt-2">{cat.products.length} รายการ</p>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cat.products.map((product, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-lg p-5 hover:border-[#4a7c59]/50 transition-all duration-200 flex flex-col"
            >
              {/* Discount Badge */}
              {product.discount && (
                <div className="self-start mb-3">
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </span>
                </div>
              )}

              {/* Product Name */}
              <h3 className="text-white font-semibold text-sm leading-snug mb-4 flex-1">
                {product.name}
              </h3>

              {/* Price */}
              <div className="mt-auto">
                {product.originalPrice && (
                  <p className="text-white/30 text-xs line-through mb-1">
                    {product.originalPrice.toLocaleString()} ฿
                  </p>
                )}
                <p className="text-[#d4a843] font-black text-xl">
                  {product.price.toLocaleString()} ฿
                </p>
              </div>

              {/* Order via Line */}
              <a
                href="https://line.me/R/ti/p/@bg1inter"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block text-center bg-[#06c755] hover:opacity-90 text-white text-xs font-bold py-2 px-4 rounded-full transition-opacity"
              >
                สั่งซื้อผ่าน Line
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Other Categories */}
      <section className="border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-white/50 text-sm uppercase tracking-wider mb-6">หมวดหมู่อื่น</h2>
          <div className="flex flex-wrap gap-3">
            {categories
              .filter((c) => c.slug !== cat.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/products/${c.slug}`}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/60 hover:text-white hover:border-[#4a7c59] text-sm transition-all"
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </main>
  );
}
