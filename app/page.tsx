const productCategories = [
  {
    icon: "👢",
    name: "รองเท้าคอมแบท",
    nameEn: "Combat Boots",
    description:
      "รองเท้าคอมแบทและรองเท้ายุทธวิธีคุณภาพสูง ทนทาน กันน้ำ รองรับการใช้งานหนักในทุกสภาพภูมิประเทศ",
  },
  {
    icon: "👕",
    name: "เสื้อผ้ายุทธวิธี",
    nameEn: "Combat Shirts",
    description:
      "เสื้อคอมแบทและเสื้อยุทธวิธีระบายอากาศดี เนื้อผ้าคุณภาพสูง ออกแบบเพื่อการเคลื่อนไหวที่คล่องตัว",
  },
  {
    icon: "👖",
    name: "กางเกงยุทธวิธี",
    nameEn: "Tactical Pants",
    description:
      "กางเกงยุทธวิธีหลากหลายรูปแบบ มีกระเป๋าเชิงยุทธ์ ผ้าทนทาน ยืดหยุ่น เหมาะสำหรับทุกภารกิจ",
  },
  {
    icon: "🔧",
    name: "เข็มขัดและอุปกรณ์",
    nameEn: "Belts & Holsters",
    description:
      "เข็มขัดยุทธวิธี โฮลสเตอร์ และอุปกรณ์พกพาอาวุธ ผลิตจากวัสดุคุณภาพสูง แข็งแรง ปลอดภัย",
  },
  {
    icon: "🎒",
    name: "กระเป๋ายุทธวิธี",
    nameEn: "Tactical Bags",
    description:
      "กระเป๋าเป้ยุทธวิธี กระเป๋าแมสเซนเจอร์ และกระเป๋าพกพาอุปกรณ์ ออกแบบเพื่อการใช้งานจริงในสนาม",
  },
  {
    icon: "⚙️",
    name: "อุปกรณ์เสริม",
    nameEn: "Accessories",
    description:
      "อุปกรณ์เสริมยุทธวิธีครบครัน ไม่ว่าจะเป็นถุงมือ หมวก สายรัด แพตช์ และอื่นๆ อีกมากมาย",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a] tactical-grid scanlines"
      >
        {/* Background accent shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#4a7c59] opacity-[0.04] blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#d4a843] opacity-[0.03] blur-3xl" />
        </div>

        {/* Corner tactical accents */}
        <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-[#4a7c59] opacity-60" />
        <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-[#4a7c59] opacity-60" />
        <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-[#4a7c59] opacity-60" />
        <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-[#4a7c59] opacity-60" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Pre-title badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 border border-[#4a7c59] rounded text-xs font-bold tracking-widest uppercase text-[#4a7c59]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a7c59] animate-pulse" />
            THAI TACTICAL BRAND
          </div>

          {/* Main heading */}
          <h1 className="font-black tracking-tight leading-none mb-6">
            <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#ededed] tracking-widest">
              BOGIE.1
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl text-[#4a7c59] tracking-[0.4em] mt-2">
              INTER
            </span>
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 my-6">
            <div className="h-px w-16 bg-[#d4a843] opacity-60" />
            <div className="w-1.5 h-1.5 rotate-45 bg-[#d4a843] opacity-60" />
            <div className="h-px w-16 bg-[#d4a843] opacity-60" />
          </div>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl md:text-3xl font-light text-[#ededed] mb-3 tracking-wide">
            อุปกรณ์ยุทธวิธีคุณภาพสูง
          </p>
          <p className="text-base sm:text-lg text-[#d4a843] font-semibold tracking-widest uppercase mb-10">
            สัญชาติไทย · MADE IN THAILAND
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://shopee.co.th/bogie1inter"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded text-base font-bold text-[#0a0a0a] bg-[#d4a843] hover:bg-[#e8c060] transition-all duration-200 tracking-wide shadow-lg hover:shadow-[#d4a843]/20 hover:shadow-xl"
            >
              <span>🛒</span>
              ซื้อบน Shopee
            </a>
            <a
              href="https://line.me/ti/p/~@bogie1"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded text-base font-bold text-[#ededed] bg-transparent border border-[#4a7c59] hover:bg-[#4a7c59] transition-all duration-200 tracking-wide"
            >
              <span>💬</span>
              Line: @bogie1
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 flex flex-col items-center gap-2 text-[#888888]">
            <span className="text-xs tracking-widest uppercase">เลื่อนลง</span>
            <div className="w-px h-10 bg-gradient-to-b from-[#4a7c59] to-transparent" />
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS SECTION ===== */}
      <section id="products" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase text-[#4a7c59] mb-3">
              PRODUCT CATEGORIES
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#ededed] tracking-tight">
              หมวดหมู่สินค้า
            </h2>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="h-px w-12 bg-[#2e2e2e]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#4a7c59]" />
              <div className="h-px w-12 bg-[#2e2e2e]" />
            </div>
          </div>

          {/* Product cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productCategories.map((product) => (
              <div
                key={product.name}
                className="group relative bg-[#141414] border border-[#2e2e2e] rounded-lg p-6 hover:border-[#4a7c59] transition-all duration-300 hover:shadow-lg hover:shadow-[#4a7c59]/10 cursor-pointer"
              >
                {/* Top accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#4a7c59] rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Icon */}
                <div className="text-4xl mb-4">{product.icon}</div>

                {/* Name */}
                <h3 className="text-lg font-bold text-[#ededed] mb-1 group-hover:text-[#4a7c59] transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs font-semibold tracking-widest uppercase text-[#888888] mb-3">
                  {product.nameEn}
                </p>

                {/* Description */}
                <p className="text-sm text-[#888888] leading-relaxed">
                  {product.description}
                </p>

                {/* Arrow */}
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#4a7c59] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>ดูสินค้า</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA to Shopee */}
          <div className="mt-12 text-center">
            <a
              href="https://shopee.co.th/bogie1inter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded text-sm font-bold text-[#0a0a0a] bg-[#d4a843] hover:bg-[#e8c060] transition-all duration-200 tracking-wide"
            >
              <span>🛒</span>
              ดูสินค้าทั้งหมดบน Shopee
            </a>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="py-24 bg-[#0d0d0d] border-y border-[#2e2e2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text content */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-[#4a7c59] mb-3">
                ABOUT US
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#ededed] tracking-tight mb-6">
                เกี่ยวกับเรา
              </h2>
              <p className="text-[#888888] leading-relaxed mb-6">
                <span className="text-[#ededed] font-semibold">Bogie1 Inter</span>{" "}
                คือแบรนด์อุปกรณ์ยุทธวิธีสัญชาติไทยที่มุ่งมั่นในการผลิตและจำหน่ายสินค้าคุณภาพสูง
                สำหรับทหาร ตำรวจ เจ้าหน้าที่รักษาความปลอดภัย นักกีฬายิงปืน
                และผู้รักในไลฟ์สไตล์ยุทธวิธี
              </p>
              <p className="text-[#888888] leading-relaxed mb-8">
                เราคัดสรรวัสดุคุณภาพสูงและออกแบบทุกชิ้นงานเพื่อตอบสนองความต้องการในการใช้งานจริง
                ด้วยมาตรฐานที่เข้มงวดและความใส่ใจในทุกรายละเอียด
                สินค้าทุกชิ้นของเราผ่านการทดสอบและรับรองคุณภาพก่อนส่งถึงมือลูกค้า
              </p>

              {/* Feature badges */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "🇹🇭", label: "ผลิตในไทย", sub: "Made in Thailand" },
                  { icon: "⭐", label: "คุณภาพสูง", sub: "Premium Quality" },
                  { icon: "🛡️", label: "ทดสอบจริง", sub: "Field Tested" },
                  { icon: "📦", label: "ส่งทั่วไทย", sub: "Nationwide Delivery" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 p-3 rounded bg-[#141414] border border-[#2e2e2e]"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-[#ededed]">{item.label}</p>
                      <p className="text-xs text-[#888888]">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Stats / Visual panel */}
            <div className="relative">
              {/* Decorative corner lines */}
              <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-[#4a7c59] opacity-40" />
              <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-[#4a7c59] opacity-40" />

              <div className="bg-[#141414] border border-[#2e2e2e] rounded-lg p-8">
                {/* Logo large */}
                <div className="text-center mb-8">
                  <span className="block text-5xl font-black tracking-widest text-[#4a7c59]">
                    BOGIE.1
                  </span>
                  <span className="block text-xl font-bold tracking-[0.5em] text-[#888888] uppercase mt-1">
                    INTER
                  </span>
                  <div className="h-px bg-[#2e2e2e] my-6" />
                  <p className="text-xs font-bold tracking-widest uppercase text-[#d4a843]">
                    TACTICAL GEAR · THAILAND
                  </p>
                </div>

                {/* Mission statements */}
                <div className="space-y-4">
                  {[
                    { label: "MISSION", text: "ผลิตอุปกรณ์ยุทธวิธีที่เชื่อถือได้" },
                    { label: "VISION", text: "แบรนด์ไทยระดับมาตรฐานสากล" },
                    { label: "VALUES", text: "คุณภาพ · ความทนทาน · ความไว้ใจ" },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-4 items-start">
                      <span className="text-xs font-black tracking-widest text-[#4a7c59] w-16 pt-0.5 shrink-0">
                        {item.label}
                      </span>
                      <span className="text-sm text-[#888888]">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT / SOCIAL SECTION ===== */}
      <section id="contact" className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest uppercase text-[#4a7c59] mb-3">
              GET IN TOUCH
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#ededed] tracking-tight">
              ติดต่อเรา
            </h2>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="h-px w-12 bg-[#2e2e2e]" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#4a7c59]" />
              <div className="h-px w-12 bg-[#2e2e2e]" />
            </div>
            <p className="mt-6 text-[#888888] max-w-xl mx-auto">
              ติดต่อเราผ่านช่องทางที่สะดวกสำหรับคุณ ทีมงานของเราพร้อมให้บริการและตอบคำถามทุกวัน
            </p>
          </div>

          {/* Contact channels grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Shopee */}
            <a
              href="https://shopee.co.th/bogie1inter"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center text-center p-8 rounded-lg bg-[#141414] border border-[#2e2e2e] hover:border-[#d4a843] transition-all duration-300 hover:shadow-lg hover:shadow-[#d4a843]/10"
            >
              <span className="text-5xl mb-4">🛒</span>
              <h3 className="text-lg font-bold text-[#ededed] mb-1 group-hover:text-[#d4a843] transition-colors">
                Shopee
              </h3>
              <p className="text-sm text-[#888888] mb-2">ร้านค้าออนไลน์</p>
              <p className="text-sm font-semibold text-[#d4a843]">shopee.co.th/bogie1inter</p>
            </a>

            {/* Line OA */}
            <a
              href="https://line.me/ti/p/~@bogie1"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center text-center p-8 rounded-lg bg-[#141414] border border-[#2e2e2e] hover:border-[#4a7c59] transition-all duration-300 hover:shadow-lg hover:shadow-[#4a7c59]/10"
            >
              <span className="text-5xl mb-4">💬</span>
              <h3 className="text-lg font-bold text-[#ededed] mb-1 group-hover:text-[#4a7c59] transition-colors">
                Line Official
              </h3>
              <p className="text-sm text-[#888888] mb-2">แชทสอบถาม / สั่งซื้อ</p>
              <p className="text-sm font-semibold text-[#4a7c59]">@bogie1</p>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/Bogie1TH"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center text-center p-8 rounded-lg bg-[#141414] border border-[#2e2e2e] hover:border-[#ededed] transition-all duration-300 hover:shadow-lg hover:shadow-white/5"
            >
              <span className="text-5xl mb-4">📘</span>
              <h3 className="text-lg font-bold text-[#ededed] mb-1 group-hover:text-white transition-colors">
                Facebook
              </h3>
              <p className="text-sm text-[#888888] mb-2">ข่าวสารและโปรโมชั่น</p>
              <p className="text-sm font-semibold text-[#ededed]">Bogie1TH</p>
            </a>
          </div>

          {/* Address block */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-6 rounded-lg bg-[#141414] border border-[#2e2e2e] max-w-2xl mx-auto">
            <span className="text-2xl">📍</span>
            <div className="text-center sm:text-left">
              <p className="text-sm font-semibold text-[#ededed]">ที่อยู่</p>
              <p className="text-sm text-[#888888]">
                ถนนวุฒากาศ แขวงจอมทอง เขตจอมทอง กรุงเทพมหานคร ประเทศไทย
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA BANNER ===== */}
      <section className="py-16 bg-[#141414] border-t border-[#2e2e2e]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#d4a843] mb-4">
            READY TO GEAR UP?
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-[#ededed] mb-6 tracking-tight">
            เริ่มต้นกับอุปกรณ์ยุทธวิธีคุณภาพสูงวันนี้
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://shopee.co.th/bogie1inter"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded text-sm font-bold text-[#0a0a0a] bg-[#d4a843] hover:bg-[#e8c060] transition-all duration-200 tracking-wide"
            >
              <span>🛒</span>
              ช็อปบน Shopee
            </a>
            <a
              href="https://www.facebook.com/Bogie1TH"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded text-sm font-bold text-[#ededed] border border-[#2e2e2e] hover:border-[#4a7c59] hover:bg-[#141414] transition-all duration-200 tracking-wide"
            >
              <span>📘</span>
              ติดตามบน Facebook
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
