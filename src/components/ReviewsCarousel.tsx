"use client";

import { Star } from "lucide-react";

interface Review {
  name: string;
  content: string;
  status?: "selected" | "ok" | "done" | "no";
}

const reviews: Review[] = [
  {
    name: "Keerthana Sundar",
    content: "been doing ice facials with a steel bowl for over a year and honestly kept wondering why it wasn't doing much. my friend sent me this link and I bought it mostly to prove it wasn't worth it. bowl rim thing is not a gimmick I was lifting my face every 8-9 seconds with the steel bowl without even realising. now I actually complete the full dip and the difference in results is kind of embarrassing. skin looks more sorted in the mornings. less angry. been a month now.",
    status: "selected",
  },
  {
    name: "Anjana Ghosh",
    content: "I don't write reviews. ever. but my bestie asked me three times in one week what I was doing differently to my skin and I felt like I had to say something somewhere. I added the beetroot powder into the water and the water turns this deep pink colour and yes it sounds completely made up but my complexion looks genuinely different. the bowl itself also doesn't feel cheap at all surprised for the price honestly.",
    status: "ok",
  },
  {
    name: "Harleen Sidhu",
    content: "Yarrrr I've tried ice bowls earlier but honestly wo sab thode din baad tut jati thi and kitchen bowl to wese bhi iske liye useless thii… Mene ara ki ice bowl try kii us se pehle mujhe thoda shakk to tha kii ye bhi dusre brands jese hii tut jayegii but honestly… I was completely wrong. puffiness jo meri morning face ki permanent problem thi, wo nahi rahi. 3 hafte se daily kar ice therapy rahi hu. bas ek cheez ice tray bharne ki aadat daalni padti hai raat ko warna subah muh dekhna padta hai apna 😭",
    status: "ok",
  },
  {
    name: "Neeraj Choudhary",
    content: "I am a 33 year old man who has never cared about skincare in his life. My wife ordered this. I tried it once as a joke to tease her doing this. I now use it every morning 😂. I don't know what is happening to my face in those 15 seconds but something is.",
    status: "done",
  },
  {
    name: "Shalini Pillai",
    content: "Its amazing ,, I fill it before sleeping, wake up, do ice therapy and it's done. that's actually the reason I haven't skipped a single morning in five weeks zero friction. my face feels cleaner and more fresh after than it does after a facewash. pores get tighter.",
    status: "done",
  },
  {
    name: "Bhavana Shekhawat",
    content: "TBH i've very sensitive skin , like kuch bhi try krlu react kr jati hai wo but ye natural ice therapy ne wo prblem hii durr krdii , like it's natural and koi opposite reaction bhi nhi hota meri skin prr, ulta skin pehle se zyada calm hai. 1 mahina ho gaya. And ab jo bhi mere open pores ki problem thi wo bhi thik ho rhi hai… ye mere liye badi baat hai.",
    status: "done",
  },
  {
    name: "Prateeik Sahdev",
    content: "Bhai me un logo me se hu jisko skincare ka S bhi nhi pata , bss ek din meri gf ne mujhe ye gift kiya tha for obvious reasons and she taught me how to use it, and ykw broo this literally works , mtlb sirf 2 minutes ka kaam hai subah and pure din fresh skin rhti hai , 2 minutes to nikal hi skta hu me apni skin ke liye 😅",
  },
  {
    name: "Aravind Venkat",
    content: "ignored the ads for this for probably 4 months. finally bought it when my sister wouldn't stop talking about it. skin in the mornings used to look like I hadn't slept even when I had. now it just looks like a normal human face before 8am which is new. wish I hadn't waited so long.",
  },
  {
    name: "Prachi Mishra",
    content: "oily skin wali ladkiyon sun lo mujhe 10 baje tak blotting paper use karna padta tha. And ara ice bowl use krne ke baad ab 2-3 baje tak nahi chahiye. pata nahi science kya hai lekin pore tight ho jaate hain aur oil genuinely kam hua hai. teen hafte ho gaye. And yaa ek bhi din skip nhi kiya menee.",
  },
  {
    name: "Kavitha Nair",
    content: "I don't know what the beetroot powder is doing exactly but my cheekbones look more defined and my skin has this brightness that I've been chasing with products for years. I thought it would stain my face or something but it doesn't. the bowl is also really sturdy, I've been travelling with it and it's held up fine. wouldn't go back to not doing this.",
  },
  {
    name: "Poonam Parihar",
    content: "meri skin dry hai aur winters mein bilkul bhi glow nahi hota. socha cold therapy se aur bura hoga. but roz subah karne ke baad skin actually zyada hydrated lagti hai, tight nahi  fark pata hai dono mein. 3 hafte ho gaye, koi irritation nahi, ulta complexion even hua hai. mujhe ye expect nahi tha honestly.",
  },
  {
    name: "Kuldeep Singh Rathore",
    content: "I bought this for my wife and she's been using it every single morning without fail for a month now. I don't remember the last time she stuck to any skincare product this consistently. her skin looks visibly clearer and the dark circles she's had for years have actually faded. whatever this is doing, it's working.",
  },
  {
    name: "Sneha Joshi",
    content: "oily skin pe ice therapy karna thoda scary lagta hai pehle pehle. but T-zone genuinely control mein hai ab. 11 baje tak jo shiny look aata tha wo nahi aata. aur foundation bhi pehle se zyada tik rahi hai. chota sa step hai subah ka lekin difference bada hai.",
    status: "no",
  },
  {
    name: "Hetal Patel",
    content: "I've spent way more on face masks, toners, exfoliators most of them are just sitting in my cabinet now. this ₹399 bowl has done more in 3 weeks than all of them combined. puffiness is gone, skin looks brighter, and honestly I just feel more put together in the mornings. simple things work I guess.",
    status: "ok",
  },
  {
    name: "Dhruv Shah",
    content: "gifted this to my wife along with the beetroot powder. she was skeptical said it sounds like something people do in videos but doesn't actually work. two weeks later she told me it's the only thing in her routine she won't skip. that's all I needed to hear.",
    status: "ok",
  },
];

