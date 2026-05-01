import type { Product, AddOn } from "@/types";

export const products: Product[] = [
  {
    id: "ara-ice-bowl",
    name: "ARA Face Ice Bowl",
    slug: "ara-ice-bowl",
    description: "The Last Ice Bowl You'll Ever Argue About. ARA doesn't compete for shelf space with your 12-step routine. It either becomes the first thing you do every morning — or it doesn't belong in your life.",
    shortDescription: "Premium cold therapy bowl for professional ice facials",
    price: 399,
    originalPrice: 599,
    images: ["/products/ara-ice-bowl-1.jpg", "/products/ara-ice-bowl-2.jpg", "/products/ara-ice-bowl-3.jpg"],
    category: "Cold Therapy",
    stock: 17,
    sku: "ARA-001",
    features: [
      "Medical-grade silicone rim for perfect seal",
      "Ergonomic design for comfortable use",
      "Built-in ice tray compartment",
      "Food-grade materials",
      "Easy to clean and maintain",
      "Perfect for daily skincare rituals"
    ],
    variants: [
      { id: "glacier-white", name: "Glacier White", colorCode: "linear-gradient(135deg, #e8f4f8, #a8d5e0)", additionalPrice: 0, stock: 8 },
      { id: "midnight-frost", name: "Midnight Frost", colorCode: "linear-gradient(135deg, #1a1a2e, #0a0a18)", additionalPrice: 0, stock: 5 },
      { id: "arctic-sage", name: "Arctic Sage", colorCode: "linear-gradient(135deg, #b8d4c8, #6a9e8e)", additionalPrice: 0, stock: 4 },
    ],
    rating: 4.9,
    reviewCount: 847,
    badges: ["Cold Therapy", "Limited Stock"],
    isFeatured: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "rose-petal-powder",
    name: "Rose Petal Powder",
    slug: "rose-petal-powder",
    description: "Whole dried rose petals, finely milled. Add to your bowl water for a calming, anti-inflammatory soak. Reduces redness faster when combined with cold exposure.",
    shortDescription: "Pure rose petal powder for calming cold therapy",
    price: 299,
    originalPrice: 499,
    images: ["/products/rose-water-1.jpg"],
    category: "Powders",
    stock: 45,
    sku: "ARA-RP-001",
    features: [
      "100% pure rose petals, finely milled",
      "No artificial preservatives",
      "Reduces redness and inflammation",
      "Calming aromatherapy effect",
      "Pairs perfectly with ice therapy"
    ],
    rating: 4.8,
    reviewCount: 156,
    badges: ["Best Seller"],
    isFeatured: true,
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "beetroot-powder",
    name: "Beetroot Powder",
    slug: "beetroot-powder",
    description: "Rich in betalains and natural nitrates. Dissolve in your ice bowl water for a deep-red anti-inflammatory soak that visibly brightens dull skin.",
    shortDescription: "Beetroot powder for radiance and brightening",
    price: 199,
    originalPrice: 349,
    images: ["/products/rose-water-1.jpg"],
    category: "Powders",
    stock: 60,
    sku: "ARA-BR-001",
    features: [
      "Rich in betalains and antioxidants",
      "Natural skin-brightening agent",
      "Reduces inflammation",
      "100% natural — no additives",
      "Pairs with ice therapy for best results"
    ],
    rating: 4.7,
    reviewCount: 92,
    badges: ["Popular"],
    isFeatured: true,
    createdAt: new Date("2024-01-22"),
  },
  {
    id: "mint-powder",
    name: "Mint Powder",
    slug: "mint-powder",
    description: "Cooling menthol meets cold therapy. Dissolve in ice water before dipping — the dual-cooling effect tightens capillaries and leaves skin visibly awake.",
    shortDescription: "Cooling mint powder for tightening and freshness",
    price: 199,
    originalPrice: 349,
    images: ["/products/rose-water-1.jpg"],
    category: "Powders",
    stock: 58,
    sku: "ARA-MN-001",
    features: [
      "Natural cooling menthol",
      "Tightens capillaries",
      "Refreshes tired skin",
      "100% pure — no fillers",
      "Best with cold therapy"
    ],
    rating: 4.6,
    reviewCount: 71,
    badges: [],
    isFeatured: true,
    createdAt: new Date("2024-01-24"),
  },
  {
    id: "orange-peel-powder",
    name: "Orange Peel Powder",
    slug: "orange-peel-powder",
    description: "Cold-pressed orange peel — dense with Vitamin C and natural AHAs. Pairs with ice therapy to tighten pores and even out skin tone in one step.",
    shortDescription: "Vitamin-C rich orange peel powder",
    price: 199,
    originalPrice: 349,
    images: ["/products/rose-water-1.jpg"],
    category: "Powders",
    stock: 50,
    sku: "ARA-OP-001",
    features: [
      "Dense with natural Vitamin C",
      "Natural AHAs for gentle exfoliation",
      "Tightens pores",
      "Evens skin tone",
      "100% natural orange peel"
    ],
    rating: 4.7,
    reviewCount: 84,
    badges: [],
    isFeatured: true,
    createdAt: new Date("2024-01-26"),
  },
  {
    id: "combo-starter",
    name: "Starter Ritual Combo",
    slug: "combo-starter",
    description: "ARA Face Ice Bowl + 30g each of Beetroot, Orange Peel and Rose Petal Powder. Everything you need to start the cold therapy ritual at one bundled price.",
    shortDescription: "Ice Bowl + 30g each of Beetroot, Orange Peel & Rose Powder",
    price: 599,
    originalPrice: 996,
    images: ["/products/ara-kit-1.jpg", "/products/ara-kit-2.jpg"],
    category: "Combos",
    stock: 20,
    sku: "ARA-COMBO-30",
    features: [
      "ARA Face Ice Bowl included",
      "Beetroot Powder — 30g",
      "Orange Peel Powder — 30g",
      "Rose Petal Powder — 30g",
      "Save ₹397 vs buying separately"
    ],
    rating: 4.9,
    reviewCount: 124,
    badges: ["Best Value"],
    isFeatured: true,
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "combo-pro",
    name: "Pro Ritual Combo",
    slug: "combo-pro",
    description: "ARA Face Ice Bowl + 100g each of Beetroot, Rose Petal and Orange Peel Powder. Months of supply at the deepest bundled discount we offer.",
    shortDescription: "Ice Bowl + 100g each of Beetroot, Rose & Orange Peel Powder",
    price: 799,
    originalPrice: 1296,
    images: ["/products/ara-kit-1.jpg", "/products/ara-kit-2.jpg"],
    category: "Combos",
    stock: 12,
    sku: "ARA-COMBO-100",
    features: [
      "ARA Face Ice Bowl included",
      "Beetroot Powder — 100g",
      "Rose Petal Powder — 100g",
      "Orange Peel Powder — 100g",
      "Save ₹497 vs buying separately"
    ],
    rating: 5.0,
    reviewCount: 67,
    badges: ["Best Value", "Limited Edition"],
    isFeatured: true,
    createdAt: new Date("2024-02-05"),
  },
];

