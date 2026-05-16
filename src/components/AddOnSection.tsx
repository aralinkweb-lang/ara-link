"use client";

import { useState } from "react";
import type { AddOn, Product } from "@/types";
import { useCart } from "@/store/cart";
import { getProductById } from "@/data/products";
import AddOnCard from "./AddOnCard";

interface AddOnSectionProps {
  addons: AddOn[];
  currentProductId?: string;
}

const POWDER_ADDON_IDS = [
  "rose-petal-powder",
  "beetroot-powder",
  "orange-peel-powder",
  "mint-powder",
];

export default function AddOnSection({ addons, currentProductId }: AddOnSectionProps) {
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const currentProduct = currentProductId ? getProductById(currentProductId) : undefined;
  const isPowderProduct = currentProduct?.category === "Powders";
  const displayPowderIds = isPowderProduct
    ? POWDER_ADDON_IDS.filter((id) => id !== currentProductId)
    : POWDER_ADDON_IDS;

  const visiblePowders = addons.filter((addon) => displayPowderIds.includes(addon.id));
  const comboPowders = addons.filter((addon) => displayPowderIds.includes(addon.id));

  const comboPrice = comboPowders.reduce((total, addon) => total + addon.price, 0) - 100;
  const comboOriginalPrice = comboPowders.reduce((total, addon) => total + addon.originalPrice, 0);
  const comboName = "Combo Powder Kit";
  const comboDescription = isPowderProduct
    ? `Includes ${comboPowders.map((addon) => addon.name.replace(/ \(100g\)$/, "")).join(", ")}.`
    : `Includes ${comboPowders.map((addon) => addon.name.replace(/ \(100g\)$/, "")).join(", ")} for a complete powder ritual.`;

  const comboImages = comboPowders.length === 4
    ? ["https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778957856/b69fade4-a765-4e8c-aa9b-c3cfcaed7d41.png"]
    : [
        "https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778935304/Gemini_Generated_Image_fhe9z9fhe9z9fhe9_eyu4xy.png",
        "https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778935693/Gemini_Generated_Image_ufbyzoufbyzoufby_ocursw.png",
        "https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778935370/Gemini_Generated_Image_aqhtulaqhtulaqht_tvsykz.png",
        "https://res.cloudinary.com/dw4v1hkbj/image/upload/q_auto/f_auto/v1778934532/Gemini_Generated_Image_1kqt7r1kqt7r1kqt_lkbspa.png",
      ];

  const comboIcon = isPowderProduct
    ? {
        "rose-petal-powder": comboImages[0],
        "beetroot-powder": comboImages[1],
        "orange-peel-powder": comboImages[2],
        "mint-powder": comboImages[3],
      }[currentProductId ?? ""] ?? comboImages[0]
    : comboImages[0];

  const comboKey = isPowderProduct ? `no-${currentProductId}` : "full";
  const comboId = `combo-powder-kit-${comboKey}`;
  const comboSku = `ARA-COMBO-POWDER-${comboKey.toUpperCase()}`;

  const comboAddon: AddOn = {
    id: comboId,
    name: comboName,
    description: comboDescription,
    price: Math.max(comboPrice, 1),
    originalPrice: comboOriginalPrice,
    icon: comboIcon,
  };

  const visibleAddons = [...visiblePowders, comboAddon];

  const buildComboProduct = (): Product => ({
    id: comboAddon.id,
    name: comboAddon.name,
    slug: comboId,
    description: comboAddon.description,
    shortDescription: comboAddon.description,
    price: comboAddon.price,
    originalPrice: comboAddon.originalPrice,
    images: [comboIcon, ...comboImages.filter((image) => image !== comboIcon)],
    category: "Combos",
    stock: 999,
    sku: comboSku,
    features: comboPowders.map((addon) => addon.name.replace(/ \(30g\)$/, "")),
    rating: 4.8,
    reviewCount: 18,
    badges: ["Combo Kit"],
    isFeatured: false,
    createdAt: new Date(),
  });

  const handleAdd = (addon: AddOn) => {
    if (addon.id === comboAddon.id) {
      addItem(buildComboProduct(), 1);
    } else {
      const product = getProductById(addon.id);
      if (product) {
        addItem(product, 1);
      }
    }
    setAddedIds((prev) => new Set([...prev, addon.id]));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {visibleAddons.map((addon) => (
        <AddOnCard
          key={addon.id}
          addon={addon}
          onAdd={() => handleAdd(addon)}
          added={addedIds.has(addon.id)}
        />
      ))}
    </div>
  );
}
