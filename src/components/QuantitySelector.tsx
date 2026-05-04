"use client";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center border border-edge rounded-xl overflow-hidden">
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className="w-8 h-8 flex items-center justify-center text-ink-2 hover:bg-paper disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="w-10 h-8 flex items-center justify-center text-sm font-bold text-ink border-x border-edge">
        {value}
      </span>
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className="w-8 h-8 flex items-center justify-center text-ink-2 hover:bg-paper disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
