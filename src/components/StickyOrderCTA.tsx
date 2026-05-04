"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { Zap } from "lucide-react";

interface StickyOrderCTAProps {
  product: Product;
}

export default function StickyOrderCTA({ product }: StickyOrderCTAProps) {
  const { addItem } = useCart();
  const [visible, setVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Show on scroll down, hide on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleOrderNow = () => {
    addItem(product, 1);
    window.location.href = "/checkout";
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-edge shadow-2xl transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-ink truncate">{product.name}</p>
            <div className="flex items-center gap-2">
              <span className="font-black text-base text-ink">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-ink-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            </div>
          </div>
          <button
            onClick={handleOrderNow}
            className="flex-shrink-0 flex items-center gap-2 bg-brand text-white rounded-2xl px-6 py-3 font-semibold text-sm hover:bg-brand-hover transition-colors shadow-lg shadow-brand/25"
          >
            <Zap className="w-4 h-4" />
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
