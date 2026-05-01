"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Truck, Shield, RotateCcw, X, Plus, Minus, Tag } from "lucide-react";
import { useCart, getItemKey } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { indianStates, addOns } from "@/data/products";
import { applyCoupon, type Coupon } from "@/lib/coupons";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string; amount: number; currency: string;
  name: string; description: string; order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  modal?: { ondismiss?: () => void };
}
interface RazorpayInstance { open: () => void }
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { state, getSubtotal, clearCart, removeItem, updateQuantity } = useCart();
  const { items } = state;

  const [loading, setLoading] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string>("");
  const [formData, setFormData] = useState({
    fullName: "", phone: "", email: "",
    address: "", city: "", state: "", pincode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = getSubtotal();
  const addOnsTotal = selectedAddOns.reduce((sum, id) => {
    const addon = addOns.find((a) => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);
  const preDiscountTotal = subtotal + addOnsTotal;
  const couponDiscount = appliedCoupon
    ? applyCoupon(appliedCoupon.code, preDiscountTotal).discount
    : 0;
  const total = Math.max(0, preDiscountTotal - couponDiscount);

  const handleApplyCoupon = () => {
    const result = applyCoupon(couponInput, preDiscountTotal);
    if (!result.valid || !result.coupon) {
      setAppliedCoupon(null);
      setCouponError(result.error || "Invalid coupon");
      return;
    }
    setAppliedCoupon(result.coupon);
    setCouponError("");
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!formData.fullName.trim()) e.fullName = "Name is required";
    if (!formData.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) e.phone = "Enter valid 10-digit number";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Enter valid email";
    if (!formData.address.trim()) e.address = "Address is required";
    if (!formData.city.trim()) e.city = "City is required";
    if (!formData.state) e.state = "State is required";
    if (!formData.pincode.trim()) e.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode.replace(/\D/g, ""))) e.pincode = "Enter valid 6-digit pincode";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const loadRazorpay = () => new Promise<boolean>((resolve) => {
    if (typeof window.Razorpay !== "undefined") { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const handlePayment = async () => {
    if (!validateForm()) return;
    if (items.length === 0) { alert("Your cart is empty"); return; }
    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id, productName: item.product.name,
        quantity: item.quantity, price: item.product.price,
        variant: item.variant?.name, sku: item.product.sku,
      }));
      selectedAddOns.forEach((id) => {
        const addon = addOns.find((a) => a.id === id);
        if (addon) orderItems.push({
          productId: addon.id, productName: addon.name, quantity: 1,
          price: addon.price, variant: undefined, sku: `ADDON-${addon.id.toUpperCase()}`,
        });
      });
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, items: orderItems, shippingAddress: { ...formData, country: "India" } }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to create order");
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error("Failed to load payment gateway");
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: total * 100, currency: "INR",
        name: "ARA Skincare", description: "Cold Therapy Products",
        order_id: data.razorpayOrderId,
        handler: async (response: RazorpayResponse) => {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderId, ...response }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) { clearCart(); router.push(`/track?order=${data.orderNumber}`); }
          else alert("Payment verification failed. Please contact support.");
        },
        prefill: { name: formData.fullName, email: formData.email, contact: formData.phone },
        theme: { color: "#7c3aed" },
        modal: { ondismiss: () => setLoading(false) },
      };
      new window.Razorpay(options).open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="text-7xl md:text-9xl mb-7">🧊</div>
        <h1 className="font-serif text-3xl md:text-4xl text-[#0f0a1e] mb-4">Your cart is empty</h1>
        <p className="text-base md:text-lg text-[#6b7280] mb-8">Add some products to get started</p>
        <Link href="/products" className="btn-primary">Shop Now</Link>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `input${errors[field] ? " !border-[#dc2626]" : ""}`;

  const trustItems = [
    { icon: <Truck size={18} />,     label: "Free Shipping" },
    { icon: <RotateCcw size={18} />, label: "30-Day Returns" },
    { icon: <Shield size={18} />,    label: "Secure Pay" },
  ];

  return (
    <div className="bg-[#faf8ff] min-h-screen">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-[rgba(124,58,237,0.1)] shadow-[0_1px_8px_rgba(124,58,237,0.06)] px-5 md:px-10 lg:px-16 py-5">
        <div className="flex items-center gap-4 max-w-[1400px] mx-auto">
          <Link href="/products" className="text-[#9ca3af] hover:text-[#7c3aed] transition-colors">
            <ArrowLeft size={22} />
          </Link>
          <h1 className="font-serif text-xl md:text-2xl text-[#0f0a1e]">Checkout</h1>
        </div>
      </div>

      <div className=" px-5 py-10 md:px-10 md:py-14 lg:px-16 lg:py-16">
        
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center justify-center">

          {/* ── Left — Form ─────────────────────────────────────── */}
          <div className="flex-1 lg:max-w-xl order-2 lg:order-1">
            <br />
            <div className="bg-white border border-[rgba(124,58,237,0.1)] rounded-2xl p-7 md:p-9 shadow-[0_2px_16px_rgba(124,58,237,0.06)]">
              <h2 className="font-mono text-[13px] tracking-[0.18em] uppercase text-[#7c3aed] mb-6 font-semibold">
                Delivery Details
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="block font-mono text-[11px] tracking-[0.16em] uppercase text-[#6b7280] mb-2 font-medium">Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                    className={inputClass("fullName")} placeholder="Your full name" />
                  {errors.fullName && <p className="text-sm text-[#dc2626] mt-1.5">{errors.fullName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block font-mono text-[11px] tracking-[0.16em] uppercase text-[#6b7280] mb-2 font-medium">Phone *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                      className={inputClass("phone")} placeholder="10-digit mobile" />
                    {errors.phone && <p className="text-sm text-[#dc2626] mt-1.5">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] tracking-[0.16em] uppercase text-[#6b7280] mb-2 font-medium">Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange}
                      className={inputClass("email")} placeholder="your@email.com" />
                    {errors.email && <p className="text-sm text-[#dc2626] mt-1.5">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] tracking-[0.16em] uppercase text-[#6b7280] mb-2 font-medium">Address *</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange}
                    className={inputClass("address")} placeholder="House/Flat, Street, Area" />
                  {errors.address && <p className="text-sm text-[#dc2626] mt-1.5">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block font-mono text-[11px] tracking-[0.16em] uppercase text-[#6b7280] mb-2 font-medium">City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange}
                      className={inputClass("city")} placeholder="City" />
                    {errors.city && <p className="text-sm text-[#dc2626] mt-1.5">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block font-mono text-[11px] tracking-[0.16em] uppercase text-[#6b7280] mb-2 font-medium">PIN Code *</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange}
                      className={inputClass("pincode")} placeholder="6-digit PIN" />
                    {errors.pincode && <p className="text-sm text-[#dc2626] mt-1.5">{errors.pincode}</p>}
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] tracking-[0.16em] uppercase text-[#6b7280] mb-2 font-medium">State *</label>
                  <select name="state" value={formData.state} onChange={handleChange} className={inputClass("state")}>
                    <option value="">Select State</option>
                    {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-sm text-[#dc2626] mt-1.5">{errors.state}</p>}
                </div>
              </div>

              {/* Trust row */}
              <div className="grid grid-cols-3 divide-x divide-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.1)] rounded-xl overflow-hidden mt-8">
                {trustItems.map(({ icon, label }) => (
                  <div key={label} className="bg-[#faf8ff] py-4 px-2 text-center">
                    <div className="flex justify-center mb-1.5 text-[#7c3aed]">{icon}</div>
                    <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#6b7280] font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right — Order Summary ─────────────────────────── */}
          <div className="lg:w-[420px] xl:w-[460px] order-1 lg:order-2"><br />
            <div className="lg:sticky lg:top-28 bg-white border border-[rgba(124,58,237,0.1)] rounded-2xl p-7 shadow-[0_2px_16px_rgba(124,58,237,0.06)]">
              <h2 className="font-mono text-[13px] tracking-[0.18em] uppercase text-[#7c3aed] mb-5 font-semibold">
                Order Summary
              </h2>

              {/* Cart items */}
              <div className="space-y-3.5 mb-6">
                {items.map((item) => (
                  <div key={getItemKey(item)} className="flex gap-3.5 p-4 bg-[#faf8ff] border border-[rgba(124,58,237,0.08)] rounded-xl">
                    <div className="w-16 h-16 bg-[#f5f3ff] rounded-lg flex items-center justify-center text-2xl shrink-0">
                      🧊
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <p className="text-[15px] font-medium text-[#0f0a1e] truncate">{item.product.name}</p>
                          {item.variant && <p className="text-sm text-[#6b7280] mt-0.5">{item.variant.name}</p>}
                        </div>
                        <button onClick={() => removeItem(item.product.id, item.variant?.id)}
                          className="text-[#9ca3af] hover:text-[#dc2626] p-1.5 rounded transition-colors shrink-0">
                          <X size={16} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-2.5">
                        <div className="flex items-center border border-[rgba(124,58,237,0.2)] rounded-lg overflow-hidden">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                            className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f5f3ff] hover:text-[#7c3aed] transition-colors">
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-mono font-medium text-[#0f0a1e]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                            className="w-8 h-8 flex items-center justify-center text-[#6b7280] hover:bg-[#f5f3ff] hover:text-[#7c3aed] transition-colors">
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="font-semibold text-[#0f0a1e] text-base">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add-ons */}
              {/* <div className="mb-6">
                <h3 className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#9ca3af] mb-3 font-medium">Add to Your Order</h3>
                <div className="space-y-2.5">
                  {addOns.slice(0, 2).map((addon) => {
                    const isSelected = selectedAddOns.includes(addon.id);
                    return (
                      <div key={addon.id} onClick={() => toggleAddOn(addon.id)}
                        className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#faf8ff] border-[#7c3aed] shadow-[0_0_0_2px_rgba(124,58,237,0.08)]"
                            : "bg-white border-[rgba(124,58,237,0.12)] hover:border-[rgba(124,58,237,0.28)]"
                        }`}>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs shrink-0 transition-all ${
                          isSelected ? "bg-[#7c3aed] border-[#7c3aed] text-white" : "border-[rgba(124,58,237,0.25)]"
                        }`}>
                          {isSelected && "✓"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-medium text-[#0f0a1e] truncate">{addon.name}</p>
                          <p className="text-sm text-[#6b7280]">
                            {formatPrice(addon.price)}{" "}
                            <span className="line-through text-[#9ca3af]">{formatPrice(addon.originalPrice)}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div> */}

              <div className="h-px bg-[rgba(124,58,237,0.08)] my-5" />

              {/* Coupon */}
              <div className="mb-6">
                <h3 className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#9ca3af] mb-2.5 flex items-center gap-1.5 font-medium">
                  <Tag size={13} /> Coupon Code
                </h3>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3.5 bg-[#f0fdf4] border border-[#86efac] rounded-xl">
                    <div className="min-w-0">
                      <p className="text-[15px] font-semibold text-[#15803d]">{appliedCoupon.code}</p>
                      {appliedCoupon.description && (
                        <p className="text-sm text-[#15803d]/80 truncate">{appliedCoupon.description}</p>
                      )}
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-sm text-[#15803d] hover:text-[#dc2626] font-medium transition-colors shrink-0 ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2.5">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
                        placeholder="Enter coupon"
                        className="input flex-1 uppercase tracking-wider"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        type="button"
                        className="btn-secondary px-5 whitespace-nowrap"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-[#dc2626] mt-2">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="h-px bg-[rgba(124,58,237,0.08)] my-5" />

              {/* Totals */}
              <div className="space-y-2.5 mb-6">
                <div className="flex justify-between text-[15px]">
                  <span className="text-[#6b7280]">Subtotal</span>
                  <span className="font-medium text-[#0f0a1e]">{formatPrice(subtotal)}</span>
                </div>
                {addOnsTotal > 0 && (
                  <div className="flex justify-between text-[15px]">
                    <span className="text-[#6b7280]">Add-ons</span>
                    <span className="font-medium text-[#0f0a1e]">{formatPrice(addOnsTotal)}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[15px]">
                    <span className="text-[#15803d]">Discount ({appliedCoupon?.code})</span>
                    <span className="text-[#15803d] font-medium">−{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[15px]">
                  <span className="text-[#6b7280]">Shipping</span>
                  <span className="text-[#7c3aed] font-semibold">FREE</span>
                </div>
                <div className="h-px bg-[rgba(124,58,237,0.08)] my-1" />
                <div className="flex justify-between items-center pt-1">
                  <span className="font-semibold text-[#0f0a1e] text-base">Total</span>
                  <span className="font-serif text-3xl font-light text-[#0f0a1e]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Pay button */}
              <button onClick={handlePayment} disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                <Lock size={16} />
                {loading ? "Processing..." : `Pay Securely — ${formatPrice(total)}`}
              </button>
              <p className="text-center text-sm text-[#9ca3af] mt-3.5 leading-relaxed">
                Secured by Razorpay · 30-day returns · Your data is safe
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
