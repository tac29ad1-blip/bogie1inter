import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlugFromDB } from "@/lib/products";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = await getCategoryBySlugFromDB(category);
  if (!cat) return {};
  return {
    title: `${cat.name} | Bogie1 Inter`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const [cat, allCategories] = await Promise.all([
    getCategoryBySlugFromDB(category),
    getCategories(),
  ]);
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
            <Link
              key={i}
              href={`/products/${cat.slug}/${product.id}`}
              className="bg-white/5 border border-white/10 rounded-lg p-5 hover:border-[#4a7c59]/50 transition-all duration-200 flex flex-col cursor-pointer"
            >
              {/* Image */}
              {product.imageUrl && (
                <div className="mb-3 rounded-lg overflow-hidden bg-white/5 h-40 flex items-center justify-center">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Discount Badge */}
              {product.discount && (
                <div className="self-start mb-2">
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discount}%
                  </span>
                </div>
              )}

              {/* Product Name */}
              <h3 className="text-white font-semibold text-sm leading-snug mb-2">
                {product.name}
              </h3>

              {/* Description */}
              {product.description && (
                <p className="text-white/40 text-xs leading-relaxed mb-3 line-clamp-3 flex-1">
                  {product.description.split('\n')[0]}
                </p>
              )}

              {/* Details */}
              <div className="flex flex-wrap gap-1 mb-3">
                {product.sizes && <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded">📏 {product.sizes}</span>}
                {product.colors && <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded">🎨 {product.colors}</span>}
                {product.material && <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded">🧵 {product.material}</span>}
              </div>

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

              <div className="mt-4 text-center text-[#4a7c59] text-xs font-medium">
                คลิกดูรายละเอียด →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Other Categories */}
      <section className="border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-white/50 text-sm uppercase tracking-wider mb-6">หมวดหมู่อื่น</h2>
          <div className="flex flex-wrap gap-3">
            {allCategories
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
