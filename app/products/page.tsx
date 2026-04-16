import Link from "next/link";
import { categories } from "@/lib/products";

export const metadata = {
  title: "สินค้าทั้งหมด | Bogie1 Inter",
  description: "อุปกรณ์ยุทธวิธีคุณภาพสูง รองเท้าคอมแบท เสื้อเกราะ กางเกง เข็มขัด ซองปืน กระเป๋า และอื่นๆ",
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-20">
      {/* Header */}
      <section className="border-b border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[#4a7c59] text-sm tracking-[0.3em] uppercase mb-2">Thai Tactical Brand</p>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            สินค้าทั้งหมด
          </h1>
          <p className="text-white/50 text-lg">
            อุปกรณ์ยุทธวิธีคุณภาพสูง สัญชาติไทย — {categories.reduce((s, c) => s + c.products.length, 0)}+ รายการ
          </p>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products/${cat.slug}`}
              className="group relative bg-white/5 border border-white/10 rounded-lg p-6 hover:border-[#4a7c59] hover:bg-white/8 transition-all duration-200"
            >
              {/* Icon */}
              <div className="text-4xl mb-4">{cat.icon}</div>

              {/* Name */}
              <h2 className="text-white font-bold text-lg leading-tight mb-1 group-hover:text-[#d4a843] transition-colors">
                {cat.name}
              </h2>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-3">{cat.nameEn}</p>

              {/* Count */}
              <div className="flex items-center justify-between">
                <span className="text-[#4a7c59] text-sm font-medium">
                  {cat.products.length} รายการ
                </span>
                <span className="text-white/30 group-hover:text-[#4a7c59] transition-colors text-lg">→</span>
              </div>

              {/* Description on hover */}
              <p className="text-white/40 text-xs mt-3 leading-relaxed hidden md:block">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-white/50 mb-4">สอบถามสินค้า สั่งซื้อ และรายละเอียดเพิ่มเติม</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://line.me/R/ti/p/@bg1inter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#06c755] text-white font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              💬 Line: @bg1inter
            </a>
            <a
              href="https://shopee.co.th/bogie1inter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#d4a843] text-black font-bold px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              🛒 ซื้อบน Shopee
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
