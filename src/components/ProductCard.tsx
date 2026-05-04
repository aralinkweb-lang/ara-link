"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart";

function getProductImage(slug: string): string {
  if (slug.includes("ara-ice-bowl"))
    return "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&q=80";
  if (slug.includes("rose"))
    return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80";
  if (slug.includes("beetroot"))
    return "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80";
  if (slug.includes("mint"))
    return "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80";
  return "https://images.unsplash.com/photo-1501173727994-04cbcb2e3af1?w=400&q=80";
}

function getDiscountPercent(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const discount = getDiscountPercent(product.originalPrice, product.price);
  const imageSrc = getProductImage(product.slug);

  return (
    <div className="group relative bg-white rounded-3xl border border-edge overflow-hidden hover:border-brand/40 transition-all duration-300 hover:shadow-[var(--card-shadow-hover)]">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block relative">
        <div className="relative aspect-square overflow-hidden bg-paper">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay CTA on hover */}
          <div className="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(product, 1);
              }}
              className="bg-white text-ink rounded-2xl px-5 py-2.5 font-semibold text-sm hover:bg-brand hover:text-white transition-colors flex items-center gap-2 shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-brand text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discount}%
            </span>
          )}
          {product.badges.slice(0, 1).map((badge) => (
            <span
              key={badge}
              className="bg-ink text-white text-xs font-bold px-2.5 py-1 rounded-full"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Stock warning */}
        {product.stock <= 20 && product.stock > 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-orange-50 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full border border-orange-200">
              Only {product.stock} left
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs font-bold text-ink-muted tracking-widest uppercase mb-1.5">
          {product.category}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-base text-ink hover:text-brand transition-colors leading-tight mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-gray-200 fill-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-ink-2">{product.rating}</span>
          <span className="text-xs text-ink-muted">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-ink">{formatPrice(product.price)}</span>
            <span className="text-sm text-ink-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          </div>
          <button
            onClick={() => addItem(product, 1)}
            className="bg-brand text-white rounded-xl p-2 hover:bg-brand-hover transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
