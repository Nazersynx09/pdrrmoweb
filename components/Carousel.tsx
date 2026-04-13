"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface Slide {
  title: string;
  type: string;
  image: string;
  description: string;
  cta: string;
  ctaLink: string;
}

const slides: Slide[] = [
  {
    title: "EARTHQUAKE PREPAREDNESS",
    type: "Safety Guide",
    image: "/FloodIEC.png",
    description: "Learn essential earthquake safety tips and preparedness measures",
    cta: "Download Guide",
    ctaLink: "/resources",
  },
  {
    title: "FLOOD SAFETY",
    type: "Water Level Advisory",
    image: "/FloodIEC.png",
    description: "Stay safe during flooding events - know your evacuation routes",
    cta: "View Hazard Maps",
    ctaLink: "/resources",
  },
  {
    title: "TYPHOON PREPAREDNESS",
    type: "Emergency Response",
    image: "/FloodIEC.png",
    description: "Prepare your family and home for typhoon season",
    cta: "Emergency Checklist",
    ctaLink: "/resources",
  },
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const DURATION = 4000;

  const handleNextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  const handlePrevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    bar.style.transition = "none";
    bar.style.width = "0%";
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        bar.style.transition = `width ${DURATION}ms linear`;
        bar.style.width = "100%";
      }),
    );
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, DURATION);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [currentSlide]);

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="cover overflow-hidden relative bg-gray-900 aspect-[21/9] shadow-2xl rounded-2xl">
          <div
            className="flex w-full h-full"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {slides.map((slide, i) => (
              <div
                key={i}
                className="min-w-full h-full relative flex items-center justify-center"
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="relative z-10 text-white px-8 sm:px-16 max-w-3xl">
                  <span className="inline-block px-3 py-1 bg-[#F58220] text-xs font-bold uppercase tracking-widest rounded mb-4">
                    {slide.type}
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-wide mb-3">
                    {slide.title}
                  </h2>
                  <p className="text-lg text-slate-200 mb-6 max-w-xl">
                    {slide.description}
                  </p>
                  <Link
                    href={slide.ctaLink}
                    className="inline-flex items-center gap-2 bg-[#F58220] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
                  >
                    {slide.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div
            ref={progressRef}
            className="absolute bottom-0 left-0 h-1 bg-[#F58220]"
          />

          <button
            onClick={handlePrevSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 border border-white/30 rounded-full w-12 h-12 flex items-center justify-center transition backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={handleNextSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 border border-white/30 rounded-full w-12 h-12 flex items-center justify-center transition backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? "w-8 bg-[#F58220]" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
