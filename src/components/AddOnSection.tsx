"use client";

import { useState } from "react";
import type { AddOn } from "@/types";
import { useCart } from "@/store/cart";
import { getProductById } from "@/data/products";
import AddOnCard from "./AddOnCard";

interface AddOnSectionProps {
  addons: AddOn[];
}

export default function AddOnSection({ addons }: AddOnSectionProps) {
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAdd = (addon: AddOn) => {
    // Try to find a matching product to add to cart
    const product = getProductById(addon.id);
    if (product) {
      addItem(product, 1);
    }
    setAddedIds((prev) => new Set([...prev, addon.id]));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {addons.map((addon) => (
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
