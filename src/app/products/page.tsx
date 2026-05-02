import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ReviewsCarousel from "@/components/ReviewsCarousel";

export const metadata = {
  title: "Shop All Products — ARA Cold Therapy",
  description: "Browse our collection of premium cold therapy skincare products.",
};

export default function ProductsPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="section">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12">
          <div>
            <div className="eyebrow mb-5">Shop</div>
            <h1 className="font-serif text-[40px] md:text-5xl lg:text-6xl font-light leading-[1.05] text-[#0f0a1e] mb-5">
              The Cold<br />
              <em className="italic text-[#7c3aed]">Collection</em>
            </h1>
            <p className="text-base md:text-lg text-[#6b7280] leading-relaxed max-w-lg">
              Premium cold therapy tools designed for the modern skincare ritual. Each product engineered for results, not routine.
            </p>
          </div>
          <div className="font-mono text-sm text-[#9ca3af]">
            {products.length} products
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <div className="border-t border-b border-[rgba(124,58,237,0.1)] bg-[#faf8ff]">
        <div className=" mx-auto grid grid-cols-1 sm:grid-cols-3">
          {[
            { icon: "🚚", title: "Free Shipping", sub: "Across India" },
            { icon: "↩️", title: "30-Day Returns",  sub: "No questions asked" },
            { icon: "🔒", title: "Secure Payments", sub: "Razorpay encrypted" },
          ].map(({ icon, title, sub }) => (
            <div key={title} className="py-9 px-4 text-center border-b sm:border-b-0 sm:border-r last:border-r-0 border-[rgba(124,58,237,0.08)]">
              <div className="text-3xl mb-3">{icon}</div>
              <p className="text-base font-semibold text-[#0f0a1e]">{title}</p>
              <p className="text-sm text-[#9ca3af] mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <ReviewsCarousel />
    </div>
  );
}
