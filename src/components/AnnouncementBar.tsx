"use client";

import { useEffect, useState } from "react";

const messages = [
  "Free Shipping on All Orders Across India",
  "Cold Therapy · Made in India",
  "Use Code WELCOME15 for 15% Off Your First Order",
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % messages.length);
        setVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-brand text-white text-center py-2.5 text-xs font-medium tracking-widest uppercase overflow-hidden">
      <span
        className={`inline-block transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        {messages[current]}
      </span>
    </div>
  );
}
