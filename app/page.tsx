"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Globe,
  Phone,
  Mail,
  LocateIcon,
} from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import type { NextPage } from "next";
import { useRef, useCallback } from "react";

interface Slide {
  title: string;
  type: string;
}

interface UsefulLink {
  label: string;
  sub: string;
  color: string;
  href: string;
}

interface Slide {
  title: string;
  type: string;
  image: string;
}

const formatPhilippineTime = (date: Date) =>
  new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Manila",
  }).format(date);

const Home: NextPage = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [phTime, setPhTime] = useState<string>(() =>
    formatPhilippineTime(new Date())
  );
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhTime(formatPhilippineTime(new Date()));
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const slides: Slide[] = [
  {
    title: "EARTHQUAKE PREPAREDNESS",
    type: "Earthquake info guide",
    image: "/earthquake.jpg",
  },
  {
    title: "FLOOD SAFETY",
    type: "Water level advisory",
    image: "/FloodIEC.png",
  },
  ];

  const issuances: { text: string; href: string }[] = [
    { text: "NDRRMC Memorandum No. 12, s. 2024", href: "#" },
    {
      text: "NDRRMC Memorandum No. 58, s. 2026",
      href: "https://ndrrmc.gov.ph/wp-content/uploads/2026/03/NDRRMC-MEMO-58-s.-2026-Raising-of-the-NDRRMOC-Alert-Status-to-BLUE-ICOW-The-Observance-of-the-Holy-Week-SEMANA-SANTA-2026.pdf",
    },
    {
      text: "NDRRMC Memorandum No. 62, s. 2026",
      href: "https://ndrrmc.gov.ph/wp-content/uploads/2026/03/NDRRMC_Memorandum_No_62_s_2026.pdf",
    },
    {
      text: "PDRRMC Memorandum No. 15, s. 2026",
      href: "https://ndrrmc.gov.ph/wp-content/uploads/2026/02/NDRRMC_Memorandum_No_15_s_2026.pdf",
    },
  ];

  const usefulLinks: UsefulLink[] = [
    {
      label: "PAGASA",
      sub: "Weather Forecast",
      color: "#002E5D",
      href: "https://www.pagasa.dost.gov.ph/",
    },
    {
      label: "DOST-PHIVOLCS",
      sub: "Fault Finder",
      color: "#002E5D",
      href: "https://www.phivolcs.dost.gov.ph/",
    },
    {
      label: "DOST-PHIVOLCS",
      sub: "Earthquake Info",
      color: "#002E5D",
      href: "https://www.phivolcs.dost.gov.ph/",
    },
  ];

  const handleNextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  const handlePrevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const l2 = useRef<SVGSVGElement>(null);
  const l3 = useRef<SVGSVGElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const DURATION = 3500;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (l2.current)
        l2.current.style.transform = `translate(${x * -18}px, ${y * -10}px)`;
      if (l3.current)
        l3.current.style.transform = `translate(${x * -30}px, ${y * -16}px)`;
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    [l2, l3].forEach((ref) => {
      if (ref.current) {
        ref.current.style.transition = "transform 0.8s ease";
        ref.current.style.transform = "translate(0,0)";
        setTimeout(() => {
          if (ref.current) ref.current.style.transition = "";
        }, 800);
      }
    });
  }, []);

