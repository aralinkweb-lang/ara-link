import Link from "next/link";
import { Globe, MessageCircle, Play } from "lucide-react";
import Image from "next/image";
import { SocialIcon } from "next-social-icons";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="font-black text-3xl text-white tracking-tight mb-2">
                         <Image src="https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778956881/4e7b03a0-d766-4c8e-b025-3079c7fd0941.png" alt="ARA" height={40} width={120} className="object-contain" priority />
            </div>
            
            {/* Statement Section */}
<div className="mt-5 flex flex-col items-center md:items-start text-center md:text-left">

  <div className="space-y-1 leading-none">
    <p className="text-3xl md:text-4xl font-light text-white">
      We don't do
    </p>

    <p className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
      BLACK MAGIC
    </p>

    <p className="text-3xl md:text-4xl font-light text-white">
      No overnight results
    </p>

    <p className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight">
      GUARANTEE
    </p>
  </div>
</div>
            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://www.instagram.com/aralinkpvtltd?igsh=MTdwanYwZ3FrYzY2&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Instagram"
              >
               <SocialIcon size={64} platform="instagram" inverse />
              </a>
              <a
                href="https://wa.me/917383940384"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Twitter / X"
              >
                <SocialIcon size={64} platform="whatsapp" inverse />
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
            &copy; {new Date().getFullYear()} Aralink Private Limited. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Made with intention · India
          </p>
        </div>
      </div>
    </footer>
  );
}
