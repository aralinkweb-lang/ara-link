// Meta Pixel helper — typed wrappers around window.fbq for standard events.
// Pixel base code lives in src/app/layout.tsx (init + PageView).
// Docs: https://developers.facebook.com/docs/meta-pixel/reference

export type Currency = "INR" | "USD" | "EUR" | "GBP";

const DEFAULT_CURRENCY: Currency = "INR";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type Params = Record<string, unknown>;

function fbq(type: "track" | "trackCustom", name: string, params?: Params) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  if (params) {
    window.fbq(type, name, params);
  } else {
    window.fbq(type, name);
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// Standard events
// ────────────────────────────────────────────────────────────────────────────────

export function trackPageView() {
  fbq("track", "PageView");
}

export function trackViewContent(params: {
  content_ids: string[];
  content_name?: string;
  content_category?: string;
  content_type?: "product" | "product_group";
  value?: number;
  currency?: Currency;
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
}) {
  fbq("track", "ViewContent", {
    content_type: "product",
    currency: DEFAULT_CURRENCY,
    ...params,
  });
}

export function trackSearch(params: {
  search_string: string;
  content_category?: string;
  content_ids?: string[];
  value?: number;
  currency?: Currency;
}) {
  fbq("track", "Search", {
    currency: DEFAULT_CURRENCY,
    ...params,
  });
}

export function trackAddToCart(params: {
  content_ids: string[];
  content_name?: string;
  content_category?: string;
  content_type?: "product" | "product_group";
  value: number;
  currency?: Currency;
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
}) {
  fbq("track", "AddToCart", {
    content_type: "product",
    currency: DEFAULT_CURRENCY,
    ...params,
  });
}

export function trackAddToWishlist(params: {
  content_ids: string[];
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: Currency;
}) {
  fbq("track", "AddToWishlist", {
    currency: DEFAULT_CURRENCY,
    ...params,
  });
}

export function trackInitiateCheckout(params: {
  content_ids: string[];
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
  num_items: number;
  value: number;
  currency?: Currency;
}) {
  fbq("track", "InitiateCheckout", {
    content_type: "product",
    currency: DEFAULT_CURRENCY,
    ...params,
  });
}

export function trackAddPaymentInfo(params: {
  content_ids?: string[];
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
  value?: number;
  currency?: Currency;
}) {
  fbq("track", "AddPaymentInfo", {
    currency: DEFAULT_CURRENCY,
    ...params,
  });
}

export function trackPurchase(params: {
  content_ids: string[];
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
  content_name?: string;
  content_type?: "product" | "product_group";
  num_items?: number;
  value: number;
  currency?: Currency;
  order_id?: string;
}) {
  fbq("track", "Purchase", {
    content_type: "product",
    currency: DEFAULT_CURRENCY,
    ...params,
  });
}

export function trackLead(params?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: Currency;
}) {
  fbq("track", "Lead", {
    currency: DEFAULT_CURRENCY,
    ...params,
  });
}

export function trackContact(params?: {
  content_name?: string;
  content_category?: string;
}) {
  fbq("track", "Contact", params ?? {});
}

export function trackCompleteRegistration(params?: {
  content_name?: string;
  status?: string;
  value?: number;
  currency?: Currency;
}) {
  fbq("track", "CompleteRegistration", {
    currency: DEFAULT_CURRENCY,
    ...params,
  });
}

export function trackCustomizeProduct(params?: {
  content_ids?: string[];
  content_name?: string;
  content_category?: string;
}) {
  fbq("track", "CustomizeProduct", params ?? {});
}

export function trackDonate(params: {
  value: number;
  currency?: Currency;
  content_name?: string;
}) {
  fbq("track", "Donate", {
    currency: DEFAULT_CURRENCY,
    ...params,
  });
}

export function trackFindLocation(params?: {
  content_name?: string;
  content_category?: string;
}) {
  fbq("track", "FindLocation", params ?? {});
}

export function trackSchedule(params?: {
  content_name?: string;
  content_category?: string;
}) {
  fbq("track", "Schedule", params ?? {});
}

export function trackStartTrial(params: {
  value: number;
  currency?: Currency;
  predicted_ltv?: number;
}) {
  fbq("track", "StartTrial", {
    currency: DEFAULT_CURRENCY,
    ...params,
  });
}

export function trackSubmitApplication(params?: {
  content_name?: string;
  content_category?: string;
}) {
  fbq("track", "SubmitApplication", params ?? {});
}

export function trackSubscribe(params: {
  value: number;
  currency?: Currency;
  predicted_ltv?: number;
}) {
  fbq("track", "Subscribe", {
    currency: DEFAULT_CURRENCY,
    ...params,
  });
}

// ────────────────────────────────────────────────────────────────────────────────
// Custom events (use sparingly; standard events optimize better in Ads Manager)
// ────────────────────────────────────────────────────────────────────────────────

export function trackCustom(name: string, params?: Params) {
  fbq("trackCustom", name, params);
}
