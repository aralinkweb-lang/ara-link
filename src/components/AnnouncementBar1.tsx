"use client";

import { useState, useEffect } from "react";

export default function AnnouncementBar1() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const announcements = [
    "🧊 Free shipping across India · Only 17 units left · Dermatologist tested",
    "✨ New: Complete Ritual Kit now available · Save ₹648",
    "🎁 Use code COLDTHERAPY for 10% off your first order",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  return (
    <div className="announcement-bar" style={{
      backgroundColor: '#7c3aed',
      color: 'white',
      padding: '12px 24px',
    }}>
      <span className="font-mono text-[12px] md:text-[13px] tracking-[0.14em] uppercase">
        {announcements[currentIndex]}
      </span>
    </div>
  );
}
