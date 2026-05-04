import { Truck, RefreshCw, Shield, Headphones } from "lucide-react";

const trustItems = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On all orders across India",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    subtitle: "30-day hassle-free returns",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    subtitle: "Razorpay encrypted checkout",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    subtitle: "We reply within 2 hours",
  },
];

export default function TrustBar() {
  return (
    <section className="bg-white border-y border-edge">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">{item.title}</p>
                <p className="text-xs text-ink-muted">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