export const otoProducts: AddOn[] = [
  {
    id: "beetroot-powder",
    name: "Beetroot Powder",
    description: "Rich in betalains and natural nitrates. Dissolve in your ice bowl water for a deep-red anti-inflammatory soak that visibly brightens dull skin.",
    price: 199,
    originalPrice: 349,
    icon: "◉",
  },
  {
    id: "orange-peel-powder",
    name: "Orange Peel Powder",
    description: "Cold-pressed orange peel — dense with Vitamin C and natural AHAs. Pairs with ice therapy to tighten pores and even out skin tone in one step.",
    price: 199,
    originalPrice: 349,
    icon: "◌",
  },
  {
    id: "rose-petal-powder",
    name: "Rose Petal Powder",
    description: "Whole dried rose petals, finely milled. Add to your bowl for a calming, anti-inflammatory ritual. Reduces redness faster when combined with cold exposure.",
    price: 299,
    originalPrice: 499,
    icon: "✿",
  },
  {
    id: "mint-powder",
    name: "Mint Powder",
    description: "Cooling menthol meets cold therapy. Dissolve in ice water before dipping — the dual-cooling effect tightens capillaries and leaves skin visibly awake.",
    price: 199,
    originalPrice: 349,
    icon: "❋",
  },
];

export const addOns: AddOn[] = [
  {
    id: "rose-petal-powder",
    name: "Rose Petal Powder (30g)",
    description: "Add to your ARA bowl for a calming, anti-inflammatory ritual. Reduces redness faster with cold exposure.",
    price: 299,
    originalPrice: 499,
    icon: "✿",
  },
  {
    id: "beetroot-powder",
    name: "Beetroot Powder (30g)",
    description: "Rich in betalains. Brightens dull skin and reduces inflammation when combined with cold therapy.",
    price: 199,
    originalPrice: 349,
    icon: "◉",
  },
  {
    id: "orange-peel-powder",
    name: "Orange Peel Powder (30g)",
    description: "Vitamin C rich powder that tightens pores and evens skin tone in your ice ritual.",
    price: 199,
    originalPrice: 349,
    icon: "◌",
  },
  {
    id: "mint-powder",
    name: "Mint Powder (30g)",
    description: "Cooling menthol that tightens capillaries — the dual-cooling effect leaves skin visibly awake.",
    price: 199,
    originalPrice: 349,
    icon: "❋",
  },
];

