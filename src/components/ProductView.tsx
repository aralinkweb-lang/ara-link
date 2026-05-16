"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ShoppingBag, Zap, ShieldCheck, Leaf, RefreshCw } from "lucide-react";
import type { Product, ProductVariant } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart";
import QuantitySelector from "./QuantitySelector";

function getProductImage(slug: string): string {
  if (slug.includes("ara-ice-bowl"))
    return "https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778867529/DSC04677_g0et5k.jpg";
  if (slug.includes("rose"))
    return "https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778867520/DSC07080_lqtbgu.jpg";
  if (slug.includes("beetroot"))
    return "https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778867521/enhanced_04_qmz5l7.png";
  if (slug.includes("mint"))
    return "https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778867521/DSC07076_fbwzgq.jpg";
  return "https://images.unsplash.com/photo-1501173727994-04cbcb2e3af1?w=800&q=80";
}

interface ProductViewProps {
  product: Product;
}

export default function ProductView({ product }: ProductViewProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const fallbackImage = getProductImage(product.slug);
  const variantImages = selectedVariant?.images ?? [];
  const thumbnailImages = variantImages.length > 0
    ? variantImages
    : [
      ];
  const [activeThumb, setActiveThumb] = useState(0);

  const displayImage = thumbnailImages[activeThumb] ?? thumbnailImages[0] ?? fallbackImage;

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setActiveThumb(0);
  };

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
  const savings = product.originalPrice - product.price;

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
  };

  const handleOrderNow = () => {
    addItem(product, quantity, selectedVariant);
    window.location.href = "/checkout";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left: Images */}
        <div className="flex flex-col gap-4">
          {/* Main Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-paper border border-edge">
            <Image
              src={displayImage}
              alt={product.name}
              fill
              unoptimized
              priority
              className="object-cover"
            />
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-brand text-white text-sm font-bold px-3 py-1.5 rounded-full">
                -{discount}% OFF
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {thumbnailImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveThumb(i)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors shrink-0 ${
                  activeThumb === i ? "border-brand" : "border-edge hover:border-brand/40"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          

          {/* Name */}
          <h1 className="text-3xl sm:text-4xl font-black text-ink leading-tight mb-4">
            {product.name}
          </h1>

          {/* Rating Row */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-200 fill-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-ink">{product.rating}</span>
            <span className="text-sm text-ink-muted">
              ({product.reviewCount} reviews)
            </span>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              In Stock
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-edge">
            <span className="text-4xl font-black text-ink">
              {formatPrice(product.price)}
            </span>
            <div className="flex flex-col">
              <span className="text-base text-ink-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
              {savings > 0 && (
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  Save {formatPrice(savings)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-ink-2 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-bold text-ink mb-3">
                Color:{" "}
                <span className="text-ink-2 font-medium">
                  {selectedVariant?.name ?? "Select"}
                </span>
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleSelectVariant(variant)}
                    title={variant.name}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedVariant?.id === variant.id
                        ? "border-brand scale-110 shadow-md"
                        : "border-edge hover:border-brand/60"
                    }`}
                    style={{ background: variant.colorCode }}
                    aria-label={variant.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-bold text-ink">Qty:</span>
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              min={1}
              max={product.stock}
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 border border-edge rounded-2xl px-6 py-3.5 font-semibold text-sm text-ink-2 hover:border-brand hover:text-brand transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={handleOrderNow}
              className="flex-1 flex items-center justify-center gap-2 bg-brand text-white rounded-2xl px-6 py-3.5 font-semibold text-sm hover:bg-brand-hover transition-colors shadow-lg shadow-brand/25"
            >
              <Zap className="w-4 h-4" />
              Order Now
            </button>
          </div>

          {/* Guarantee Chips */}
          <div className="flex flex-wrap gap-3 mb-6 pb-6 border-b border-edge">
            
            <div className="flex items-center gap-2 bg-paper rounded-full px-4 py-2">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-ink-2">
                Food-Grade Materials
              </span>
            </div>
            <div className="flex items-center gap-2 bg-paper rounded-full px-4 py-2">
              <RefreshCw className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-ink-2">
                30-Day Returns
              </span>
            </div>
          </div>

          {/* Features List */}
          <div>
            <p className="text-sm font-bold text-ink mb-3">
              What&apos;s Included / Features
            </p>
            <ul className="flex flex-col gap-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-2">
                  <span className="text-brand font-bold mt-0.5">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
