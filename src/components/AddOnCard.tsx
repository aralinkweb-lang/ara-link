"use client";

import type { AddOn } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Check, Plus } from "lucide-react";

interface AddOnCardProps {
  addon: AddOn;
  onAdd: () => void;
  added: boolean;
}

export default function AddOnCard({ addon, onAdd, added }: AddOnCardProps) {
  const discount = Math.round(
    ((addon.originalPrice - addon.price) / addon.originalPrice) * 100
  );

  return (
    <div
      className={`bg-white rounded-2xl border p-5 flex items-start gap-4 transition-all duration-200 ${
        added
          ? "border-brand bg-brand/5"
          : "border-edge hover:border-brand/40"
      }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-2xl overflow-hidden">
        {addon.icon && (addon.icon.startsWith?.("http") ? (
          // render image when icon is a URL
          // eslint-disable-next-line @next/next/no-img-element
          <img src={addon.icon} alt={addon.name} className="w-10 h-10 object-cover rounded-lg" />
        ) : (
          <span>{addon.icon}</span>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-bold text-sm text-ink">{addon.name}</h4>
          {discount > 0 && (
            <span className="flex-shrink-0 text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
        <p className="text-xs text-ink-muted leading-relaxed mb-3 line-clamp-2">
          {addon.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm text-ink">{formatPrice(addon.price)}</span>
            <span className="text-xs text-ink-muted line-through">
              {formatPrice(addon.originalPrice)}
            </span>
          </div>
          <button
            onClick={onAdd}
            disabled={added}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              added
                ? "bg-brand/10 text-brand cursor-default"
                : "bg-brand text-white hover:bg-brand-hover"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
