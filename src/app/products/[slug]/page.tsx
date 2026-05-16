import { notFound } from "next/navigation";
import { getProductBySlug, addOns, reviews } from "@/data/products";
import ProductView from "@/components/ProductView";
import StickyOrderCTA from "@/components/StickyOrderCTA";
import AddOnSection from "@/components/AddOnSection";
import RitualSteps from "@/components/RitualSteps";
import ReviewsMarquee from "@/components/ReviewsMarquee";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductView product={product} />
      <StickyOrderCTA product={product} />

      {/* Add-ons Section */}
      <section className="bg-paper py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest uppercase text-brand mb-2">
              Enhance Your Ritual
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-ink">
              Add Botanical Powders
            </h2>
            <p className="text-sm text-ink-muted mt-2">
              Dissolve in your ice bowl water for enhanced benefits.
            </p>
          </div>
          <AddOnSection addons={addOns} currentProductId={product.id} />
        </div>
      </section>

      <RitualSteps />
      <ReviewsMarquee reviews={reviews} />
    </>
  );
}

export async function generateStaticParams() {
  const { products } = await import("@/data/products");
  return products.map((p) => ({ slug: p.slug }));
}
