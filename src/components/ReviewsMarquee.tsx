"use client";

import Image from "next/image";
import Marquee from "react-fast-marquee";
import { Star } from "lucide-react";

interface Review {
  id: number;
  rating: number;
  text: string;
  author: string;
  avatar: string;
  verified: boolean;
}

interface ReviewsMarqueeProps {
  reviews: Review[];
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="mx-3 bg-white border border-edge rounded-2xl p-5 w-80 shrink-0 shadow-(--card-shadow)">
      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i < review.rating
                ? "text-amber-400 fill-amber-400"
                : "text-gray-200 fill-gray-200"
            }`}
          />
        ))}
        {review.verified && (
          <span className="ml-2 text-xs text-green-600 font-semibold">Verified</span>
        )}
      </div>

      {/* Quote */}
      <p className="text-sm text-ink-2 leading-relaxed mb-4 line-clamp-4">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 bg-brand/10">
          <Image
            src={review.avatar}
            alt={review.author}
            fill
            className="object-cover"
            sizes="36px"
          />
        </div>
        <p className="text-sm font-bold text-ink">{review.author}</p>
      </div>
    </div>
  );
}

export default function ReviewsMarquee({ reviews }: ReviewsMarqueeProps) {
  const half = Math.ceil(reviews.length / 2);
  const row1 = reviews.slice(0, half);
  const row2 = reviews.slice(half);

  return (
    <section className="bg-paper py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-brand mb-2">
              ARA Reviews
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-ink">
              Customers Who Never Looked Back
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-ink">4.9</span>
            <span className="text-sm text-ink-muted">/ 847 reviews</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Marquee speed={35} pauseOnHover gradient={false}>
          {[...row1, ...row1].map((review, i) => (
            <ReviewCard key={`r1-${review.id}-${i}`} review={review} />
          ))}
        </Marquee>
        <Marquee speed={35} pauseOnHover gradient={false} direction="right">
          {[...row2, ...row2].map((review, i) => (
            <ReviewCard key={`r2-${review.id}-${i}`} review={review} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
