import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, getCategoryBySlugFromDB } from "@/lib/products";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; productId: string }>;
}) {
  const { category, productId } = await params;
  const product = await getProductById(Number(productId));
  if (!product) notFound();

  const cat = await getCategoryBySlugFromDB(category);

  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-20">
      {/* Breadcrumb */}
      <div className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-2 text-sm text-white/40 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">หน้าแรก</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">สินค้าทั้งหมด</Link>
          <span>/</span>
          <Link href={`/products/${category}`} className="hover:text-white transition-colors">
            {cat?.name ?? category}
          </Link>
          <span>/</span>
          <span className="text-white/70 truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Product Detail */}
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Image */}
          <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center min-h-64">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-6xl">{cat?.icon ?? "📦"}</div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            {/* Discount Badge */}
            {product.discount && (
              <span className="self-start bg-red-600 text-white text-sm font-bold px-3 py-1 rounded">
                ลด {product.discount}%
              </span>
            )}

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div>
              {product.originalPrice && (
                <p className="text-white/30 text-sm line-through mb-1">
                  ราคาปกติ {product.originalPrice.toLocaleString()} ฿
                </p>
              )}
              <p className="text-[#d4a843] font-black text-4xl">
                {product.price.toLocaleString()} ฿
              </p>
            </div>

            {/* Specs */}
            {(product.material || product.sizes || product.colors) && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-2">
                {product.material && (
                  <div className="flex gap-2 text-sm">
                    <span className="text-white/40 w-16 shrink-0">วัสดุ</span>
                    <span className="text-white">{product.material}</span>
                  </div>
                )}
                {product.sizes && (
                  <div className="flex gap-2 text-sm">
                    <span className="text-white/40 w-16 shrink-0">ไซส์</span>
                    <span className="text-white">{product.sizes}</span>
                  </div>
                )}
                {product.colors && (
                  <div className="flex gap-2 text-sm">
                    <span className="text-white/40 w-16 shrink-0">สี</span>
                    <span className="text-white">{product.colors}</span>
                  </div>
                )}
              </div>
            )}

            {/* Order Buttons */}
            <div className="flex flex-col gap-3 mt-2">
              <a
                href="https://line.me/R/ti/p/@bg1inter"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#06c755] hover:opacity-90 text-white font-bold py-3 px-6 rounded-full transition-opacity text-lg"
              >
                💬 สั่งซื้อผ่าน Line @bg1inter
              </a>
              <a
                href="tel:096-923-3069"
                className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/50 text-white/70 hover:text-white font-medium py-3 px-6 rounded-full transition-all"
              >
                📞 โทร 096-923-3069
              </a>
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-10 border-t border-white/10 pt-8">
            <h2 className="text-white font-bold text-lg mb-4">รายละเอียดสินค้า</h2>
            <div className="text-white/60 leading-relaxed whitespace-pre-line text-sm">
              {product.description}
            </div>
          </div>
        )}

        {/* Features */}
        {product.features && (
          <div className="mt-6 border-t border-white/10 pt-6">
            <h2 className="text-white font-bold text-lg mb-4">จุดเด่น</h2>
            <div className="text-white/60 leading-relaxed whitespace-pre-line text-sm">
              {product.features}
            </div>
          </div>
        )}

        {/* Size Chart */}
        {product.sizeChartUrl && (
          <div className="mt-6 border-t border-white/10 pt-6">
            <h2 className="text-white font-bold text-lg mb-4">📏 ตารางไซส์</h2>
            <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
              <img
                src={product.sizeChartUrl}
                alt={`ตารางไซส์ ${product.name}`}
                className="w-full h-auto object-contain max-h-[600px]"
              />
            </div>
            <p className="text-white/30 text-xs mt-2 text-center">
              * ตารางไซส์อาจแตกต่างกันตามรุ่น กรุณาติดต่อแอดมินเพื่อยืนยัน
            </p>
          </div>
        )}

        {/* Back */}
        <div className="mt-10">
          <Link
            href={`/products/${category}`}
            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm"
          >
            ← กลับไปที่ {cat?.name ?? category}
          </Link>
        </div>
      </section>
    </main>
  );
}
