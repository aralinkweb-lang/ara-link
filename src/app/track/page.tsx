"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, CheckCircle, Truck, MapPin, ExternalLink } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  variant?: string;
  sku: string;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface OrderData {
  orderNumber: string;
  orderStatus: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  awbCode?: string;
  courierName?: string;
  trackingUrl?: string;
  createdAt: string;
}

const STEPS = [
  { key: "pending", label: "Order Placed", icon: Package },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: MapPin },
];

const STATUS_ORDER = ["pending", "confirmed", "processing", "shipped", "delivered"];

function getStepIndex(status: string): number {
  const map: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    processing: 1,
    shipped: 2,
    delivered: 3,
  };
  return map[status] ?? 0;
}

function TrackContent() {
  const searchParams = useSearchParams();
  const urlOrder = searchParams.get("order");

  const [orderInput, setOrderInput] = useState(urlOrder ?? "");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (urlOrder) {
      fetchOrder(urlOrder);
    }
  }, [urlOrder]);

  const fetchOrder = async (num: string) => {
    if (!num.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const res = await fetch(`/api/orders?orderNumber=${encodeURIComponent(num.trim())}`);
      if (!res.ok) throw new Error("Order not found");
      const data = await res.json();
      if (data.success && data.data) {
        setOrder(data.data);
      } else {
        throw new Error("Order not found");
      }
    } catch {
      setOrder(null);
      setError("Order not found. Please check your order number and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderInput);
  };

  const currentStep = order ? getStepIndex(order.orderStatus) : -1;

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-brand mb-2">
            Order Tracking
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-ink mb-3">
            Track Your Order
          </h1>
          <p className="text-sm text-ink-muted">
            Enter your order number to see the delivery status.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <input
            value={orderInput}
            onChange={(e) => setOrderInput(e.target.value)}
            className="flex-1 border border-edge rounded-2xl px-5 py-3.5 text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors bg-white"
            placeholder="ARA-ABC123-XY4Z"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex-shrink-0 bg-brand text-white rounded-2xl px-6 py-3.5 font-semibold text-sm hover:bg-brand-hover transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Track
          </button>
        </form>

        {/* Error */}
        {searched && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 text-center">
            <p className="text-sm font-semibold text-red-600">{error}</p>
            <p className="text-xs text-red-400 mt-1">
              Check your confirmation email for the correct order number.
            </p>
          </div>
        )}

        {/* Order Found */}
        {order && (
          <div className="flex flex-col gap-6">
            {/* Status Stepper */}
            <div className="bg-white rounded-2xl border border-edge p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-base text-ink">
                  Order #{order.orderNumber}
                </h2>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                    order.orderStatus === "delivered"
                      ? "bg-green-50 text-green-600"
                      : order.orderStatus === "cancelled"
                      ? "bg-red-50 text-red-500"
                      : "bg-brand/10 text-brand"
                  }`}
                >
                  {order.orderStatus.replace("_", " ")}
                </span>
              </div>
              <p className="text-xs text-ink-muted mb-6">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              {/* Steps */}
              <div className="relative">
                {/* Progress line */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-edge" />
                <div
                  className="absolute top-5 left-5 h-0.5 bg-brand transition-all duration-500"
                  style={{
                    width:
                      currentStep === 0
                        ? "0%"
                        : `${(currentStep / (STEPS.length - 1)) * 100}%`,
                  }}
                />

                <div className="relative flex justify-between">
                  {STEPS.map((step, i) => {
                    const StepIcon = step.icon;
                    const done = i <= currentStep;
                    const active = i === currentStep;
                    return (
                      <div key={step.key} className="flex flex-col items-center gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                            done
                              ? "bg-brand text-white"
                              : "bg-white border-2 border-edge text-ink-muted"
                          } ${active ? "ring-4 ring-brand/20" : ""}`}
                        >
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <span
                          className={`text-xs font-semibold text-center max-w-[60px] leading-tight ${
                            done ? "text-brand" : "text-ink-muted"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Courier Info */}
            {order.awbCode && (
              <div className="bg-white rounded-2xl border border-edge p-5">
                <h3 className="font-bold text-sm text-ink mb-3 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand" />
                  Courier Tracking
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {order.courierName && (
                    <div>
                      <p className="text-xs text-ink-muted mb-0.5">Courier</p>
                      <p className="font-semibold text-ink">{order.courierName}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-ink-muted mb-0.5">AWB Code</p>
                    <p className="font-semibold text-ink font-mono">{order.awbCode}</p>
                  </div>
                </div>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-2 text-xs font-bold text-brand hover:underline"
                  >
                    Track on courier website
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-edge p-5">
              <h3 className="font-bold text-sm text-ink mb-4">Items Ordered</h3>
              <ul className="flex flex-col gap-3">
                {order.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-edge-light last:border-0"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">{item.productName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.variant && (
                          <span className="text-xs text-ink-muted">{item.variant}</span>
                        )}
                        <span className="text-xs text-ink-muted">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-ink">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Price Summary */}
              <div className="mt-4 pt-4 border-t border-edge flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Subtotal</span>
                  <span className="font-semibold text-ink">{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Discount</span>
                    <span className="font-semibold text-green-600">
                      -{formatPrice(order.discount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-ink-muted">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-edge">
                  <span className="font-black text-ink">Total</span>
                  <span className="font-black text-ink">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-edge p-5">
              <h3 className="font-bold text-sm text-ink mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand" />
                Shipping Address
              </h3>
              <div className="text-sm text-ink-2 leading-relaxed">
                <p className="font-semibold text-ink">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.pincode}
                </p>
                <p className="mt-1 text-ink-muted">{order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Initial state — no search yet */}
        {!searched && (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-brand" />
            </div>
            <p className="text-sm text-ink-muted">
              Enter your order number above to track your delivery.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
