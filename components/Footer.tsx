export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#2e2e2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <span className="text-2xl font-black tracking-widest text-[#4a7c59] uppercase">
                BOGIE.1
              </span>
              <span className="ml-2 text-sm font-semibold tracking-wider text-[#888888] uppercase">
                INTER
              </span>
            </div>
            <p className="text-sm text-[#888888] leading-relaxed max-w-xs">
              แบรนด์อุปกรณ์ยุทธวิธีคุณภาพสูงสัญชาติไทย
              ออกแบบและผลิตเพื่อตอบสนองความต้องการของมืออาชีพ
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-[#4a7c59] mb-4">
              ลิงก์ด่วน
            </h3>
            <ul className="space-y-2">
              {[
                { href: "#hero", label: "หน้าแรก" },
                { href: "#products", label: "สินค้า" },
                { href: "#about", label: "เกี่ยวกับเรา" },
                { href: "#contact", label: "ติดต่อเรา" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-[#888888] hover:text-[#ededed] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-[#4a7c59] mb-4">
              ช่องทางการติดต่อ
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://shopee.co.th/bogie1inter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#d4a843] transition-colors"
                >
                  <span>🛒</span>
                  <span>Shopee: bogie1inter</span>
                </a>
              </li>
              <li>
                <a
                  href="https://line.me/ti/p/~@bogie1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#4a7c59] transition-colors"
                >
                  <span>💬</span>
                  <span>Line OA: @bogie1</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/Bogie1TH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#888888] hover:text-[#ededed] transition-colors"
                >
                  <span>📘</span>
                  <span>Facebook: Bogie1TH</span>
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-[#888888]">
                <span>📍</span>
                <span>ถนนวุฒากาศ จอมทอง กรุงเทพมหานคร</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[#2e2e2e] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#888888]">
            © {currentYear} Bogie1 Inter. สงวนลิขสิทธิ์ทุกประการ.
          </p>
          <p className="text-xs text-[#888888] tracking-widest uppercase">
            TACTICAL GEAR · MADE IN THAILAND
          </p>
        </div>
      </div>
    </footer>
  );
}