const getStatusColor = (status?: string) => {
  switch (status) {
    case "selected":
      return "bg-[#7c3aed] text-white";
    case "done":
      return "bg-green-100 text-green-700";
    case "ok":
      return "bg-blue-100 text-blue-700";
    case "no":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function ReviewsCarousel() {
  return (
    <section className="w-full bg-white py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  section">
        <h2 className="font-serif text-4xl md:text-5xl font-light text-[#0f0a1e] mb-4">
          Real people, <em className="italic text-[#7c3aed]">real results</em>
        </h2>
        <p className="text-base md:text-lg text-[#6b7280] max-w-2xl">
          Join thousands who've transformed their skincare routine with ARA cold therapy
        </p>
      </div>
      <br />

      {/* Carousel */}
      <div className="relative w-full overflow-hidden">
        <style>{`
          @keyframes scroll-right-to-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .reviews-carousel {
            animation: scroll-right-to-left 90s linear infinite;
          }
          .reviews-carousel:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="reviews-carousel flex gap-6 w-fit">
          {/* Original set */}
          {reviews.map((review, idx) => (
            <div
              key={`original-${idx}`}
              className="flex-shrink-0 w-125 bg-[#faf8ff] border border-[rgba(124,58,237,0.15)] rounded-2xl p-10 hover:border-[#7c3aed] hover:shadow-lg transition-all duration-300 text-center flex flex-col"
            >
              {/* Reviewer name */}
              <p className="font-medium text-[#0f0a1e] text-lg mb-4">
                {review.name}
              </p>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-6 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-[#c9a96e] text-[#c9a96e]"
                  />
                ))}
              </div>

              {/* Review content */}
              <p className="text-[15px] text-[#6b7280] leading-relaxed mb-6 flex-1">
                {review.content}
              </p>

              
            </div>
          ))}

          {/* Duplicate set for seamless loop */}
          {reviews.map((review, idx) => (
            <div
              key={`duplicate-${idx}`}
              className="flex-shrink-0 w-125 bg-[#faf8ff] border border-[rgba(124,58,237,0.15)] rounded-2xl p-10 hover:border-[#7c3aed] hover:shadow-lg transition-all duration-300 text-center flex flex-col"
            >
              {/* Reviewer name */}
              <p className="font-medium text-[#0f0a1e] text-lg mb-4">
                {review.name}
              </p>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-6 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-[#c9a96e] text-[#c9a96e]"
                  />
                ))}
              </div>

              {/* Review content */}
              <p className="text-[15px] text-[#6b7280] leading-relaxed mb-6 flex-1">
                {review.content}
              </p>

              {/* Status badge */}
              {review.status && (
                <div className="flex justify-center">
                  <span
                    className={`text-[11px] font-semibold tracking-[0.08em] uppercase px-3 py-1 rounded-full ${getStatusColor(
                      review.status
                    )}`}
                  >
                    {review.status}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gradient fade edges */}
      <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </section>
  );
}
