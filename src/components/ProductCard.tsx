"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="card overflow-hidden h-full flex flex-col">
        {/* Image area */}
        <div className="aspect-square bg-linear-to-br from-[#f5f3ff] via-[#ede9fe] to-[#f5f3ff] relative overflow-hidden">
          <div className="absolute inset-0 grid-overlay" />
          <div className="absolute inset-0 glow-center" />

          {/* Product emoji/image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-500 animate-float">
              🧊
            </span>
          </div>

          {/* Top-left badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.badges.includes("Limited Stock") && (
              <span className="badge badge-gold">🔥 Limited</span>
            )}
            {product.stock < 20 && (
              <span className="badge badge-red">Only {product.stock} Left</span>
            )}
          </div>

          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-4 right-4">
              <span className="badge badge-purple">-{discount}%</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 md:p-6 flex flex-col flex-1">
          <p className="font-mono text-[11px] md:text-[12px] tracking-[0.18em] uppercase text-[#7c3aed] mb-2 font-medium">
            {product.category}
          </p>
          <h3 className="font-serif text-lg md:text-xl font-medium text-[#0f0a1e] mb-2 group-hover:text-[#7c3aed] transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-[14px] md:text-[15px] text-[#6b7280] mb-4 line-clamp-2 flex-1 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={
                    i < Math.floor(product.rating)
                      ? "fill-[#c9a96e] text-[#c9a96e]"
                      : "text-[#e5e7eb] fill-[#e5e7eb]"
                  }
                />
              ))}
            </div>
            <span className="font-mono text-[12px] text-[#6b7280]">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2.5 mt-auto">
            <span className="font-semibold text-xl text-[#0f0a1e]">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[15px] text-[#9ca3af] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
