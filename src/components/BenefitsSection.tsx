import Link from "next/link";
import { benefits } from "@/data/products";

export default function BenefitsSection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Sticky heading */}
          <div className="lg:sticky lg:top-24">
            <p className="text-xs font-bold tracking-widest uppercase text-brand mb-4">
              Why Cold Therapy
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink leading-tight mb-6">
              Science That Works. Results You Feel Immediately.
            </h2>
            <p className="text-base text-ink-2 leading-relaxed mb-8 max-w-sm">
              Cold therapy has been used by dermatologists and biohackers for
              decades. ARA brings it to your morning routine in a form that
              actually fits your life.
            </p>
            <Link
              href="/products/ara-ice-bowl"
              className="inline-block bg-brand text-white rounded-2xl px-8 py-3.5 font-semibold text-sm hover:bg-brand-hover transition-colors"
            >
              Shop Now
            </Link>
          </div>

          {/* Right: Benefits list */}
          <div className="flex flex-col gap-0">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className={`flex gap-5 py-7 ${
                  index < benefits.length - 1 ? "border-b border-edge" : ""
                }`}
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center">
                  <span className="text-xl text-brand font-black">
                    {benefit.icon}
                  </span>
                </div>
                {/* Text */}
                <div>
                  <h3 className="font-bold text-base text-ink mb-1.5">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-ink-2 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
