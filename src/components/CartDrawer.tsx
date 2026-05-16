"use client";

import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, ShoppingBag } from "lucide-react";
import QuantitySelector from "./QuantitySelector";

export default function CartDrawer() {
  const { state, closeCart, removeItem, updateQuantity, getSubtotal, getItemCount } =
    useCart();

  const { isOpen, items } = state;
  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[400px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-edge">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand" />
            <h2 className="font-bold text-lg text-ink">
              Cart
              {itemCount > 0 && (
                <span className="ml-2 text-sm font-medium text-ink-muted">
                  ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-full hover:bg-paper transition-colors text-ink-muted hover:text-ink"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-paper flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-ink-muted" />
              </div>
              <div>
                <p className="font-semibold text-ink mb-1">Your cart is empty</p>
                <p className="text-sm text-ink-muted">
                  Add products to start your cold therapy ritual.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="bg-brand text-white rounded-2xl px-6 py-3 font-semibold text-sm hover:bg-brand-hover transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {items.map((item) => {
                const itemPrice = item.product.price + (item.variant?.additionalPrice ?? 0);
                return (
                  <li
                    key={`${item.product.id}__${item.variant?.id ?? "default"}`}
                    className="flex gap-4 pb-5 border-b border-edge-light last:border-0"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-paper shrink-0 relative">
                      <Image
                        src={getProductImage(item.product.slug)}
                        alt={item.product.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-ink leading-tight mb-1 truncate">
                        {item.product.name}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-ink-muted mb-2">
                          {item.variant.name}
                        </p>
                      )}
                      <p className="text-sm font-bold text-brand mb-3">
                        {formatPrice(itemPrice)}
                      </p>

                      <div className="flex items-center justify-between">
                        <QuantitySelector
                          value={item.quantity}
                          onChange={(qty) =>
                            updateQuantity(item.product.id, qty, item.variant?.id)
                          }
                          min={1}
                          max={item.product.stock}
                        />
                        <button
                          onClick={() =>
                            removeItem(item.product.id, item.variant?.id)
                          }
                          className="p-1.5 text-ink-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-edge bg-paper">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-ink-2 font-medium">Subtotal</span>
              <span className="text-lg font-bold text-ink">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-ink-muted mb-4">
              Shipping calculated at checkout. Free shipping on all orders.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-brand text-white rounded-2xl px-6 py-3.5 font-semibold text-sm text-center hover:bg-brand-hover transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}

function getProductImage(slug: string): string {
  if (slug.includes("ara-ice-bowl"))
    return "https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778867529/DSC04677_g0et5k.jpg";
  if (slug.includes("rose"))
    return "https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778867523/enhanced_02_mthaft.png";
  if (slug.includes("beetroot"))
    return "https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778867521/enhanced_04_qmz5l7.png";
  if (slug.includes("mint"))
    return "https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778867521/DSC07076_fbwzgq.jpg";
  if (slug.includes("orange"))
    return "https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778867520/enhanced_5_xhtujz.png";
  return "https://images.unsplash.com/photo-1501173727994-04cbcb2e3af1?w=400&q=80";
}
