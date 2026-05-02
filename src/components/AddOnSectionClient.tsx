"use client";

import { useState } from "react";
import AddOnCard from "@/components/AddOnCard";
import type { AddOn } from "@/types";

interface AddOnSectionClientProps {
  addOns: AddOn[];
}

export default function AddOnSectionClient({ addOns }: AddOnSectionClientProps) {
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set());

  const handleToggle = (id: string, selected: boolean) => {
    setSelectedAddOns((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  return (
   <section className="py-10 px-5 md:px-10 lg:px-16 bg-[#faf8ff] mx-auto">
  <div className="flex items-center justify-center gap-4 mb-7">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c9a96e]" />

    <span className="font-mono text-[12px] md:text-[13px] tracking-[0.26em] uppercase text-[#7c3aed] font-medium">
      Complete The Ritual
    </span>

    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c9a96e]" />
  </div>

  <div className="flex flex-col items-center gap-4 w-full">
    {addOns.map((addon) => (
      <div key={addon.id} className="w-full max-w-[720px]">
        <AddOnCard
          addon={addon}
          onToggle={handleToggle}
          selected={selectedAddOns.has(addon.id)}
        />
      </div>
    ))}
  </div>
</section>
  );
}
