import { notFound } from "next/navigation";
import { getProductBySlug, products, addOns, reviews, benefits, ritualSteps } from "@/data/products";
import ProductView from "@/components/ProductView";
import { StockBar } from "@/components/AddOnSection";
import AddOnSectionClient from "@/components/AddOnSectionClient";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import StickyOrderCTA from "@/components/StickyOrderCTA";

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
      <StickyOrderCTA product={product} />

      <div className="h-px bg-[rgba(124,58,237,0.08)]" />
<br />
      <AddOnSectionClient addOns={addOns} />

      <div className="h-px bg-[rgba(124,58,237,0.08)]" />
<br />
      {/* How to Use */}
     <section className="bg-[#faf8ff] section">
  <div className="mx-auto px-5 py-16 md:px-10 lg:px-16">

    {/* TOP HEADING */}
    <div className="flex flex-col items-center text-center">

      {/* SMALL LABEL */}
      <div className="font-mono text-[12px] md:text-[13px] tracking-[0.26em] uppercase text-[#7c3aed] flex items-center gap-3 font-medium mb-5">
        <span className="w-8 md:w-12 h-[1.5px] bg-[#7c3aed] rounded-full" />
        The Method
        <span className="w-8 md:w-12 h-[1.5px] bg-[#7c3aed] rounded-full" />
      </div>

      {/* TITLE */}
      <h2 className="font-serif text-[36px] md:text-5xl lg:text-6xl font-light leading-[1.1] text-[#0f0a1e] mb-5 max-w-3xl">
        60 seconds.
        <br />
        <em className="italic text-[#7c3aed]">
          No serum does this.
        </em>
      </h2>

      {/* SUBTEXT */}
      <p className="text-[#6b7280] text-base md:text-lg leading-relaxed max-w-2xl mb-14">
        A minimal ritual designed to cool, depuff, sculpt and refresh your skin instantly — without complicated skincare routines.
      </p>
    </div>

    {/* STEPS */}
    {/* STEPS */}
<div className="w-full  mx-auto flex flex-col gap-5">

  {ritualSteps.map((step, idx) => (
    <div
      key={step.step}
      className="group bg-white border border-[rgba(124,58,237,0.08)] rounded-2xl p-8 md:p-9 hover:border-[#7c3aed]/20 hover:shadow-[0_10px_40px_rgba(124,58,237,0.08)] transition-all duration-300"
    >
      <div className="flex gap-5 items-start">

        {/* STEP NUMBER */}
        <div className="w-12 h-12 rounded-full bg-[#f5f3ff] flex items-center justify-center shrink-0 border border-[rgba(124,58,237,0.12)]">
          <span className="font-mono text-sm font-semibold text-[#7c3aed]">
            {step.step}
          </span>
        </div>

        {/* CONTENT */}
        <div>
          <h4 className="text-[18px] md:text-[20px] font-semibold text-[#0f0a1e] mb-2">
            {step.title}
          </h4>

          <p className="text-[15px] md:text-base text-[#6b7280] leading-relaxed">
            {step.description}
          </p>
        </div>

      </div>
    </div>
  ))}

</div>
  </div>
</section>

      <div className="h-px bg-[rgba(124,58,237,0.08)]" />

      {/* Science / Benefits */}
      <section className="bg-white section">
  <div className=" mx-auto px-5 py-16 md:px-10 md:py-24 lg:px-16 lg:py-[90px]">

    {/* TOP */}
    <div className="flex flex-col items-center text-center">

      {/* LABEL */}
      <div className="font-mono text-[12px] md:text-[13px] tracking-[0.26em] uppercase text-[#7c3aed] flex items-center gap-3 font-medium mb-5">
        <span className="w-8 md:w-12 h-[1.5px] bg-[#7c3aed] rounded-full" />
        The Science
        <span className="w-8 md:w-12 h-[1.5px] bg-[#7c3aed] rounded-full" />
      </div>

      {/* TITLE */}
      <h2 className="font-serif text-[36px] md:text-5xl lg:text-6xl font-light leading-[1.1] text-[#0f0a1e] mb-5 max-w-4xl">
        What cold actually does
        <br />
        <em className="italic text-[#7c3aed]">
          to your face.
        </em>
      </h2>

      {/* SUBTEXT */}
      <p className="text-[#6b7280] text-base md:text-lg leading-relaxed max-w-2xl mb-14">
        Cooling therapy helps reduce puffiness, tighten the appearance of skin,
        improve circulation and give your face a naturally refreshed look.
      </p>
    </div>

    {/* BENEFITS */}
    <div className="justify-center  flex flex-col gap-5">

      {benefits.map((benefit, index) => (
        <div
          key={index}
          className="group bg-[#faf8ff] border border-[rgba(124,58,237,0.08)] rounded-2xl p-6 md:p-8 hover:border-[#7c3aed]/20 hover:shadow-[0_10px_40px_rgba(124,58,237,0.08)] transition-all duration-300"
        >
          <div className="flex gap-5 items-start">

            {/* ICON */}
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shrink-0 border border-[rgba(124,58,237,0.12)] text-2xl shadow-sm">
              {benefit.icon}
            </div>

            {/* CONTENT */}
            <div>
              <h4 className="text-[18px] md:text-[20px] font-semibold text-[#0f0a1e] mb-2">
                {benefit.title}
              </h4>

              <p className="text-[15px] md:text-base text-[#6b7280] leading-relaxed">
                {benefit.description}
              </p>
            </div>

          </div>
        </div>
      ))}

    </div>
  </div>
</section>

      <div className="h-px bg-[rgba(124,58,237,0.08)]" />

     
      <ReviewsCarousel />
      <br />
    </div>
  );
}
