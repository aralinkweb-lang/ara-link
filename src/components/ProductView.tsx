"use client";

import { useState } from "react";
import { Star, Share2, Heart, Check, Truck, Shield, RotateCcw } from "lucide-react";
import type { Product, ProductVariant } from "@/types";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

interface ProductViewProps {
  product: Product;
}

export default function ProductView({ product }: ProductViewProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant);
  };

  return (
    <div className="bg-white">
      {/* Image area */}
      <div className="w-full bg-[#faf8ff]">
        <div className="w-full aspect-square max-h-[520px] flex items-center justify-center relative overflow-hidden bg-linear-to-br from-[#f5f3ff] via-[#ede9fe] to-[#f5f3ff]">
          <div className="absolute inset-0 grid-overlay" />
          <div className="absolute inset-0 glow-center" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] border border-[rgba(124,58,237,0.1)] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[rgba(124,58,237,0.06)] rounded-full" />
          <div className="animate-float">
            <span className="text-[150px] select-none">🧊</span>
          </div>
        </div>

        
      </div>

      {/* Product Info */}
      <div className="max-w-3xl mx-auto p-6 md:p-10">
        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          <span className="badge">{product.category}</span>
          {product.badges.includes("Limited Stock") && (
            <span className="badge badge-gold">🔥 Limited Stock</span>
          )}
          <span className="badge badge-red">Only {product.stock} Left</span>
          <button className="ml-auto p-2.5 text-[#9ca3af] hover:text-[#6b7280] hover:bg-[#f5f3ff] rounded-lg transition-colors">
            <Share2 size={18} />
          </button>
        </div>

        {/* Name */}
        <h1 className="font-serif text-[36px] md:text-[44px] lg:text-5xl font-light leading-[1.1] text-[#0f0a1e] mb-3">
          {product.name}
        </h1>
        <p className="text-base md:text-lg text-[#6b7280] tracking-wide mb-6 leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(product.rating) ? "fill-[#c9a96e] text-[#c9a96e]" : "fill-[#e5e7eb] text-[#e5e7eb]"}
              />
            ))}
          </div>
          <span className="text-sm text-[#6b7280] font-mono">{product.rating}</span>
          <div className="w-px h-4 bg-[rgba(124,58,237,0.15)]" />
          <span className="text-sm text-[#6b7280] font-mono">{product.reviewCount} reviews</span>
          <div className="w-px h-4 bg-[rgba(124,58,237,0.15)]" />
          <span className="text-sm text-[#7c3aed] font-medium">✓ Verified</span>
        </div>

        <div className="h-px bg-[rgba(124,58,237,0.08)] my-6" />

        {/* Variants */}
        {/* {product.variants && product.variants.length > 0 && (
          <>
            <p className="font-mono text-[12px] tracking-[0.22em] uppercase text-[#6b7280] mb-4 font-medium">
              Colour
            </p>
            <div className="flex gap-3 flex-wrap mb-6">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={`w-12 h-12 rounded-full cursor-pointer transition-all ${
                    selectedVariant?.id === variant.id
                      ? "ring-2 ring-[#7c3aed] ring-offset-2 ring-offset-white"
                      : "ring-1 ring-[rgba(124,58,237,0.2)] hover:ring-[#7c3aed]"
                  }`}
                  style={{ background: variant.colorCode }}
                  title={variant.name}
                />
              ))}
            </div>
          </>
        )} */}

        {/* Quantity */}
        <p className="font-mono text-[12px] tracking-[0.22em] uppercase text-[#6b7280] mb-4 font-medium">
          Quantity
        </p>
        <div className="flex items-center border border-[rgba(124,58,237,0.2)] rounded-lg w-fit mb-6 overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 text-[#6b7280] hover:bg-[#f5f3ff] hover:text-[#7c3aed] transition-colors text-xl"
          >
            −
          </button>
          <span className="w-12 text-center font-mono text-base text-[#0f0a1e] font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="w-12 h-12 text-[#6b7280] hover:bg-[#f5f3ff] hover:text-[#7c3aed] transition-colors text-xl"
          >
            +
          </button>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-2 flex-wrap">
          <span className="font-serif text-[44px] md:text-5xl font-light text-[#0f0a1e] leading-none">
            {formatPrice(product.price)}
          </span>
          <span className="text-xl text-[#9ca3af] line-through">
            {formatPrice(product.originalPrice)}
          </span>
          <span className="badge badge-purple">Save {formatPrice(product.originalPrice - product.price)}</span>
        </div>
        <p className="text-sm text-[#9ca3af] mb-7">Inclusive of all taxes · Free shipping</p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 mb-7 items-center">
          <button onClick={handleAddToCart} className="btn-primary w-70 mb-2 ">
            Order Now
          </button>
          
        </div><br />

        {/* Shipping banner */}
        <div className="flex items-center justify-center gap-2 bg-[#f5f3ff] border border-[rgba(124,58,237,0.15)] rounded-lg py-4 px-5 font-mono text-[12px] tracking-[0.14em] uppercase text-[#7c3aed] mb-6 font-medium">
          <Truck size={16} />
          Free shipping across India · Arrives in 3–5 days
        </div>
<br />
        {/* Guarantees */}
        <div className="grid grid-cols-3 divide-x divide-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.1)] rounded-xl overflow-hidden">
          {[
            { icon: <RotateCcw size={20} />, label: "30-Day\nReturns" },
            { icon: <Shield size={20} />,    label: "Secure\nPayments" },
            { icon: <Check size={20} />,     label: "Derma\nTested" },
          ].map(({ icon, label }) => (
            <div key={label} className="bg-[#faf8ff] py-5 px-3 text-center">
              <div className="flex justify-center mb-2 text-[#7c3aed]">{icon}</div>
              <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#6b7280] leading-relaxed whitespace-pre-line font-medium">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
