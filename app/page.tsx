"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Globe,
} from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import type { NextPage } from "next";

interface Slide {
  title: string;
  type: string;
}

interface UsefulLink {
  label: string;
  sub: string;
  color: string;
}

const Home: NextPage = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const slides: Slide[] = [
    { title: "EARTHQUAKE PREPAREDNESS", type: "Earthquake info guide" },
    { title: "FLOOD SAFETY", type: "Water level advisory" },
  ];

  const issuances: string[] = [
    "NDRRMC Memorandum No. 12, s. 2024",
    "NDRRMC Memorandum No. 08, s. 2024",
    "NDRRMC Memorandum No. 01, s. 2024",
    "PDRRMC Memorandum No. 155, s. 2023",
  ];

  const usefulLinks: UsefulLink[] = [
    { label: "PAGASA", sub: "Weather Forecast", color: "#002E5D" },
    { label: "DOST-PHIVOLCS", sub: "Fault Finder", color: "#002E5D" },
    { label: "DOST-PHIVOLCS", sub: "Earthquake Info", color: "#002E5D" },
  ];

  const handleNextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const handlePrevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* --- TOP NAVIGATION --- */}
      <nav className="bg-[#002E5D] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
              <Image
                src="/PDRRMO Logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
            <span className="font-bold tracking-tight hidden md:block">PDRRMO ILOILO</span>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium uppercase tracking-wide">
            <a href="/" className="hover:text-orange-400 transition">Home</a>
            <a href="/components/About PDRRMO" className="hover:text-orange-400 transition">About PDRRMO</a>
            <a href="/components/About PDRRMC" className="hover:text-orange-400 transition">About PDRRMC</a>
            <a href="/components/Programs and Services" className="hover:text-orange-400 transition">Programs and Services</a>
            <a href="/components/Resources" className="hover:text-orange-400 transition">Resources</a>
            <a href="/components/Operation Center" className="hover:text-orange-400 transition">Operation Center</a>
          </div>

          <button className="bg-[#F58220] hover:bg-orange-600 px-4 py-2 rounded font-bold text-xs uppercase transition">
            Emergency Contact
          </button>
        </div>
      </nav>

      {/* --- HERO BANNER --- */}
      <section className="relative flex h-[400px] md:h-[550px] w-full flex-col items-center justify-center overflow-hidden bg-[#002b5c]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/banner%20final.svg"
            alt="PDRRMO Banner"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>
      </section>

      {/* --- CAROUSEL --- */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 relative">
          <div className="bg-[#F58220] text-white px-6 py-2 rounded-t-lg inline-block text-xl font-bold uppercase tracking-widest">
            {slides[currentSlide].title}
          </div>
          <div className="border-4 border-[#F58220] rounded-b-lg rounded-tr-lg overflow-hidden shadow-xl aspect-video relative group bg-gray-100 flex items-center justify-center">
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
                {issuances.map((text, i) => (
                  <a key={i} href="#" className="flex items-center justify-between p-3 border border-gray-200 rounded hover:border-[#F58220] group transition">
                    <span className="text-sm text-[#002E5D] underline font-medium group-hover:text-[#F58220]">{text}</span>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#F58220]" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#002E5D] uppercase tracking-tighter mb-4">Activities</h3>
              <div className="rounded-lg overflow-hidden border-4 border-gray-100 shadow-lg">
                <Image
                  src="/PDRRMO Calling Card.png"
                  alt="Recent Activities"
                  width={800}
                  height={192}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 bg-white">
                  <p className="text-xs font-semibold text-gray-500 uppercase">Field Operations - Jan 2024</p>
                  <p className="text-sm mt-1 font-bold text-[#002E5D]">Iloilo Rescue Team performing routine safety inspection at the Provincial Capital.</p>
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
              AS OF JANUARY 25, 2024 - 5:15 PM
            </div>
            <div className="flex-1 flex items-center justify-center text-gray-400 italic text-sm p-10 text-center">
              <p>No active weather systems or disaster alerts in the Iloilo area as of this report.</p>
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
              <a key={i} href="#" className="flex flex-col shadow-lg rounded-lg overflow-hidden group hover:-translate-y-1 transition duration-300">
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
            <p className="text-xs text-gray-600 font-bold">Operation Control PDRRMO Iloilo</p>
            <h4 className="text-xs font-black uppercase text-gray-500 flex items-center gap-2 mt-4">
              
              <Globe className="w-4 h-4" /> Portals
            </h4>
            <p className="text-xs text-gray-600 font-bold underline">Iloilo.gov.ph</p>
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