// ────────────────────────────────────────────────────────────────────────────
//  Coupon configuration
// ────────────────────────────────────────────────────────────────────────────
//
//  Edit this file to add, remove, or change coupon codes — and to tweak how
//  each coupon behaves.
//
//  Each coupon has:
//    code           — the case-insensitive code customers will type
//    type           — "percentage" (off subtotal) or "flat" (₹ off)
//    value          — number that pairs with `type`
//    minSubtotal    — (optional) minimum cart subtotal required
//    maxDiscount    — (optional) cap the discount amount in ₹
//    description    — (optional) short text shown to the customer
//    expiresAt      — (optional) ISO date after which the coupon is invalid
//    enabled        — (optional, default true) flip to false to disable quickly
//
//  When you want to add a new coupon, just push a new object into the array.
// ────────────────────────────────────────────────────────────────────────────

export interface Coupon {
  code: string;
  type: "percentage" | "flat";
  value: number;
  minSubtotal?: number;
  maxDiscount?: number;
  description?: string;
  expiresAt?: string;
  enabled?: boolean;
}

export const coupons: Coupon[] = [
  {
    code: "COLDTHERAPY",
    type: "percentage",
    value: 10,
    description: "10% off your order",
  },
  {
    code: "WELCOME15",
    type: "percentage",
    value: 15,
    maxDiscount: 200,
    description: "15% off (max ₹200) — first-time customers",
  },
  {
    code: "ARAFRESH",
    type: "flat",
    value: 100,
    minSubtotal: 499,
    description: "₹100 off on orders above ₹499",
  },
  {
    code: "ICEBOWL50",
    type: "flat",
    value: 50,
    description: "Flat ₹50 off",
  },
  {
    code: "COMBO20",
    type: "percentage",
    value: 20,
    minSubtotal: 599,
    maxDiscount: 300,
    description: "20% off (max ₹300) on combo orders ₹599+",
  },
];

export interface CouponResult {
  valid: boolean;
  discount: number;
  coupon?: Coupon;
  error?: string;
}

/**
 * Validate a coupon code against the current cart subtotal and return
 * the discount amount in ₹. The result is safe to call from any component.
 */
export function applyCoupon(rawCode: string, subtotal: number): CouponResult {
  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return { valid: false, discount: 0, error: "Enter a coupon code" };
  }

  const coupon = coupons.find((c) => c.code.toUpperCase() === code);
  if (!coupon) {
    return { valid: false, discount: 0, error: "Invalid coupon code" };
  }

  if (coupon.enabled === false) {
    return { valid: false, discount: 0, error: "This coupon is no longer active" };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { valid: false, discount: 0, error: "This coupon has expired" };
  }

  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return {
      valid: false,
      discount: 0,
      error: `Minimum order ₹${coupon.minSubtotal} required for this code`,
    };
  }

  let discount =
    coupon.type === "percentage"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;

  if (coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  // Never let the discount exceed the subtotal
  discount = Math.min(discount, subtotal);

  return { valid: true, discount, coupon };
}
