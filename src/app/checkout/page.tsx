"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { indianStates } from "@/data/products";
import { Gift, ShieldCheck, Truck, ChevronRight, CreditCard, Banknote, CheckCircle2 } from "lucide-react";

const FREE_GIFT_THRESHOLD = 399;
const COD_CHARGE = 29;

const FREE_GIFTS = [
  {
    id: "ice-roller",
    name: "Ice Roller",
    image: "https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778936807/iceroller_crcbyr.webp",
  },
  {
    id: "face-wash-brush",
    name: "Face Wash Brush",
    image: "https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778936906/shopping_gidbgi.webp",
  },
  {
    id: "hair-scalp-massager",
    name: "Hair Scalp Massager",
    image: "https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778936848/shopping_gq1rhy.webp",
  },
];

interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

function getProductImage(slug: string): string {
  if (slug.includes("ara-ice-bowl"))
    return "https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778867529/DSC04677_g0et5k.jpg";
  if (slug.includes("rose"))
    return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=70";
  if (slug.includes("beetroot"))
    return "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200&q=70";
  if (slug.includes("mint"))
    return "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&q=70";
  return "https://images.unsplash.com/photo-1501173727994-04cbcb2e3af1?w=200&q=70";
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

const inputCls =
  "w-full border border-edge rounded-xl px-4 py-3 text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors bg-white";
const labelCls = "block text-xs font-bold text-ink-2 mb-1.5 uppercase tracking-wide";

export default function CheckoutPage() {
  const { state, getSubtotal, clearCart } = useCart();
  const router = useRouter();
  const { items } = state;

  const [step, setStep] = useState<1 | 2>(1);
  const [savedFormData, setSavedFormData] = useState<CheckoutFormData | null>(null);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = getSubtotal();
  const total = subtotal;
  const codTotal = subtotal + COD_CHARGE;
  const giftUnlocked = subtotal >= FREE_GIFT_THRESHOLD;
  const amountToGift = FREE_GIFT_THRESHOLD - subtotal;

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  // Clear gift selection if cart drops below threshold
  useEffect(() => {
    if (!giftUnlocked) setSelectedGift(null);
  }, [giftUnlocked]);

  const buildOrderItems = () => [
    ...items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price + (item.variant?.additionalPrice ?? 0),
      variant: item.variant?.name,
      sku: item.product.sku,
    })),
    ...(giftUnlocked && selectedGift
      ? [{
          productId: `gift-${selectedGift}`,
          productName: `Free Gift: ${FREE_GIFTS.find((g) => g.id === selectedGift)?.name}`,
          quantity: 1,
          price: 0,
          variant: undefined,
          sku: `GIFT-${selectedGift.toUpperCase()}`,
        }]
      : []),
  ];

  const onStep1Submit = (data: CheckoutFormData) => {
    setSavedFormData(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePayOnline = async () => {
    if (!savedFormData || items.length === 0) return;
    setIsLoading(true);
    try {
      const orderRes = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: buildOrderItems(),
          shippingAddress: { ...savedFormData, country: "India" },
          amount: total,
          freeGift: giftUnlocked && selectedGift ? selectedGift : null,
        }),
      });
      if (!orderRes.ok) throw new Error("Failed to create order");
      const orderData = await orderRes.json();

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "ARA Cold Therapy",
        description: "Cold Therapy Products",
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: savedFormData.fullName,
          email: savedFormData.email,
          contact: savedFormData.phone,
        },
        theme: { color: "#7c3aed" },
        handler: async (response: unknown) => {
          const rzpRes = response as {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          };
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: rzpRes.razorpay_payment_id,
              razorpay_order_id: rzpRes.razorpay_order_id,
              razorpay_signature: rzpRes.razorpay_signature,
              orderId: orderData.orderId,
            }),
          });
          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            const trackId = verifyData.awbCode || verifyData.orderNumber || orderData.orderNumber;
            clearCart();
            router.push(`/track?order=${encodeURIComponent(trackId)}`);
          }
        },
      });
      rzp.open();
    } catch (err) {
      console.error("Online payment error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCOD = async () => {
    if (!savedFormData || items.length === 0) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders/cod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: buildOrderItems(),
          shippingAddress: { ...savedFormData, country: "India" },
          amount: codTotal,
          freeGift: giftUnlocked && selectedGift ? selectedGift : null,
        }),
      });
      if (!res.ok) throw new Error("Failed to place COD order");
      const data = await res.json();
      const trackId = data.awbCode || data.orderNumber;
      clearCart();
      router.push(`/track?order=${encodeURIComponent(trackId)}`);
    } catch (err) {
      console.error("COD order error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-4xl mb-4">🛒</p>
          <h2 className="text-2xl font-black text-ink mb-2">Your cart is empty</h2>
          <p className="text-ink-muted mb-6">Add some products before checking out.</p>
          <a href="/products" className="bg-brand text-white rounded-2xl px-8 py-3.5 font-semibold text-sm hover:bg-brand-hover transition-colors inline-block">
            Shop Now
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-8">
          <div className={`flex items-center gap-2 text-sm font-bold ${step === 1 ? "text-brand" : "text-green-600"}`}>
            {step === 2 ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-black">1</span>
            )}
            Delivery Details
          </div>
          <ChevronRight className="w-4 h-4 text-ink-muted" />
          <div className={`flex items-center gap-2 text-sm font-bold ${step === 2 ? "text-brand" : "text-ink-muted"}`}>
            <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-black ${step === 2 ? "bg-brand text-white" : "bg-edge text-ink-muted"}`}>2</span>
            Payment
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <form onSubmit={handleSubmit(onStep1Submit)} className="flex flex-col gap-5">
                <div className="bg-white rounded-2xl border border-edge p-6">
                  <h2 className="font-bold text-lg text-ink mb-5 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-brand" />
                    Delivery Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Full Name *</label>
                      <input {...register("fullName", { required: "Full name is required" })} className={inputCls} placeholder="Priya Sharma" />
                      {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Phone *</label>
                      <input {...register("phone", { required: "Phone is required", pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit number" } })} className={inputCls} placeholder="9876543210" maxLength={10} />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Email *</label>
                      <input {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" } })} type="email" className={inputCls} placeholder="priya@example.com" />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelCls}>Address *</label>
                      <input {...register("address", { required: "Address is required" })} className={inputCls} placeholder="Flat 12, Building Name, Street" />
                      {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>City *</label>
                      <input {...register("city", { required: "City is required" })} className={inputCls} placeholder="Mumbai" />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>State *</label>
                      <select {...register("state", { required: "State is required" })} className={inputCls}>
                        <option value="">Select State</option>
                        {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
                    </div>
                    <div>
                      <label className={labelCls}>Pincode *</label>
                      <input {...register("pincode", { required: "Pincode is required", pattern: { value: /^\d{6}$/, message: "Enter a valid 6-digit pincode" } })} className={inputCls} placeholder="400001" maxLength={6} />
                      {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode.message}</p>}
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-brand text-white rounded-2xl px-6 py-4 font-bold text-base hover:bg-brand-hover transition-colors shadow-lg shadow-brand/25 flex items-center justify-center gap-2">
                  Continue to Payment
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && savedFormData && (
              <>
                {/* Address summary */}
                <div className="bg-white rounded-2xl border border-edge p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-sm text-ink flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Delivering to
                    </h2>
                    <button onClick={() => setStep(1)} className="text-xs text-brand font-semibold hover:underline">Edit</button>
                  </div>
                  <p className="text-sm font-semibold text-ink">{savedFormData.fullName}</p>
                  <p className="text-sm text-ink-muted">{savedFormData.address}, {savedFormData.city}, {savedFormData.state} — {savedFormData.pincode}</p>
                  <p className="text-sm text-ink-muted">{savedFormData.phone} · {savedFormData.email}</p>
                </div>

                {/* Payment */}
                <div className="bg-white rounded-2xl border border-edge p-6">
                  <h2 className="font-bold text-lg text-ink mb-5 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-brand" />
                    Choose Payment Method
                  </h2>
                  <div className="flex flex-col gap-3">
                    <button onClick={handlePayOnline} disabled={isLoading} className="w-full bg-brand text-white rounded-2xl px-6 py-4 font-bold text-base hover:bg-brand-hover transition-colors shadow-lg shadow-brand/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 shrink-0" />
                        <div className="text-left">
                          <p className="font-bold text-sm">Pay Online</p>
                          <p className="text-xs opacity-80">UPI · Cards · Netbanking · Wallets</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black">{formatPrice(total)}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                    <button onClick={handleCOD} disabled={isLoading} className="w-full bg-white border-2 border-edge text-ink rounded-2xl px-6 py-4 font-bold text-base hover:border-brand hover:text-brand transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Banknote className="w-5 h-5 shrink-0" />
                        <div className="text-left">
                          <p className="font-bold text-sm">Cash on Delivery</p>
                          <p className="text-xs text-ink-muted">Pay when your order arrives · +{formatPrice(COD_CHARGE)} COD fee</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black">{formatPrice(codTotal)}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </button>
                  </div>
                  {isLoading && (
                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-ink-muted">
                      <span className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
                      Processing your order…
                    </div>
                  )}
                </div>

                <p className="text-xs text-ink-muted text-center">
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-green-500" />
                  Secured by Razorpay · SSL Encrypted · 30-Day Returns
                </p>
              </>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-edge p-6 sticky top-24 flex flex-col gap-5">
              <h2 className="font-bold text-base text-ink">Order Summary</h2>

              {/* Items */}
              <ul className="flex flex-col gap-4 pb-5 border-b border-edge">
                {items.map((item) => {
                  const itemPrice = item.product.price + (item.variant?.additionalPrice ?? 0);
                  return (
                    <li key={`${item.product.id}__${item.variant?.id ?? "default"}`} className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-paper shrink-0 relative border border-edge">
                        <Image src={item.variant?.images?.[0] ?? item.product.images?.[0] ?? getProductImage(item.product.slug)} alt={item.product.name} fill unoptimized className="object-cover" />
                        <span className="absolute -top-1.5 -right-1.5 bg-brand text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{item.quantity}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink truncate">{item.product.name}</p>
                        {item.variant && <p className="text-xs text-ink-muted">{item.variant.name}</p>}
                      </div>
                      <span className="text-sm font-bold text-ink shrink-0">{formatPrice(itemPrice * item.quantity)}</span>
                    </li>
                  );
                })}
              </ul>

              {/* Free Gift Section */}
              <div>
                {giftUnlocked ? (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Gift className="w-4 h-4 text-brand" />
                      <p className="text-sm font-bold text-ink">Choose your free gift</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {FREE_GIFTS.map((gift) => (
                        <button
                          key={gift.id}
                          type="button"
                          onClick={() => setSelectedGift(selectedGift === gift.id ? null : gift.id)}
                          className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-colors ${
                            selectedGift === gift.id
                              ? "border-brand bg-brand/5"
                              : "border-edge hover:border-brand/40"
                          }`}
                        >
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-paper">
                            <Image src={gift.image} alt={gift.name} fill className="object-cover" sizes="40px" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-ink">{gift.name}</p>
                            <p className="text-xs text-green-600 font-bold">FREE</p>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${selectedGift === gift.id ? "border-brand bg-brand" : "border-edge"}`}>
                            {selectedGift === gift.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                    {!selectedGift && (
                      <p className="text-xs text-ink-muted mt-2">Tap a gift above to select it</p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-brand/40 bg-brand/5 px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Gift className="w-4 h-4 text-brand" />
                      <p className="text-sm font-bold text-brand">Unlock a free gift!</p>
                    </div>
                    <p className="text-xs text-ink-2 leading-relaxed">
                      Add <span className="font-bold text-ink">{formatPrice(amountToGift)}</span> more to choose a free gift — Ice Roller, Face Wash Brush, or Hair Scalp Massager.
                    </p>
                    <div className="mt-2 h-1.5 rounded-full bg-brand/15 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-brand transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / FREE_GIFT_THRESHOLD) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-ink-muted mt-1">{formatPrice(subtotal)} / {formatPrice(FREE_GIFT_THRESHOLD)}</p>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="flex flex-col gap-2.5 text-sm pt-1 border-t border-edge">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Subtotal</span>
                  <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                {giftUnlocked && selectedGift && (
                  <div className="flex justify-between">
                    <span className="text-ink-muted flex items-center gap-1"><Gift className="w-3.5 h-3.5 text-brand" />{FREE_GIFTS.find((g) => g.id === selectedGift)?.name}</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                )}
                {step === 2 && (
                  <div className="flex justify-between text-amber-700">
                    <span className="flex items-center gap-1"><Banknote className="w-3.5 h-3.5" />COD fee</span>
                    <span className="font-semibold">+{formatPrice(COD_CHARGE)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-edge">
                  <span className="font-black text-base text-ink">Total</span>
                  <span className="font-black text-base text-ink">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Trust */}
              <div className="flex flex-col gap-2 pt-1 border-t border-edge">
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />
                  Payments secured by Razorpay
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-muted">
                  <Truck className="w-4 h-4 text-brand shrink-0" />
                  Free shipping · Delivered in 3–5 business days
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
