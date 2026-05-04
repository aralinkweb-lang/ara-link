import Link from "next/link";
import { products, reviews, benefits, ritualSteps } from "@/data/products";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import BenefitsSection from "@/components/BenefitsSection";
import RitualSteps from "@/components/RitualSteps";
import ReviewsMarquee from "@/components/ReviewsMarquee";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);

  return (
    <>
      <HeroSection />
      <TrustBar />

      {/* Featured Products */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-brand mb-2">
                Best Sellers
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-ink">
                Featured Products
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-brand hover:text-brand-hover transition-colors hidden sm:block"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/products"
              className="border border-edge rounded-2xl px-6 py-3 font-semibold text-sm text-ink-2 hover:border-brand hover:text-brand transition-colors inline-block"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <BenefitsSection />
      <RitualSteps />
      <ReviewsMarquee reviews={reviews} />

      {/* CTA Banner */}
      <section className="relative py-20 overflow-hidden bg-brand">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-white/60 mb-4">
            Start Today
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-6">
            Ready to Transform Your Morning?
          </h2>
          <p className="text-base text-white/70 mb-10 max-w-md mx-auto leading-relaxed">
            Join 847+ customers who&apos;ve made cold therapy their first step
            every morning. Results guaranteed or your money back.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/products"
              className="bg-white text-brand rounded-2xl px-8 py-4 font-bold text-sm hover:bg-brand-light transition-colors shadow-lg"
            >
              Shop Now →
            </Link>
            <Link
              href="/products/ara-ice-bowl"
              className="border border-white/40 text-white rounded-2xl px-8 py-4 font-bold text-sm hover:bg-white/10 transition-colors"
            >
              View ARA Ice Bowl
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
