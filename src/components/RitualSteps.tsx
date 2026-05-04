import Image from "next/image";
import { ritualSteps } from "@/data/products";

const stepImages = [
  "https://images.unsplash.com/photo-1548366086-7f1b76106622?w=400&q=80",
  "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
  "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&q=80",
  "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=400&q=80",
];

export default function RitualSteps() {
  return (
    <section className="bg-ink py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4">
            The Ritual
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            60 Seconds. Every Morning.
            <br />
            <span className="text-brand">That&apos;s It.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {ritualSteps.map((step, index) => (
            <div
              key={step.step}
              className={`relative py-8 px-6 ${
                index < ritualSteps.length - 1
                  ? "lg:border-r border-b lg:border-b-0 border-white/10"
                  : ""
              }`}
            >
              {/* Image */}
              <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={stepImages[index]}
                  alt={step.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              </div>

              {/* Step Number */}
              <div className="text-5xl font-black text-white/10 mb-4 leading-none select-none">
                {step.step}
              </div>

              {/* Dot */}
              <div className="w-8 h-8 rounded-full border-2 border-brand bg-brand/10 flex items-center justify-center mb-5">
                <div className="w-3 h-3 rounded-full bg-brand" />
              </div>

              {/* Content */}
              <h3 className="font-bold text-white text-base mb-2.5">{step.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
