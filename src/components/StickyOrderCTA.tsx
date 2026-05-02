"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Product } from "@/types";

interface StickyOrderCTAProps {
  product: Product;
}

export default function StickyOrderCTA({ product }: StickyOrderCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 400;
      setIsVisible(shouldShow);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <Link
      href="/checkout"
      className="fixed bottom-0 left-0 right-0 z-40 w-full bg-[#5b21b6] hover:bg-blue-700 text-white font-bold py-9 text-center text-lg transition-colors animate-in slide-in-from-bottom-0 duration-300"
    >
      Order Now
    </Link>
  );
}
