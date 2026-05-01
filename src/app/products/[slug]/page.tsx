import { notFound } from "next/navigation";
import { getProductBySlug, products, addOns, reviews, benefits, ritualSteps } from "@/data/products";
import ProductView from "@/components/ProductView";
import { StockBar } from "@/components/AddOnSection";
import AddOnSectionClient from "@/components/AddOnSectionClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} — ARA Cold Therapy`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="bg-white min-h-screen">
      <ProductView product={product} />

      <StockBar stock={product.stock} total={100} />

      <div className="h-px bg-[rgba(124,58,237,0.08)]" />

      <AddOnSectionClient addOns={addOns} />

      <div className="h-px bg-[rgba(124,58,237,0.08)]" />

      {/* How to Use */}
      <section className="bg-[#faf8ff]">
        <div className="section">
          <div className="eyebrow mb-5">The Method</div>
          <h2 className="font-serif text-[34px] md:text-5xl font-light leading-[1.1] text-[#0f0a1e] mb-10">
            60 seconds.<br />
            <em className="italic text-[#7c3aed]">No serum does this.</em>
          </h2>
          <div className="max-w-2xl space-y-0">
            {ritualSteps.map((step, idx) => (
              <div
                key={step.step}
                className={`flex gap-6 py-7 ${idx < ritualSteps.length - 1 ? "border-b border-[rgba(124,58,237,0.08)]" : ""}`}
              >
                <span className="font-mono text-sm text-[#7c3aed] font-semibold pt-0.5 w-9 shrink-0">{step.step}</span>
                <div>
                  <h4 className="text-[17px] md:text-lg font-semibold text-[#0f0a1e] mb-2">{step.title}</h4>
                  <p className="text-[15px] md:text-base text-[#6b7280] leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-[rgba(124,58,237,0.08)]" />

      {/* Science / Benefits */}
      <section className="bg-white">
        <div className="section">
          <div className="eyebrow mb-5">The Science</div>
          <h2 className="font-serif text-[34px] md:text-5xl font-light leading-[1.1] text-[#0f0a1e] mb-10">
            What cold actually does<br />
            <em className="italic text-[#7c3aed]">to your face.</em>
          </h2>
          <div className="max-w-2xl space-y-0">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`flex gap-6 py-6 ${index < benefits.length - 1 ? "border-b border-[rgba(124,58,237,0.08)]" : ""}`}
              >
                <span className="text-2xl w-9 shrink-0 mt-0.5 text-center">{benefit.icon}</span>
                <div>
                  <h4 className="text-[17px] md:text-lg font-semibold text-[#0f0a1e] mb-1.5">{benefit.title}</h4>
                  <p className="text-[15px] md:text-base text-[#6b7280] leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-[rgba(124,58,237,0.08)]" />

      {/* Reviews */}
      <section className="bg-[#faf8ff]">
        <div className="section">
          <div className="eyebrow mb-5">Reviews</div>
          <h2 className="font-serif text-[34px] md:text-5xl font-light leading-[1.1] text-[#0f0a1e] mb-10">
            What others<br />
            <em className="italic text-[#7c3aed]">are saying.</em>
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
                    <span className="inline-block mt-3 font-mono text-[11px] tracking-widest uppercase text-[#7c3aed] bg-[#f5f3ff] border border-[rgba(124,58,237,0.2)] py-1 px-2.5 rounded-full">
                      ✓ Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
