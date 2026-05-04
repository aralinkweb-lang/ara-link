"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/store/cart";

export default function Header() {
  const { state, toggleCart, getItemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 border-b border-edge backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="ARA" height={40} width={120} className="object-contain" priority />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-sm font-semibold text-ink-2 hover:text-brand transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/track"
              className="text-sm font-semibold text-ink-2 hover:text-brand transition-colors"
            >
              Track Order
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-ink-2 hover:text-brand transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="md:hidden p-2 text-ink-2 hover:text-brand transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-edge bg-white/98 backdrop-blur-md">
          <nav className="flex flex-col px-4 py-4 gap-4">
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-semibold text-ink-2 hover:text-brand transition-colors py-2 border-b border-edge-light"
            >
              Shop
            </Link>
            <Link
              href="/track"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-semibold text-ink-2 hover:text-brand transition-colors py-2"
            >
              Track Order
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
