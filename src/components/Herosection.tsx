import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full bg-white text-[#0f0a1e] px-4 sm:px-6 md:px-10 lg:px-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center py-20 text-center md:py-28">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(124,58,237,0.2)] bg-[#f5f3ff] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[#7c3aed]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7c3aed]" />
          Cold Therapy · Made in India
        </span>
<div className="">
        <h1 className="max-w-xs md:max-w-4xl font-serif text-[44px] font-light leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          ARA Face Bowl
        </h1>

        <p className="mt-5 max-w-xs md:max-w-xl text-base leading-relaxed text-[#6b7280] p-5 md:text-lg">
          The 60-second cold ritual that resets your skin every morning.
          Built for the people who want one tool that does the job of three.
        </p>
</div>
        <div className="mt-10 w-full max-w-xs md:max-w-4xl overflow-hidden rounded-2xl border border-[rgba(124,58,237,0.1)] shadow-[0_8px_40px_rgba(124,58,237,0.08)]">
          <video
            className="block aspect-video w-full bg-[#faf8ff] object-cover"
            src="https://res.cloudinary.com/dix4pzu0k/video/upload/v1777809328/Landing_aoa94g.mp4"
            autoPlay
            muted
            loop
            
          />
        </div>
<br />
        <div className="mt-10 flex w-full max-w-xs md:max-w-md flex-col gap-3 sm:flex-row">
          <Link href="products/ara-ice-bowl" className="btn-primary flex-1 flex items-center justify-center">
            View Product
          </Link>
          <Link href="/products" className="btn-secondary flex-1 text-center">
            Shop All
          </Link>
        </div>
        <br />
      </div>
    </section>
  );
}
