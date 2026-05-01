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
        <div className=" max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-[520px] lg:min-h-[600px] gap-12 ">

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
          <div className="p-3 lg:w-1/2 xl:w-2/5 px-6 py-12 md:px-10 md:py-14 lg:px-14  xl:px-16 xl:pl-2  bg-white flex flex-col justify-center">
            <div className="flex items-center gap-2 flex-wrap mb-6">
              <span className="badge">Cold Therapy</span>
              <span className="badge badge-gold">🔥 Limited Stock</span>
             
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

            <div className="">
  <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-stretch">
    <Link
      href={`/products/${featuredProduct.slug}`}
      className="btn-primary w-70 sm:flex-1 flex items-center justify-center px-6"
    >
      View Product
    </Link>

    <Link
      href="/products"
      className="btn-secondary w-70 sm:flex-1 text-center px-6"
    >
      Shop All
    </Link>
  </div>
</div>
          </div>
        </div>
      </section>

      {/* ── Who Owns This ────────────────────────────────────────────────── */}
      <section className=" bg-[#faf8ff]">
        <div className="section">
          <div className="max-w-3xl mb-14">
            <div className="eyebrow mb-5 ">The Owner&apos;s Profile</div>
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
            <div className="card p-8 md:p-16  overflow-hidden">
              <div className=" top-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#7c3aed] to-[#a78bfa] rounded-t-xl" />
              <span className="p-4"></span>
              <div className="font-mono text-[18px] tracking-[0.2em]  p-2 uppercase text-[#7c3aed] mt-2 font-medium">The Performer</div>
              
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

            <div className="card p-12 md:p-18  overflow-hidden">
              <div className=" top-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#7c3aed] to-[#a78bfa] rounded-t-xl" />
              <div className="font-mono text-[18px] tracking-[0.2em] uppercase text-[#7c3aed] mb-4 font-medium">The Biohacker</div>
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
            <br />
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
            <br />
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

      

    </div>
  );
}
