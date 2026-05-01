"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Package, Truck, CheckCircle, MapPin, Phone, Mail, ArrowRight } from "lucide-react";

interface TrackingActivity {
  date: string;
  status: string;
  activity: string;
  location: string;
}

interface OrderDetails {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  items: Array<{ productName: string; quantity: number; price: number }>;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    email: string;
  };
  awbCode?: string;
  courierName?: string;
  tracking?: TrackingActivity[];
  createdAt: string;
}

function OrderTracker() {
  const searchParams = useSearchParams();
  const orderParam = searchParams.get("order");

  const [orderNumber, setOrderNumber] = useState(orderParam || "");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [error, setError] = useState("");

  const handleTrack = useCallback(async () => {
    if (!orderNumber.trim()) { setError("Please enter an order number"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders?orderNumber=${orderNumber}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        if (data.order.awbCode) {
          const trackRes = await fetch(`/api/delhivery/track?awb=${data.order.awbCode}`);
          const trackData = await trackRes.json();
          if (trackData.success) {
            setOrder((prev) => prev ? { ...prev, tracking: trackData.tracking } : null);
          }
        }
      } else {
        setError("Order not found. Please check your order number.");
      }
    } catch {
      setError("Failed to fetch order details");
    } finally {
      setLoading(false);
    }
  }, [orderNumber]);

  useEffect(() => {
    if (orderParam) handleTrack();
  }, [orderParam, handleTrack]);

  const getStatusStep = (status: string) => {
    return ["confirmed", "processing", "shipped", "delivered"].indexOf(status.toLowerCase()) + 1;
  };

  return (
   <div className="bg-[#faf8ff] min-h-screen flex justify-center">
    <div className="px-5 py-16 md:px-12 md:py-24 lg:px-16 lg:py-[90px]  mx-auto">
        <div className="font-mono text-[12px] md:text-[13px] tracking-[0.26em] uppercase text-[#7c3aed] flex items-center gap-3 font-medium before:content-[''] before:w-7 md:before:w-10 before:h-[1.5px] before:bg-[#7c3aed] before:rounded-full before:shrink-0 mb-5">Order Tracking</div>
        <h1 className="font-serif text-[36px] md:text-5xl font-light leading-[1.1] text-[#0f0a1e] mb-8">
          Track your<br />
          <em className="italic text-[#7c3aed]">order</em>
        </h1>

        {/* Search */}
        <div className="mb-12">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              placeholder="Enter order number (e.g., ARA-XXXXX)"
              className="w-full py-[14px] px-4 bg-white border-[1.5px] border-[rgba(124,58,237,0.2)] text-[#0f0a1e] font-sans text-[15px] font-normal rounded-[10px] transition-[border-color,box-shadow] duration-200 outline-none leading-[1.4] placeholder:text-[#9ca3af] focus:border-[#7c3aed] focus:shadow-[0_0_0_3px_rgba(124,58,237,0.1)] flex-1"
            />
            <button
  onClick={handleTrack}
  disabled={loading}
  className="w-fit sm:w-auto inline-flex items-center justify-center bg-[#7c3aed] text-white font-sans font-semibold text-[13px] md:text-sm tracking-[0.12em] uppercase py-4 px-10 md:px-12 border-none rounded-[12px] cursor-pointer transition-all duration-220 text-center no-underline leading-none m-3 hover:bg-[#5b21b6] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(124,58,237,0.28)] active:translate-y-0"
>
  {loading ? "..." : "Track"}
</button>
          </div>
          {error && <p className="text-sm text-[#dc2626] mt-2.5">{error}</p>}
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-5 animate-fade-in">

            {/* Confirmed banner */}
            {order.paymentStatus === "paid" && order.status === "confirmed" && (
              <div className="bg-[#f5f3ff] border border-[rgba(124,58,237,0.2)] rounded-xl p-7 text-center">
                <div className="text-5xl mb-4">🧊</div>
                <h3 className="font-serif text-2xl text-[#0f0a1e] mb-2.5">Order Confirmed!</h3>
                <p className="text-base text-[#6b7280]">
                  Your ARA products are being prepared. You&apos;ll receive tracking updates soon.
                </p>
              </div>
            )}

            {/* Order info card */}
            <div className="bg-white border border-[rgba(124,58,237,0.1)] rounded-[14px] shadow-[0_1px_6px_rgba(0,0,0,0.04)] transition-all duration-[250ms] hover:border-[rgba(124,58,237,0.2)] hover:shadow-[0_6px_28px_rgba(124,58,237,0.1)] hover:-translate-y-0.5 p-7">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-mono text-[12px] tracking-[0.18em] uppercase text-[#7c3aed] mb-1.5 font-medium">Order Number</p>
                  <p className="font-serif text-xl text-[#0f0a1e]">{order.orderNumber}</p>
                </div>
                <span className={`inline-block font-mono text-[11px] tracking-[0.12em] uppercase py-1.25 px-3 border rounded-full leading-[1.4] ${
                  order.status === "delivered" ? "border-[rgba(124,58,237,0.25)] text-[#7c3aed] bg-[rgba(124,58,237,0.07)]" :
                  order.status === "shipped"   ? "border-[rgba(201,169,110,0.35)] text-[#a0763a] bg-[rgba(201,169,110,0.08)]" :
                                                 "border-[rgba(220,38,38,0.3)] text-[#dc2626] bg-[rgba(220,38,38,0.06)]"
                }`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-[#9ca3af] mb-7">
                Ordered on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>

              {/* Progress steps */}
              <div className="relative">
                <div className="flex justify-between mb-2 relative z-10">
                  {["Confirmed", "Processing", "Shipped", "Delivered"].map((step, i) => {
                    const currentStep = getStatusStep(order.status);
                    const isActive = i + 1 <= currentStep;
                    const isCurrent = i + 1 === currentStep;
                    return (
                      <div key={step} className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2.5 transition-all ${
                          isActive ? "bg-[#7c3aed] text-white" : "bg-[#f5f3ff] text-[#9ca3af] border border-[rgba(124,58,237,0.15)]"
                        } ${isCurrent ? "ring-2 ring-[#7c3aed] ring-offset-2" : ""}`}>
                          {i === 0 && <CheckCircle size={16} />}
                          {i === 1 && <Package size={16} />}
                          {i === 2 && <Truck size={16} />}
                          {i === 3 && <MapPin size={16} />}
                        </div>
                        <span className={`text-[11px] font-mono tracking-[0.1em] uppercase font-medium ${isActive ? "text-[#7c3aed]" : "text-[#9ca3af]"}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {/* Progress line */}
                <div className="absolute top-5 left-10 right-10 h-0.5 bg-[rgba(124,58,237,0.1)]">
                  <div
                    className="h-full bg-[#7c3aed] transition-all"
                    style={{ width: `${((getStatusStep(order.status) - 1) / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* Courier info */}
              {order.awbCode && (
                <div className="mt-7 bg-[#faf8ff] border border-[rgba(124,58,237,0.1)] rounded-lg p-5">
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#9ca3af] mb-2.5 font-medium">Shipment Details</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-base font-medium text-[#0f0a1e]">{order.courierName || "Delhivery"}</p>
                      <p className="text-sm text-[#6b7280] mt-0.5">AWB: {order.awbCode}</p>
                    </div>
                    <a
                      href={`https://www.delhivery.com/track/package/${order.awbCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#7c3aed] flex items-center gap-1.5 hover:underline font-medium"
                    >
                      Track on Delhivery <ArrowRight size={14} />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Tracking history */}
            {order.tracking && order.tracking.length > 0 && (
              <div className="bg-white border border-[rgba(124,58,237,0.1)] rounded-[14px] shadow-[0_1px_6px_rgba(0,0,0,0.04)] transition-all duration-[250ms] hover:border-[rgba(124,58,237,0.2)] hover:shadow-[0_6px_28px_rgba(124,58,237,0.1)] hover:-translate-y-0.5 p-7">
                <p className="font-mono text-[12px] tracking-[0.18em] uppercase text-[#7c3aed] mb-5 font-semibold">Tracking History</p>
                <div className="space-y-5">
                  {order.tracking.map((activity, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="relative flex flex-col items-center">
                        <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${i === 0 ? "bg-[#7c3aed]" : "bg-[#e5e7eb]"}`} />
                        {i < order.tracking!.length - 1 && (
                          <div className="w-px flex-1 bg-[rgba(124,58,237,0.1)] mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-5">
                        <p className="text-base font-medium text-[#0f0a1e]">{activity.status}</p>
                        <p className="text-sm text-[#6b7280] mt-1">{activity.activity}</p>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-[#9ca3af]">
                          <span>{activity.date}</span>
                          {activity.location && <><span>·</span><span>{activity.location}</span></>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order items */}
            <div className="bg-white border border-[rgba(124,58,237,0.1)] rounded-[14px] shadow-[0_1px_6px_rgba(0,0,0,0.04)] transition-all duration-[250ms] hover:border-[rgba(124,58,237,0.2)] hover:shadow-[0_6px_28px_rgba(124,58,237,0.1)] hover:-translate-y-0.5 p-7">
              <p className="font-mono text-[12px] tracking-[0.18em] uppercase text-[#7c3aed] mb-5 font-semibold">Order Items</p>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className={`flex justify-between items-center py-3 ${i < order.items.length - 1 ? "border-b border-[rgba(124,58,237,0.08)]" : ""}`}>
                    <div>
                      <p className="text-base font-medium text-[#0f0a1e]">{item.productName}</p>
                      <p className="text-sm text-[#6b7280]">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-[#0f0a1e] text-base">₹{item.price.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-[rgba(124,58,237,0.08)] flex justify-between items-center">
                <span className="text-base text-[#6b7280]">Total</span>
                <span className="font-serif text-2xl font-light text-[#7c3aed]">₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-white border border-[rgba(124,58,237,0.1)] rounded-[14px] shadow-[0_1px_6px_rgba(0,0,0,0.04)] transition-all duration-[250ms] hover:border-[rgba(124,58,237,0.2)] hover:shadow-[0_6px_28px_rgba(124,58,237,0.1)] hover:-translate-y-0.5 p-7">
              <p className="font-mono text-[12px] tracking-[0.18em] uppercase text-[#7c3aed] mb-5 font-semibold">Delivery Address</p>
              <div className="space-y-2.5 text-base">
                <p className="font-medium text-[#0f0a1e]">{order.shippingAddress.fullName}</p>
                <p className="text-[#6b7280] leading-relaxed">
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                </p>
                <div className="flex items-center gap-2.5 text-[#6b7280] pt-1.5">
                  <Phone size={14} className="shrink-0" /><span>{order.shippingAddress.phone}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#6b7280]">
                  <Mail size={14} className="shrink-0" /><span>{order.shippingAddress.email}</span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="text-center py-6">
              <p className="text-base text-[#6b7280] mb-2.5">Need help with your order?</p>
              <a href="mailto:support@ara-skincare.com" className="text-[#7c3aed] text-base font-medium hover:underline">
                Contact Support
              </a>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!order && !loading && !orderParam && (
          <div className="text-center py-20">
            <div className="text-6xl mb-5">📦</div>
            <p className="text-base text-[#6b7280] mb-7">Enter your order number above to track your shipment</p>
            <Link href="/products" className="inline-block bg-transparent border-[1.5px] border-[rgba(124,58,237,0.2)] text-[#6b7280] font-sans font-medium text-[13px] md:text-sm tracking-widest uppercase py-3.75 px-8 md:py-4.25 md:px-9 rounded-[10px] cursor-pointer transition-all duration-220 text-center no-underline leading-[1.2] hover:border-[#7c3aed] hover:text-[#7c3aed] hover:bg-[#f5f3ff]">
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-[#9ca3af]">Loading...</div>
      </div>
    }>
      <OrderTracker />
    </Suspense>
  );
}