export const reviews = [
  {
    id: 1,
    rating: 5,
    text: "I've been using a salad bowl for ice facials for two years. The difference is embarrassing. ARA's rim seals properly — I was losing 20 seconds every session. Now I don't.",
    author: "Rhea M.",
    role: "Dermatology Nurse, Mumbai",
    verified: true,
  },
  {
    id: 2,
    rating: 5,
    text: "My skincare spend dropped 40% the month after I started this consistently. My serums finally have clean, prepped skin to work on. First time in years they're actually doing their job.",
    author: "Arjun S.",
    role: "Athlete & Biohacker, Bangalore",
    verified: true,
  },
  {
    id: 3,
    rating: 5,
    text: "Gifted one to my mother. She called me three days later asking for two more for her friends. That's the only review ARA needs.",
    author: "Zara K.",
    role: "Brand Director, Delhi",
    verified: true,
  },
];

export const benefits = [
  {
    icon: "◎",
    title: "Pores Constrict Immediately",
    description: "Cold triggers vasoconstriction. Pores tighten in seconds. Your skin looks smoother before you've touched a single product.",
  },
  {
    icon: "↓",
    title: "Inflammation Drops",
    description: "Puffiness, redness, post-sleep swelling — dispersed. The face that looked tired at 7am looks intentional by 7:15.",
  },
  {
    icon: "↑",
    title: "Circulation Surges",
    description: "After cold comes the rebound. Blood rushes back. Oxygen floods the skin. That glow people attribute to expensive serums? This is where it actually comes from.",
  },
  {
    icon: "⬡",
    title: "Absorption Increases",
    description: "Cold-prepped skin absorbs actives at a measurably higher rate. Every product that follows gets a better shot at doing its job.",
  },
  {
    icon: "∅",
    title: "Zero Chemicals. Zero Side Effects.",
    description: "Water. Ice. Temperature. No retinol purge. No patch testing. Results on day one.",
  },
];

export const ritualSteps = [
  {
    step: "01",
    title: "Fill & Freeze Overnight",
    description: "Add water. Add ice — or use the built-in tray. The bowl does the prep work. You wake up, it's ready.",
  },
  {
    step: "02",
    title: "Clean Face First",
    description: "Blank canvas. Cold therapy on clean skin hits different. 30 seconds. Nothing more.",
  },
  {
    step: "03",
    title: "Dip. 15 Seconds. Twice.",
    description: "The soft silicone rim seals against your face. No hard edges. No coming up early. The science starts before you lift your head.",
  },
  {
    step: "04",
    title: "Pat Dry. Apply Serum.",
    description: "Cold-prepped, pore-tightened skin absorbs actives at a higher rate. Your ₹3,000 serum just got its first real shot.",
  },
];

export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}
