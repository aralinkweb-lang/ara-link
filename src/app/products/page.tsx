import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = ["All", "Cold Therapy", "Powders", "Combos"];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-paper border-b border-edge">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <p className="text-xs font-bold tracking-widest uppercase text-brand mb-3">
            Our Collection
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-ink mb-4">
            Shop Cold Therapy
          </h1>
          <p className="text-base text-ink-2 max-w-xl">
            Everything you need to build a daily cold therapy ritual. The ARA
            Ice Bowl, botanical powders, and value-packed combos — all crafted
            in India.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat, i) => (
            <span
              key={cat}
              className={`px-5 py-2 rounded-full text-sm font-semibold cursor-pointer transition-colors ${
                i === 0
                  ? "bg-brand text-white"
                  : "bg-paper text-ink-2 border border-edge hover:border-brand hover:text-brand"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom Trust */}
        <div className="mt-16 py-10 border-t border-edge">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-black text-brand mb-1">847+</p>
              <p className="text-sm text-ink-muted">Verified Reviews</p>
            </div>
            <div>
              <p className="text-2xl font-black text-brand mb-1">4.9★</p>
              <p className="text-sm text-ink-muted">Average Rating</p>
            </div>
            <div>
              <p className="text-2xl font-black text-brand mb-1">Free</p>
              <p className="text-sm text-ink-muted">Shipping Across India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
