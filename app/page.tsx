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
  Menu,
  X,
} from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import type { NextPage } from "next";
import Link from "next/link";
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
  const [phTime, setPhTime] = useState<string>(() => formatPhilippineTime(new Date()));
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhTime(formatPhilippineTime(new Date()));
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  const slides: Slide[] = [
    { title: "EARTHQUAKE PREPAREDNESS", type: "Earthquake info guide" },
    { title: "FLOOD SAFETY", type: "Water level advisory" },
  ];

  const issuances: { text: string; href: string }[] = [
    { text: "NDRRMC Memorandum No. 12, s. 2024", href: "#" },
    { text: "NDRRMC Memorandum No. 58, s. 2026", href: "https://ndrrmc.gov.ph/wp-content/uploads/2026/03/NDRRMC-MEMO-58-s.-2026-Raising-of-the-NDRRMOC-Alert-Status-to-BLUE-ICOW-The-Observance-of-the-Holy-Week-SEMANA-SANTA-2026.pdf" },
    { text: "NDRRMC Memorandum No. 62, s. 2026", href: "https://ndrrmc.gov.ph/wp-content/uploads/2026/03/NDRRMC_Memorandum_No_62_s_2026.pdf" },
    { text: "PDRRMC Memorandum No. 15, s. 2026", href: "https://ndrrmc.gov.ph/wp-content/uploads/2026/02/NDRRMC_Memorandum_No_15_s_2026.pdf" },
  ];

  const usefulLinks: UsefulLink[] = [
    { label: "PAGASA", sub: "Weather Forecast", color: "#002E5D", href: "https://www.pagasa.dost.gov.ph/" },
    { label: "DOST-PHIVOLCS", sub: "Fault Finder", color: "#002E5D", href: "https://www.phivolcs.dost.gov.ph/" },
    { label: "DOST-PHIVOLCS", sub: "Earthquake Info", color: "#002E5D", href: "https://www.phivolcs.dost.gov.ph/" },
  ];

  const panahonMapUrl = "https://panahon.gov.ph/?region=iloilo";

  const handleNextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const handlePrevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const l2 = useRef<SVGSVGElement>(null);
  const l3 = useRef<SVGSVGElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    if (l2.current) l2.current.style.transform = `translate(${x * -18}px, ${y * -10}px)`;
    if (l3.current) l3.current.style.transform = `translate(${x * -30}px, ${y * -16}px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    [l2, l3].forEach(ref => {
      if (ref.current) {
        ref.current.style.transition = "transform 0.8s ease";
        ref.current.style.transform = "translate(0,0)";
        setTimeout(() => { if (ref.current) ref.current.style.transition = ""; }, 800);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* --- TOP NAVIGATION --- */}
      <nav className="bg-[#002E5D] text-white fixed top-0 w-full z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="/PDRRMO Logo.png" alt="Logo" width={40} height={40} className="object-contain" />
            <span className="font-bold tracking-tight hidden md:block text-sm">PDRRMO ILOILO</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wide">
            <Link href="/" className="hover:text-orange-400 transition">Home</Link>
            <Link href="/about-pdrrmo" className="hover:text-orange-400 transition">About PDRRMO</Link>
            <Link href="/about-pdrrmc" className="hover:text-orange-400 transition">About PDRRMC</Link>
            <Link href="/programs-services" className="hover:text-orange-400 transition">Programs and Services</Link>
            <Link href="/resources" className="hover:text-orange-400 transition">Resources</Link>
            <Link href="/operation-center" className="hover:text-orange-400 transition">Operation Center</Link>
          </div>

          {/* Right side: PH time + Emergency + Hamburger */}
          <div className="flex items-center gap-3">
            {/* PH Time — hidden on mobile, shown on desktop */}
            <div className="hidden lg:flex items-center gap-2 bg-white/10 border border-white/20 rounded-md px-3 py-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full shrink-0" />
              <div>
                <p className="text-[9px] uppercase tracking-widest text-white/50 leading-none">PH Time</p>
                <p className="text-[11px] font-semibold text-white leading-tight">{phTime}</p>
              </div>
            </div>

            <Link
              href="/emergency"
              className="hidden lg:inline-block bg-[#F58220] hover:bg-orange-600 px-4 py-2 rounded font-bold text-xs uppercase transition text-center"
            >
              Emergency Contact
            </Link>

            {/* Hamburger — mobile only */}
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-auto w-auto" /> : <Menu className="h-auto w-auto" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#001f45] border-t border-white/10 px-4 py-4">
            <div className="flex flex-col divide-y divide-white/10">
              {[
                ["Home", "/"],
                ["About PDRRMO", "/about-pdrrmo"],
                ["About PDRRMC", "/about-pdrrmc"],
                ["Programs and Services", "/programs-services"],
                ["Resources", "/resources"],
                ["Operation Center", "/operation-center"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 text-xs font-semibold uppercase tracking-wide text-white/85 hover:text-orange-400 transition"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* PH Time in mobile menu */}
            <div className="mt-4 flex items-center gap-2 text-white/60 text-xs py-2 border-t border-white/10">
              <span className="w-2 h-2 bg-green-400 rounded-full shrink-0" />
              PH Time: <span className="font-semibold text-white">{phTime}</span>
            </div>

            <Link
              href="/emergency"
              onClick={() => setIsMenuOpen(false)}
              className="mt-3 block bg-[#F58220] hover:bg-orange-600 text-white text-center py-2.5 rounded font-bold text-xs uppercase transition"
            >
              Emergency Contact
            </Link>
          </div>
        )}
      </nav>

      {/* --- HERO BANNER --- */}
      <section
        className="relative overflow-hidden bg-[#001f45]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0 bg-linear-to-br from-[#002E5D] via-[#002b5c] to-[#05122f]" />

        <div className="absolute inset-0 opacity-40">
          <div className="absolute right-8 top-8 h-24 w-1 rounded-full bg-white/20" />
          <div className="absolute right-16 top-20 h-16 w-1 rounded-full bg-white/15" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-center">
            <div className="flex items-center justify-center lg:justify-start">
              <div className="flex h-60 w-60 items-center justify-center">
                <Image
                  src="/PDRRMO Logo.png"
                  alt="PDRRMO Logo"
                  width={800}
                  height={800}
                  className="object-contain"
                />
              </div>
            </div>

            <div className="text-white">
              <p className="text-xs uppercase tracking-[0.35em] text-orange-300 mb-4">
                ILOILO PROVINCIAL GOVERNMENT
              </p>
              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                PROVINCIAL DISASTER RISK
                <span className="block">REDUCTION & MANAGEMENT</span>
              </h1>
              <p className="mt-6 text-sm uppercase tracking-[0.35em] text-slate-200 sm:text-base">
                PREPARED. RESILIENT. SAFE.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-orange/100 bg-white/10 p-4 text-white shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-orange-200">
                <Phone className="h-4 w-4" /> HOTLINE
              </div>
              <p className="mt-3 font-semibold text-lg">(033) 328-7920 / 328-7900</p>
            </div>
            <div className="rounded-3xl border border-orange/15 bg-white/10 p-4 text-white shadow-xl backdrop-blur-sm gap-2">
              <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-orange-200">
                <Mail className="h-4 w-4" /> EMAIL
              </div>
              <p className="mt-3 font-semibold text-lg">pdrrmo_iloilo@yahoo.com.ph</p>
              <p className="mt-3 font-semibold text-lg">pdrrmo@iloilo.gov.ph</p>
            </div>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-1">
              <div className=" p-4 text-white">
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-orange-200">
                  <LocateIcon className="h-4 w-4" /> ADDRESS
                </div>
                <p className="mt-3 font-semibold text-lg">3rd Floor, Left Wing, Iloilo Provincial Capitol, Bonifacio Drive, Iloilo City</p>
              </div>
          </div>
        </div>
      </section>

      {/* --- CAROUSEL --- */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="bg-[#F58220] text-white px-6 py-2 rounded-t-lg inline-block text-xl font-bold uppercase tracking-widest">
            {slides[currentSlide].title}
          </div>
          <div className="border-3 border-[#F58220] rounded-b-lg rounded-tr-lg overflow-hidden shadow-xl aspect-video relative group bg-gray-100 flex items-center justify-center">
            <div className="text-center p-8">
              <p className="text-gray-400 italic">Preparedness Infographic Illustration goes here</p>
              <p className="text-xs mt-2 text-gray-500 underline uppercase tracking-widest cursor-pointer">View PDF Guide</p>
            </div>

            <button onClick={handlePrevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition">
              <ChevronLeft />
            </button>
            <button onClick={handleNextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition">
              <ChevronRight />
            </button>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition ${i === currentSlide ? "bg-[#F58220]" : "bg-gray-300"}`}></div>
            ))}
          </div>
        </div>
      </section>

      {/* --- UPDATES GRID --- */}
      <section className="py-12 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
        {/* Latest Updates */}
        <div>
          <h2 className="text-2xl font-black text-[#F58220] uppercase mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-[#F58220] block"></span>Latest Updates
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-[#002E5D] uppercase tracking-tighter mb-4">Issuances</h3>
              <div className="space-y-2">
                {issuances.map((issuance, i) => (
                  <a
                    key={i}
                    href={issuance.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 border border-gray-200 rounded hover:border-[#F58220] group transition"
                  >
                    <span className="text-sm text-[#002E5D] underline font-medium group-hover:text-[#F58220]">{issuance.text}</span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#F58220]" />
                  </a>
                ))}
              </div>
            </div>

            {/* --- Activity Higlights --- */}

            <div>
              <h3 className="text-sm font-bold text-[#002E5D] uppercase tracking-tighter mb-4">Activities</h3>
              <div className="rounded-lg overflow-hidden border-4 border-gray-100 shadow-lg">
                <Image
                  src="/GADMeeting.jpg"
                  alt="Recent Activities"
                  width={800}
                  height={192}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 bg-white">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Hotel del Rio - March 26, 2026</p>
                  <p className="text-sm mt-1 font-bold text-[#002E5D]">𝐒𝐓𝐑𝐄𝐍𝐆𝐓𝐇𝐄𝐍𝐈𝐍𝐆 𝐏𝐑𝐎𝐓𝐄𝐂𝐓𝐈𝐎𝐍 𝐅𝐎𝐑 𝐖𝐎𝐌𝐄𝐍 𝐀𝐍𝐃 𝐂𝐇𝐈𝐋𝐃𝐑𝐄𝐍</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Disasters and Calamity Updates */}
        <div className="flex flex-col h-full">
          <h2 className="text-2xl font-black text-[#F58220] uppercase mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-[#F58220] block"></span>Disasters and Calamity Updates
          </h2>
          <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm flex flex-col">
            <div className="bg-[#F58220] p-3 text-white text-center text-xs font-bold flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              AS OF {phTime}
            </div>
            <div className="flex-1 flex items-center justify-center text-gray-400 italic text-sm p-10 text-center">
              <iframe
              src={panahonMapUrl}
              title="Panahon weather map"
              className="w-full h-full"
              loading="lazy"
              style={{ minHeight: 400, minWidth: 650 }}
            />
            </div>
          </div>
        </div>
      </section>

      {/* --- USEFUL LINKS --- */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-2xl font-black text-[#F58220] uppercase mb-10">Useful Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {usefulLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col shadow-lg rounded-lg overflow-hidden group hover:-translate-y-1 transition duration-300"
              >
                <div className="bg-white p-4 flex items-center justify-center h-16">
                  <div className="flex gap-2 items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-[#002E5D] font-bold">{link.label[0]}</div>
                    <span className="font-bold text-[#002E5D] text-lg">{link.label}</span>
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

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-200 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-10 border-b border-gray-100 pb-10 mb-7">
          <div className="flex items-center gap-20">
            <div className="flex gap-3">
              <Image
                src="/IPG Logo.png"
                alt="Provincial Government Logo"
                width={40}
                height={40}
              />
              <Image
                src="/PDRRMO Logo.png"
                alt="PDRRMO Logo"
                width={40}
                height={40}
              />
              <Image
                src="/PCDAC.png"
                alt="Community Defense Logo"
                width={40}
                height={40}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-black uppercase text-gray-400">Official Seal</p>
              <p className="text-xs font-bold text-[#002E5D]">Iloilo Provincial Government</p>
              <p className="text-xs font-bold text-[#002E5D]">Iloilo Provincial Disaster Risk Reduction and Management Office</p>
              <p className="text-xs font-bold text-[#002E5D]">Provincial Community Defense Action Center - Iloilo</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-gray-500 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Contact Us
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              3rd Floor, Left Wing, Iloilo Provincial Capitol, Bonifacio Drive, Iloilo City
            </p>
            <p className="text-xs text-gray-600">(033) 338-7951 | 338-7956</p>
            <p className="text-xs text-gray-600 underline">pdrrmo.iloilo@yahoo.com.ph</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-gray-500 flex items-center gap-2">
              <FaFacebookF className="w-4 h-4" /> Follow Us
            </h4>
            <div className="space-y-2">
              <a
                href="https://www.facebook.com/Heman201"
                target="_blank"
                rel="noreferrer noopener"
                className="block text-xs text-gray-600 font-bold underline"
              >
                Operation Center PDRRMO Iloilo
              </a>
              <a
                href="https://www.facebook.com/iloilopdrrmo"
                target="_blank"
                rel="noreferrer noopener"
                className="block text-xs text-gray-600 font-bold underline"
              >
                Provincial Disaster Risk Reduction and Management Office - Iloilo
              </a>
            </div>
            <h4 className="text-xs font-black uppercase text-gray-500 flex items-center gap-2 mt-4">
              
              <Globe className="w-4 h-4" /> Portals
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

        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 font-bold uppercase">
          <p>Developed by: PDRRMO Research and Planning Intern (Batch 2025)</p>
          <p>© 2024 All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;