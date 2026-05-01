import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { products, reviews, benefits, ritualSteps, otoProducts } from "@/data/products";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const featuredProduct = products[0];
  const heroSavings = featuredProduct.originalPrice - featuredProduct.price;

  return (
    <div className="bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="w-full">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-[520px] lg:min-h-[600px]">

          {/* Left — product visual */}
          <div className="w-full lg:w-1/2 xl:w-3/5 aspect-square lg:aspect-auto flex items-center justify-center relative bg-linear-to-br from-[#f5f3ff] via-[#ede9fe] to-[#f5f3ff] overflow-hidden min-h-[320px] lg:min-h-0">
            <div className="absolute inset-0 grid-overlay" />
            <div className="absolute inset-0 glow-center" />
            {/* Subtle ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] lg:w-[360px] h-[280px] lg:h-[360px] border border-[rgba(124,58,237,0.12)] rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] lg:w-[480px] h-[380px] lg:h-[480px] border border-[rgba(124,58,237,0.06)] rounded-full" />
            <div className="animate-float relative z-10">
              <span className="text-[160px] md:text-[200px] lg:text-[240px] xl:text-[280px] leading-none select-none">🧊</span>
            </div>
          </div>

          {/* Right — product info */}
          <div className="w-full lg:w-1/2 xl:w-2/5 px-6 py-12 md:px-10 md:py-14 lg:px-14 xl:px-16 bg-white flex flex-col justify-center">
            <div className="flex items-center gap-2 flex-wrap mb-6">
              <span className="badge">Cold Therapy</span>
              <span className="badge badge-gold">🔥 Limited Stock</span>
              <span className="badge badge-red">Only {featuredProduct.stock} Left</span>
            </div>

            <h1 className="font-serif text-[44px] md:text-[56px] lg:text-[60px] xl:text-7xl font-light leading-[1.05] text-[#0f0a1e] mb-3">
              ARA Ice Bowl
            </h1>
            <p className="text-[#6b7280] text-base md:text-lg tracking-wide mb-7 leading-relaxed">
              The Last Ice Bowl You&apos;ll Ever Argue About
            </p>

            <div className="flex items-center gap-3 mb-7 flex-wrap">
              <span className="text-[#c9a96e] tracking-wider text-base">★★★★★</span>
              <span className="font-mono text-sm text-[#6b7280]">4.9</span>
              <span className="w-px h-4 bg-[rgba(124,58,237,0.15)]" />
              <span className="font-mono text-sm text-[#6b7280]">847 reviews</span>
              <span className="w-px h-4 bg-[rgba(124,58,237,0.15)]" />
              <span className="text-sm text-[#7c3aed] font-medium">✓ Verified</span>
            </div>

            <div className="flex items-baseline gap-3 mb-2 flex-wrap">
              <span className="font-serif text-[44px] md:text-[56px] font-light text-[#0f0a1e]">{formatPrice(featuredProduct.price)}</span>
              <span className="text-xl text-[#9ca3af] line-through">{formatPrice(featuredProduct.originalPrice)}</span>
              <span className="badge badge-purple">Save {formatPrice(heroSavings)}</span>
            </div>
            <p className="text-sm text-[#9ca3af] mb-8">Inclusive of all taxes · Free shipping</p>

            <div className="flex flex-col sm:flex-row gap-3 lg:max-w-md">
              <Link
                href={`/products/${featuredProduct.slug}`}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                View Product
                <ArrowRight size={16} />
              </Link>
              <Link href="/products" className="btn-secondary flex-1 text-center">
                Shop All
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who Owns This ────────────────────────────────────────────────── */}
      <section className="bg-[#faf8ff]">
        <div className="section">
          <div className="max-w-3xl mb-14">
            <div className="eyebrow mb-5">The Owner&apos;s Profile</div>
            <h2 className="font-serif text-[34px] md:text-5xl lg:text-[56px] font-light leading-[1.1] text-[#0f0a1e] mb-6">
              This isn&apos;t for everyone.<br />
              <em className="italic text-[#7c3aed]">That&apos;s the point.</em>
            </h2>
            <p className="text-base md:text-lg text-[#6b7280] leading-relaxed max-w-2xl">
              ARA doesn&apos;t compete for shelf space with your 12-step routine. It either becomes the
              first thing you do every morning — or it doesn&apos;t belong in your life.
              <br /><br />
              <strong className="text-[#0f0a1e] font-medium">Here&apos;s who it belongs to.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#7c3aed] to-[#a78bfa] rounded-t-xl" />
              <div className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#7c3aed] mb-4 font-medium">The Performer</div>
              <h4 className="font-serif text-xl md:text-2xl font-medium text-[#0f0a1e] mb-3 leading-snug">
                She doesn&apos;t have time for complicated.
              </h4>
              <p className="text-[15px] md:text-base text-[#6b7280] leading-relaxed mb-5">
                Six meetings before noon. Skincare needs to work before she&apos;s fully awake. She doesn&apos;t
                want five steps. She wants one that does the job of three.
              </p>
              <div className="text-[15px] md:text-base text-[#0f0a1e] border-t border-[rgba(124,58,237,0.1)] pt-5">
                15 seconds in ARA. Serum after. Done.
                <span className="block text-sm text-[#6b7280] mt-2">Her skin looks ready before her coffee is.</span>
              </div>
            </div>

            <div className="card p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#7c3aed] to-[#a78bfa] rounded-t-xl" />
              <div className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#7c3aed] mb-4 font-medium">The Biohacker</div>
              <h4 className="font-serif text-xl md:text-2xl font-medium text-[#0f0a1e] mb-3 leading-snug">
                He&apos;s already read the research.
              </h4>
              <p className="text-[15px] md:text-base text-[#6b7280] leading-relaxed mb-5">
                Wim Hof. Huberman. Cold exposure protocols on his calendar every morning. He knows the
                science. He&apos;s been doing it with a kitchen bowl for two years.
              </p>
              <div className="text-[15px] md:text-base text-[#0f0a1e] border-t border-[rgba(124,58,237,0.1)] pt-5">
                ARA is the tool his protocol always deserved.
                <span className="block text-sm text-[#6b7280] mt-2">The kitchen bowl never belonged in a serious ritual.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Ritual ───────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="section">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">The Method</div>
            <h2 className="font-serif text-[34px] md:text-5xl font-light leading-[1.1] text-[#0f0a1e] mb-10">
              60 seconds.<br />
              <em className="italic text-[#7c3aed]">No serum does this.</em>
            </h2>
            <div className="space-y-0">
              {ritualSteps.map((step, idx) => (
                <div
                  key={step.step}
                  className={`flex gap-6 py-7 ${idx < ritualSteps.length - 1 ? "border-b border-[rgba(124,58,237,0.08)]" : ""}`}
                >
                  <span className="font-mono text-sm text-[#7c3aed] font-semibold pt-0.5 w-9 flex-shrink-0">
                    {step.step}
                  </span>
                  <div>
                    <h4 className="text-[17px] md:text-lg font-semibold text-[#0f0a1e] mb-2">{step.title}</h4>
                    <p className="text-[15px] md:text-base text-[#6b7280] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── The Science ──────────────────────────────────────────────────── */}
      <section className="bg-[#faf8ff]">
        <div className="section">
          <div className="max-w-2xl">
            <div className="eyebrow mb-5">The Science</div>
            <h2 className="font-serif text-[34px] md:text-5xl font-light leading-[1.1] text-[#0f0a1e] mb-10">
              What cold actually does<br />
              <em className="italic text-[#7c3aed]">to your face.</em>
            </h2>
            <div className="space-y-0">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className={`flex gap-6 py-6 ${index < benefits.length - 1 ? "border-b border-[rgba(124,58,237,0.08)]" : ""}`}
                >
                  <span className="text-2xl w-9 flex-shrink-0 mt-0.5 text-center">{benefit.icon}</span>
                  <div>
                    <h4 className="text-[17px] md:text-lg font-semibold text-[#0f0a1e] mb-1.5">{benefit.title}</h4>
                    <p className="text-[15px] md:text-base text-[#6b7280] leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ──────────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="section">
          <div className="eyebrow mb-5">The Verdict From Others</div>
          <h2 className="font-serif text-[34px] md:text-5xl font-light leading-[1.1] text-[#0f0a1e] mb-10">
            They tried arguing.<br />
            <em className="italic text-[#7c3aed]">Then ordered a second one.</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="card p-7 md:p-8 flex flex-col">
                <div className="text-[#c9a96e] text-base tracking-wider mb-4">★★★★★</div>
                <p className="font-serif text-[17px] italic text-[#0f0a1e] leading-relaxed mb-5 flex-1">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div>
                  <div className="font-mono text-[12px] tracking-[0.15em] uppercase text-[#374151] font-semibold">
                    {review.author}
                  </div>
                  <div className="text-sm text-[#9ca3af] mt-1">{review.role}</div>
                  {review.verified && (
                    <span className="inline-block mt-3 font-mono text-[11px] tracking-[0.1em] uppercase text-[#7c3aed] bg-[#f5f3ff] border border-[rgba(124,58,237,0.2)] py-1 px-2.5 rounded-full">
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── One-Time Offer ───────────────────────────────────────────────── */}
      <section className="bg-linear-to-b from-[#f5f3ff] via-[#faf8ff] to-[#f5f3ff]">
        <div className="section">
          {/* OTO label */}
          <div className="flex items-center gap-4 mb-9">
            <div className="flex-1 h-px bg-linear-to-r from-transparent to-[rgba(124,58,237,0.3)]" />
            <div className="flex items-center gap-2 bg-[#7c3aed] text-white font-mono text-[12px] tracking-[0.18em] uppercase px-5 py-2 rounded-full font-medium">
              <Zap size={13} />
              One-Time Offer
            </div>
            <div className="flex-1 h-px bg-linear-to-l from-transparent to-[rgba(124,58,237,0.3)]" />
          </div>

          <div className="max-w-2xl mb-10">
            <div className="eyebrow mb-5">Ritual Enhancers</div>
            <h2 className="font-serif text-[34px] md:text-5xl font-light leading-[1.1] text-[#0f0a1e] mb-5">
              Upgrade your ice bowl.<br />
              <em className="italic text-[#7c3aed]">This offer disappears at checkout.</em>
            </h2>
            <p className="text-base md:text-lg text-[#6b7280] max-w-xl leading-relaxed">
              Natural powder infusions — dissolve in your ARA bowl water before dipping. Each one changes
              what cold therapy does to your skin. Available at this price only right now.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {otoProducts.map((product) => {
              const savings = product.originalPrice - product.price;
              const discountPct = Math.round((savings / product.originalPrice) * 100);
              return (
                <div key={product.id} className="card p-6 flex flex-col relative overflow-hidden">
                  {/* Purple top accent */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#7c3aed] to-[#a78bfa] rounded-t-xl" />
                  {/* Discount badge */}
                  <div className="absolute top-4 right-4 bg-[#7c3aed] text-white font-mono text-[11px] font-medium tracking-[0.08em] px-2.5 py-1 rounded-full">
                    {discountPct}% OFF
                  </div>

                  <div className="w-14 h-14 bg-[#f5f3ff] border border-[rgba(124,58,237,0.12)] rounded-xl flex items-center justify-center text-2xl mb-5 flex-shrink-0">
                    {product.icon}
                  </div>
                  <h4 className="text-base font-semibold text-[#0f0a1e] mb-2.5 leading-snug pr-10">
                    {product.name}
                  </h4>
                  <p className="text-sm text-[#6b7280] leading-relaxed mb-5 flex-1">
                    {product.description}
                  </p>
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-4 flex-wrap">
                      <span className="font-semibold text-xl text-[#0f0a1e]">₹{product.price}</span>
                      <span className="text-base text-[#9ca3af] line-through">₹{product.originalPrice}</span>
                      <span className="badge badge-purple">Save ₹{savings}</span>
                    </div>
                    <Link href={`/products/${product.id}`} className="btn-primary w-full text-center">
                      Claim Offer
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Products Grid ────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="section">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">
            <div>
              <div className="eyebrow mb-5">Our Products</div>
              <h2 className="font-serif text-[34px] md:text-5xl lg:text-[56px] font-light leading-[1.1] text-[#0f0a1e]">
                Shop the<br />
                <em className="italic text-[#7c3aed]">Cold Collection</em>
              </h2>
            </div>
            <Link
              href="/products"
              className="text-base text-[#7c3aed] hover:text-[#5b21b6] font-medium transition-colors flex items-center gap-2"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="w-full bg-linear-to-br from-[#5b21b6] via-[#7c3aed] to-[#8b5cf6] py-20 md:py-28 lg:py-36 px-5 text-center relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/10 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />

        <div className="relative max-w-2xl mx-auto">
          <div className="font-mono text-[12px] md:text-[13px] tracking-[0.3em] uppercase text-white/60 mb-6 font-medium">
            ARA — Ice Bowl
          </div>
          <h2 className="font-serif text-[40px] md:text-6xl lg:text-7xl font-light leading-[1.05] text-white mb-5">
            You already know<br />
            <em className="italic text-white/80">what you&apos;re going to do.</em>
          </h2>
          <p className="text-base md:text-lg text-white/70 max-w-md mx-auto mb-10 leading-relaxed">
            The only question is whether you keep scrolling past the skin you want — or order the bowl
            that gets you there.
          </p>
          <div className="font-serif text-[56px] md:text-7xl font-light text-white mb-2">{formatPrice(featuredProduct.price)}</div>
          <p className="text-sm md:text-base text-white/60 mb-10">
            Free shipping · 30-day returns · Only {featuredProduct.stock} units left
          </p>
          <Link
            href={`/products/${featuredProduct.slug}`}
            className="inline-block bg-white text-[#7c3aed] font-semibold text-[15px] md:text-base tracking-[0.1em] uppercase px-12 py-5 rounded-xl hover:bg-white/90 transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] w-full max-w-md"
          >
            Order ARA Now — {formatPrice(featuredProduct.price)}
          </Link>
          <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/50 mt-6">
            Secure checkout · Razorpay · Delivered in 3–5 days
          </p>
        </div>
      </section>

    </div>
  );
}
