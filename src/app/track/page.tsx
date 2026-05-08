"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package, CheckCircle, Truck, MapPin, Clock, RefreshCw } from "lucide-react";
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

interface TrackingScan {
  date: string;
  status: string;
  activity: string;
  location: string;
}

interface LiveTracking {
  currentStatus: string;
  scans: TrackingScan[];
  shipmentDetails: {
    awb: string;
    origin: string;
    destination: string;
    pickUpDate: string;
    deliveryDate: string;
  };
}

const STEPS = [
  { key: "pending", label: "Order Placed", icon: Package },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: MapPin },
];

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

function isAwb(input: string): boolean {
  // AWB codes are numeric or alphanumeric but don't start with "ARA-"
  return !!input.trim() && !input.trim().toUpperCase().startsWith("ARA-");
}

function TrackContent() {
  const searchParams = useSearchParams();
  const urlOrder = searchParams.get("order");

  const [orderInput, setOrderInput] = useState(urlOrder ?? "");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [liveTracking, setLiveTracking] = useState<LiveTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (urlOrder) fetchOrder(urlOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlOrder]);

  const fetchLiveTracking = async (awb: string) => {
    setLiveLoading(true);
    try {
      const res = await fetch(`/api/delhivery/track?awb=${encodeURIComponent(awb)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setLiveTracking({
          currentStatus: data.currentStatus,
          scans: data.tracking || [],
          shipmentDetails: data.shipmentDetails,
        });
      }
    } catch {
      // live tracking failure is non-fatal
    } finally {
      setLiveLoading(false);
    }
  };

  const fetchOrder = async (input: string) => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);
    setLiveTracking(null);

    try {
      // Try by order number first; if input looks like AWB, try that endpoint
      const param = isAwb(input) ? `awb=${encodeURIComponent(input.trim())}` : `orderNumber=${encodeURIComponent(input.trim())}`;
      const res = await fetch(`/api/orders?${param}`);

      if (!res.ok) {
        // If AWB lookup failed, try order number as fallback
        if (isAwb(input)) {
          const fallback = await fetch(`/api/orders?orderNumber=${encodeURIComponent(input.trim())}`);
          if (fallback.ok) {
            const fdata = await fallback.json();
            if (fdata.success && fdata.data) {
              setOrder(fdata.data);
              if (fdata.data.awbCode) fetchLiveTracking(fdata.data.awbCode);
              return;
            }
          }
        }
        throw new Error("Order not found");
      }

      const data = await res.json();
      if (data.success && data.data) {
        setOrder(data.data);
        const awb = data.data.awbCode || (isAwb(input) ? input.trim() : undefined);
        if (awb) fetchLiveTracking(awb);
      } else {
        throw new Error("Order not found");
      }
    } catch {
      setOrder(null);
      setError("Order not found. Please check your order number or AWB / tracking ID.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderInput);
  };

  const handleRefresh = () => {
    if (order?.awbCode) fetchLiveTracking(order.awbCode);
  };

  const currentStep = order ? getStepIndex(order.orderStatus) : -1;

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest uppercase text-brand mb-2">Order Tracking</p>
          <h1 className="text-3xl sm:text-4xl font-black text-ink mb-3">Track Your Order</h1>
          <p className="text-sm text-ink-muted">
            Enter your order number <span className="text-ink font-semibold">(ARA-…)</span> or your AWB / courier tracking number.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <input
            value={orderInput}
            onChange={(e) => setOrderInput(e.target.value)}
            className="flex-1 border border-edge rounded-2xl px-5 py-3.5 text-sm text-ink placeholder-ink-muted focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-colors bg-white"
            placeholder="ARA-ABC123 or AWB number (e.g. 1234567890)"
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 bg-brand text-white rounded-2xl px-6 py-3.5 font-semibold text-sm hover:bg-brand-hover transition-colors flex items-center gap-2 disabled:opacity-60"
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
              Check your confirmation email for the order number or AWB tracking ID.
            </p>
          </div>
        )}

        {/* Order Found */}
        {order && (
          <div className="flex flex-col gap-6">

            {/* Status Stepper */}
            <div className="bg-white rounded-2xl border border-edge p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-base text-ink">Order #{order.orderNumber}</h2>
                <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                  order.orderStatus === "delivered" ? "bg-green-50 text-green-600"
                  : order.orderStatus === "cancelled" ? "bg-red-50 text-red-500"
                  : "bg-brand/10 text-brand"
                }`}>
                  {order.orderStatus.replace("_", " ")}
                </span>
              </div>
              <p className="text-xs text-ink-muted mb-6">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>

              <div className="relative">
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-edge" />
                <div
                  className="absolute top-5 left-5 h-0.5 bg-brand transition-all duration-500"
                  style={{ width: currentStep === 0 ? "0%" : `${(currentStep / (STEPS.length - 1)) * 100}%` }}
                />
                <div className="relative flex justify-between">
                  {STEPS.map((step, i) => {
                    const StepIcon = step.icon;
                    const done = i <= currentStep;
                    const active = i === currentStep;
                    return (
                      <div key={step.key} className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-colors ${
                          done ? "bg-brand text-white" : "bg-white border-2 border-edge text-ink-muted"
                        } ${active ? "ring-4 ring-brand/20" : ""}`}>
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <span className={`text-xs font-semibold text-center max-w-15 leading-tight ${done ? "text-brand" : "text-ink-muted"}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Delhivery Tracking */}
            {order.awbCode && (
              <div className="bg-white rounded-2xl border border-edge p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand" />
                    Live Courier Tracking
                    {order.courierName && <span className="text-xs text-ink-muted font-normal">· {order.courierName}</span>}
                  </h3>
                  <button
                    onClick={handleRefresh}
                    disabled={liveLoading}
                    className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${liveLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-4 p-3 bg-brand/5 rounded-xl">
                  <div>
                    <p className="text-xs text-ink-muted">AWB / Tracking ID</p>
                    <p className="font-mono font-bold text-ink text-sm">{order.awbCode}</p>
                  </div>
                  {liveTracking && (
                    <div className="ml-auto text-right">
                      <p className="text-xs text-ink-muted">Current Status</p>
                      <p className="text-xs font-bold text-brand">{liveTracking.currentStatus}</p>
                    </div>
                  )}
                </div>

                {liveLoading && (
                  <div className="flex items-center gap-2 text-sm text-ink-muted py-4 justify-center">
                    <span className="w-4 h-4 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
                    Fetching live updates…
                  </div>
                )}

                {liveTracking && liveTracking.scans.length > 0 && (
                  <div className="relative mt-2">
                    <div className="absolute left-1.75 top-2 bottom-2 w-0.5 bg-edge" />
                    <ul className="flex flex-col gap-0">
                      {liveTracking.scans.map((scan, i) => (
                        <li key={i} className="flex gap-4 pb-5 last:pb-0 relative">
                          <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 mt-0.5 z-10 ${
                            i === 0 ? "bg-brand border-brand" : "bg-white border-edge"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${i === 0 ? "text-brand" : "text-ink"}`}>
                              {scan.status}
                            </p>
                            {scan.activity && (
                              <p className="text-xs text-ink-muted mt-0.5">{scan.activity}</p>
                            )}
                            <div className="flex items-center gap-3 mt-1">
                              {scan.location && (
                                <span className="text-xs text-ink-2 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />{scan.location}
                                </span>
                              )}
                              <span className="text-xs text-ink-muted flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {scan.date ? new Date(scan.date).toLocaleString("en-IN", {
                                  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                                }) : "—"}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {liveTracking && liveTracking.scans.length === 0 && (
                  <p className="text-xs text-ink-muted text-center py-3">
                    No scan events yet — check back in a few hours after pickup.
                  </p>
                )}

                {!liveLoading && !liveTracking && (
                  <p className="text-xs text-ink-muted text-center py-3">
                    Could not fetch live updates right now.
                  </p>
                )}
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-edge p-5">
              <h3 className="font-bold text-sm text-ink mb-4">Items Ordered</h3>
              <ul className="flex flex-col gap-3">
                {order.items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between py-3 border-b border-edge last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-ink">{item.productName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.variant && <span className="text-xs text-ink-muted">{item.variant}</span>}
                        <span className="text-xs text-ink-muted">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-ink">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-edge flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Subtotal</span>
                  <span className="font-semibold text-ink">{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-ink-muted">Discount</span>
                    <span className="font-semibold text-green-600">-{formatPrice(order.discount)}</span>
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
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                <p className="mt-1 text-ink-muted">{order.shippingAddress.phone}</p>
                <p className="text-ink-muted">{order.shippingAddress.email}</p>
              </div>
            </div>

          </div>
        )}

        {/* Initial state */}
        {!searched && (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-brand" />
            </div>
            <p className="text-sm text-ink-muted">
              Enter your order number or AWB tracking ID above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
