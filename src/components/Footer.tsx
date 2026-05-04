import Link from "next/link";
import { Globe, MessageCircle, Play } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="font-black text-3xl text-white tracking-tight mb-2">
                         <Image src="/logo.png" alt="ARA" height={40} width={120} className="object-contain" priority />
            </div>
            <p className="text-sm font-semibold text-white/50 tracking-widest uppercase mb-4">
              Cold Therapy · Made in India
            </p>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              The morning ritual your skin has been waiting for. Premium cold
              therapy tools crafted for the intentional Indian skincare routine.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Twitter / X"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Play className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-5">
              Shop
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products/ara-ice-bowl"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  ARA Face Ice Bowl
                </Link>
              </li>
              <li>
                <Link
                  href="/products/combo-starter"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Starter Ritual Combo
                </Link>
              </li>
              <li>
                <Link
                  href="/products/combo-pro"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Pro Ritual Combo
                </Link>
              </li>
              <li>
                <Link
                  href="/checkout"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-5">
              Support
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/track"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@aracoltherapy.com"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/#returns"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Row */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} ARA Cold Therapy. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Made with intention · India
          </p>
        </div>
      </div>
    </footer>
  );
}
