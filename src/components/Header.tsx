"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/store/cart";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const { getItemCount, toggleCart, state } = useCart();
  const itemCount = getItemCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[rgba(124,58,237,0.1)] shadow-[0_1px_16px_rgba(124,58,237,0.06)]">
        {/*
          Layout trick: relative container, logo flush-left, icons flush-right,
          nav absolutely centred so it never shifts with asymmetric side widths.
        */}
        <div className="relative h-18 md:h-20 w-full  mx-auto px-5 md:px-10 lg:px-16 flex items-center justify-between">

          {/* Logo — left */}
          <Link
            href="/"
           
          >
            <img src="Pastedimage.png" alt="" className="w-20 p-4"/>
          </Link>

          {/* Nav — dead-centre via absolute positioning */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12 absolute left-1/2 -translate-x-1/2">
            {[
              { href: "/products", label: "Shop" },
              // { href: "/about",    label: "Our Story" },
              { href: "/track",    label: "Track Order" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[#374151] hover:text-[#7c3aed] text-[15px] font-medium tracking-wide transition-colors whitespace-nowrap"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Icons — right */}
          <div className="flex items-center gap-0.5 md:gap-1 z-10">
            <button
              className="hidden md:flex p-3 text-[#6b7280] hover:text-[#7c3aed] hover:bg-[#f5f3ff] rounded-lg transition-colors"
              title="Search"
            >
              <Search size={28} />
            </button>
            <button
              className="hidden md:flex p-3 text-[#6b7280] hover:text-[#7c3aed] hover:bg-[#f5f3ff] rounded-lg transition-colors"
              title="Account"
            >
              <User size={28} />
            </button>
            <button
              className="relative p-3 text-[#6b7280] hover:text-[#7c3aed] hover:bg-[#f5f3ff] rounded-lg transition-colors"
              title="Cart"
              onClick={toggleCart}
            >
              <ShoppingBag size={28} />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-[#7c3aed] text-white text-[11px] font-bold rounded-full flex items-center justify-center leading-none">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-3 text-[#6b7280] hover:text-[#7c3aed] hover:bg-[#f5f3ff] rounded-lg transition-colors"
              title="Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-18 z-30 bg-white border-b border-[rgba(124,58,237,0.12)] shadow-[0_8px_32px_rgba(124,58,237,0.08)]">
          <nav className="flex flex-col px-6 py-5">
            {[
              { href: "/products", label: "Shop" },
              { href: "/about",    label: "Our Story" },
              { href: "/track",    label: "Track Order" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[#0f0a1e] text-[18px] font-medium py-5 border-b border-[rgba(124,58,237,0.08)] last:border-0 hover:text-[#7c3aed] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="flex gap-3 pt-6 pb-2">
              <button className="p-3 text-[#6b7280] hover:text-[#7c3aed] hover:bg-[#f5f3ff] rounded-lg transition-colors">
                <Search size={22} />
              </button>
              <button className="p-3 text-[#6b7280] hover:text-[#7c3aed] hover:bg-[#f5f3ff] rounded-lg transition-colors">
                <User size={22} />
              </button>
            </div>
          </nav>
        </div>
      )}

      <CartDrawer isOpen={state.isOpen} />
    </>
  );
}