useEffect(() => {
  const bar = progressRef.current;
  if (!bar) return;
  bar.style.transition = "none";
  bar.style.width = "0%";
  const raf = requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      bar.style.transition = `width ${DURATION}ms linear`;
      bar.style.width = "100%";
    })
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
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 mt-10">

      {/* ── HERO BANNER ── */}
      <section
        className="relative overflow-hidden bg-[#001f45]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0 bg-linear-to-br from-[#002E5D] via-[#002b5c] to-[#05122f]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:px-8 lg:py-20">
          {/* Logo + Title */}
          <div className="flex flex-col items-center text-center gap-6 sm:flex-row sm:items-center sm:text-left sm:gap-10">
            <div className="shrink-0 flex items-center justify-center w-36 h-36 sm:w-48 sm:h-48 lg:w-60 lg:h-60">
              <Image
                src="/PDRRMO Logo.png"
                alt="PDRRMO Logo"
                width={800}
                height={800}
                className="object-contain w-full h-full"
              />
            </div>

            <div className="text-white min-w-0">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-orange-300 mb-3">
                ILOILO PROVINCIAL GOVERNMENT
              </p>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight">
                PROVINCIAL DISASTER RISK
                <span className="block">REDUCTION &amp; MANAGEMENT</span>
              </h1>
              <p className="mt-4 text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-200">
                PREPARED. RESILIENT. SAFE.
              </p>
            </div>
          </div>

          {/* Contact cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-white shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-orange-200">
                <Phone className="h-3.5 w-3.5 shrink-0" /> HOTLINE
              </div>
              <p className="mt-2 font-semibold text-base sm:text-lg wrap-break-words">
                (033) 328-7920 / 328-7900
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-white shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-orange-200">
                <Mail className="h-3.5 w-3.5 shrink-0" /> EMAIL
              </div>
              <p className="mt-2 font-semibold text-sm sm:text-base break-all">
                pdrrmo_iloilo@yahoo.com.ph
              </p>
              <p className="mt-1 font-semibold text-sm sm:text-base break-all">
                pdrrmo@iloilo.gov.ph
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-white">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-orange-200">
              <LocateIcon className="h-3.5 w-3.5 shrink-0" /> ADDRESS
            </div>
            <p className="mt-2 font-semibold text-sm sm:text-base leading-relaxed">
              3rd Floor, Left Wing, Iloilo Provincial Capitol, Bonifacio Drive,
              Iloilo City
            </p>
          </div>
        </div>
      </section>

      {/* ── CAROUSEL ── */}
      <section className="py-10 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-3 sm:py-1 lg:px-0">
          <div className="cover overflow-hidden relative bg-gray-50 aspect-video shadow-sm">

            {/* Slide track */}
            <div
              className="flex w-full h-full"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
                transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              {slides.map((slide, i) => (
            <div
              key={i}
              className="min-w-full h-full relative flex items-center justify-center"
            >

              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Text Content */}
              <div className="relative z-10 text-center text-white px-6">
                <p className="text-xs font-semibold uppercase tracking-widest bg-orange-500/80 px-3 py-1 rounded inline-block">
                  {slide.type}
                </p>

                <p className="text-2xl sm:text-3xl font-black mt-3 uppercase tracking-wide">
                  {slide.title}
                </p>

                <p className="text-xs mt-3 underline uppercase tracking-widest cursor-pointer">
                  View PDF Guide
                </p>
              </div>

        </div>
      ))}
            </div>

            {/* Progress bar */}
            <div
              ref={progressRef}
              className="absolute bottom-0 left-0 h-3px bg-[#F58220]"
            />

            {/* Nav buttons */}
            <button
              onClick={handlePrevSlide}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center shadow-sm transition"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={handleNextSlide}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 border border-gray-200 rounded-full w-9 h-9 flex items-center justify-center shadow-sm transition"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  i === currentSlide ? "bg-[#F58220] scale-125" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── UPDATES GRID ── */}
      <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Latest Updates */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#F58220] uppercase mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-[#F58220] block shrink-0" />
            Latest Updates
          </h2>

          <div className="space-y-7">
            {/* Issuances */}
            <div className="col grid-cols-2 h-65 overflow-y-hidden">
              <h3 className="text-xs sm:text-sm font-bold text-[#002E5D] uppercase tracking-wider mb-4">
                Issuances
              </h3>
              <div className="space-y-3">
                {issuances.map((issuance, i) => (
                  <a
                    key={i}
                    href={issuance.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 border border-gray-200 rounded hover:border-[#F58220] group transition"
                  >
                    <span className="text-xs sm:text-sm text-[#002E5D] underline font-medium group-hover:text-[#F58220] pr-2 leading-snug">
                      {issuance.text}
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#F58220] shrink-0" />
                  </a>
                ))}
              </div>
            </div>

            {/* Activity Highlights */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-[#002E5D] uppercase tracking-wider mb-4">
                Activities
              </h3>
              <div className="rounded-lg overflow-hidden  shadow-lg max-h-auto">
                <Image
                  src="/GADMeeting.jpg"
                  alt="Recent Activities"
                  width={800}
                  height={200}
                  className="w-full h-44 sm:h-75 object-cover"
                />
                <div className="p-4 bg-white">
                  <p className="text-[11px] font-semibold text-gray-500 uppercase">
                    Hotel del Rio – March 26, 2026
                  </p>
                  <p className="text-sm mt-1 font-bold text-[#002E5D] leading-snug">
                    𝐒𝐓𝐑𝐄𝐍𝐆𝐓𝐇𝐄𝐍𝐈𝐍𝐆 𝐏𝐑𝐎𝐓𝐄𝐂𝐓𝐈𝐎𝐍 𝐅𝐎𝐑 𝐖𝐎𝐌𝐄𝐍 𝐀𝐍𝐃 𝐂𝐇𝐈𝐋𝐃𝐑𝐄𝐍
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FACEBOOK FEED PANEL ── */}
<div className="flex flex-col">
  <h2 className="text-xl sm:text-2xl font-black text-[#F58220] uppercase mb-6 flex items-center gap-2">
    <span className="w-2 h-7 bg-[#F58220] block shrink-0" />
    Disasters & Calamity Updates
  </h2>

  <div className="flex flex-col rounded-xl border border-gray-200 overflow-hidden shadow-md bg-white">

    {/* Header */}
    <div className="bg-[#002E5D] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[#F58220] flex items-center justify-center">
          <FaFacebookF className="w-3.5 h-3.5 text-white" />
        </div>

        <div>
          <p className="text-white text-xs font-bold">
            Operation Center PDRRMO Iloilo
          </p>

          <a
            href="https://www.facebook.com/Heman201"
            target="_blank"
            rel="noreferrer noopener"
            className="text-blue-300 text-[10px] hover:underline"
          >
            facebook.com/Operation Center PDRRMO Iloilo
          </a>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-green-300 text-[10px] font-semibold uppercase tracking-wider">
          Live Feed
        </span>
      </div>
    </div>

    {/* Timestamp */}
    <div className="bg-[#F58220]/10 border-b border-[#F58220]/20 px-4 py-1.5 flex items-center gap-2">
      <span className="w-1.5 h-1.5 bg-[#F58220] rounded-full" />
      <p className="text-[10px] font-bold text-[#002E5D] uppercase tracking-widest">
        As of {phTime}
      </p>
    </div>

    {/* Feed Container */}
    <div className="relative flex justify-center bg-gray-50 p-3 min-h-540px">

      {/* Skeleton loader */}
      {!iframeLoaded && (
        <div className="absolute inset-0 flex flex-col gap-3 p-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-2 bg-gray-200 rounded w-1/3" />
            </div>
          </div>

          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-5/6" />
              <div className="h-24 bg-gray-200 rounded-lg w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Facebook iframe */}
      <iframe
        src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FHeman201&tabs=timeline&width=500&height=540&small_header=true&hide_cover=true&adapt_container_width=true&hide_cover=false&show_facepile=false"
        width="500"
        height="540"
        className={`border-0 transition-opacity duration-500 ${
          iframeLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        scrolling="no"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        onLoad={() => setIframeLoaded(true)}
        title="PDRRMO Iloilo Facebook Feed"
      />
    </div>

    {/* Footer */}
    <div className="bg-gray-50 border-t border-gray-200 px-4 py-2.5 flex items-center justify-between">
      <p className="text-[11px] text-gray-500">
        Follow for real-time disaster updates
      </p>

      <a
        href="https://www.facebook.com/Heman201"
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-1.5 bg-[#002E5D] hover:bg-[#F58220] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-colors"
      >
        <FaFacebookF className="w-3 h-3" />
        Follow Page
      </a>
    </div>

  </div>
</div>
      </section>

      {/* ── USEFUL LINKS ── */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-center text-xl sm:text-2xl font-black text-[#F58220] uppercase mb-10">
            Useful Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {usefulLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="flex flex-col shadow-lg rounded-lg overflow-hidden group hover:-translate-y-1 transition duration-300"
              >
                <div className="bg-white p-4 flex items-center justify-center h-16">
                  <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-[#002E5D] font-bold shrink-0">
                      {link.label[0]}
                    </div>
                    <span className="font-bold text-[#002E5D] text-base sm:text-lg">
                      {link.label}
                    </span>
                  </div>
                </div>
                <div className="bg-[#002E5D] p-3 text-white text-center text-xs font-bold uppercase tracking-widest group-hover:bg-[#F58220] transition">
                  {link.sub}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-gray-200 pt-10 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 border-b border-gray-100 pb-10 mb-7">

          {/* Logos + org names */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex gap-3 shrink-0">
              <Image src="/IPG Logo.png" alt="Provincial Government Logo" width={40} height={40} className="w-10 h-10" />
              <Image src="/PDRRMO Logo.png" alt="PDRRMO Logo" width={40} height={40} className="w-10 h-10" />
              <Image src="/PCDAC.png" alt="Community Defense Logo" width={40} height={40} className="w-10 h-10" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-black uppercase text-gray-400">
                Official Seal
              </p>
              <p className="text-xs font-bold text-[#002E5D] leading-snug">
                Iloilo Provincial Government
              </p>
              <p className="text-xs font-bold text-[#002E5D] leading-snug">
                Iloilo Provincial Disaster Risk Reduction and Management Office
              </p>
              <p className="text-xs font-bold text-[#002E5D] leading-snug">
                Provincial Community Defense Action Center – Iloilo
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-gray-500 flex items-center gap-2">
              <MapPin className="w-4 h-4 shrink-0" /> Contact Us
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              3rd Floor, Left Wing, Iloilo Provincial Capitol, Bonifacio Drive,
              Iloilo City
            </p>
            <p className="text-xs text-gray-600">(033) 338-7951 | 338-7956</p>
            <p className="text-xs text-gray-600 underline break-all">
              pdrrmo.iloilo@yahoo.com.ph
            </p>
          </div>

          {/* Social + portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-gray-500 flex items-center gap-2">
              <FaFacebookF className="w-3.5 h-3.5 shrink-0" /> Follow Us
            </h4>
            <a
              href="https://www.facebook.com/Heman201"
              target="_blank"
              rel="noreferrer noopener"
              className="block text-xs text-gray-600 font-bold underline leading-snug"
            >
              Operation Center PDRRMO Iloilo
            </a>
            <a
              href="https://www.facebook.com/iloilopdrrmo"
              target="_blank"
              rel="noreferrer noopener"
              className="block text-xs text-gray-600 font-bold underline leading-snug"
            >
              Provincial Disaster Risk Reduction and Management Office – Iloilo
            </a>
            <h4 className="text-xs font-black uppercase text-gray-500 flex items-center gap-2 pt-2">
              <Globe className="w-4 h-4 shrink-0" /> Portals
            </h4>
            <a
              href="https://iloilo.gov.ph/"
              target="_blank"
              rel="noreferrer noopener"
              className="block text-xs text-gray-600 font-bold underline"
            >
              Iloilo.gov.ph
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] text-gray-400 font-bold uppercase text-center sm:text-left">
          <p>Developed by: PDRRMO Research and Planning Intern (Batch 2025)</p>
          <p className="shrink-0">© 2024 All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;