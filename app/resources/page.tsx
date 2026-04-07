"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Globe, FileText, Map, Award, ChevronRight, Download, ExternalLink, X, ZoomIn } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const hazardMaps = [
  { id: 1, label: "Flood Hazard Map", src: "/hazard-map-1.jpg", desc: "Municipal flood risk zones across Iloilo Province" },
  { id: 2, label: "Storm Surge Map",  src: "/hazard-map-2.jpg", desc: "Coastal storm surge susceptibility areas" },
  { id: 3, label: "Landslide Map",    src: "/hazard-map-3.jpg", desc: "Landslide-prone zones and evacuation routes" },
];

const issuances = [
  { label: "NDRRMC Memorandum No. 14, s.2025", href: "#", date: "2025" },
  { label: "NDRRMC Memorandum No. 10, s.2025", href: "#", date: "2025" },
  { label: "NDRRMC Memorandum No. 30, s.2025", href: "#", date: "2025" },
  { label: "NDRRMC Memorandum No. 31, s.2025", href: "#", date: "2025" },
  { label: "NDRRMC Memorandum No. 383, s.2024", href: "#", date: "2024" },
  { label: "NDRRMC Memorandum No. 310, s.2024", href: "#", date: "2024" },
  { label: "NDRRMC Memorandum No. 221, s.2024", href: "#", date: "2024" },
];

type GKYear = "2024" | "2023" | "2022";
type GKCategory = "Special Awards" | "Hall of Fame" | "Search Results";

const gawadKalasagData: Record<GKYear, Record<GKCategory, { name: string; region: string; classRating: string }[]>> = {
  "2024": {
    "Special Awards": [
      { name: "Taekwondo Iloilo Province Dragons Brigade, Inc.", region: "VI", classRating: "SA-GK" },
      { name: "Iloilo Provincial DRRM Council",                 region: "VI", classRating: "SA-GK" },
    ],
    "Hall of Fame": [
      { name: "Municipality of Pavia",    region: "VI", classRating: "HF-GK" },
      { name: "Municipality of Leganes",  region: "VI", classRating: "HF-GK" },
    ],
    "Search Results": [
      { name: "Municipality of Maasin",   region: "VI", classRating: "Gold"   },
      { name: "Municipality of Calinog",  region: "VI", classRating: "Silver" },
      { name: "Municipality of Igbaras",  region: "VI", classRating: "Bronze" },
    ],
  },
  "2023": {
    "Special Awards": [
      { name: "Iloilo Rescue Team Alpha",      region: "VI", classRating: "SA-GK" },
    ],
    "Hall of Fame": [
      { name: "Municipality of Dumangas",      region: "VI", classRating: "HF-GK" },
    ],
    "Search Results": [
      { name: "Municipality of Badiangan",     region: "VI", classRating: "Gold"   },
      { name: "Municipality of Oton",          region: "VI", classRating: "Silver" },
    ],
  },
  "2022": {
    "Special Awards": [
      { name: "Provincial Rescue Task Force",  region: "VI", classRating: "SA-GK" },
    ],
    "Hall of Fame": [
      { name: "Municipality of Anilao",        region: "VI", classRating: "HF-GK" },
    ],
    "Search Results": [
      { name: "Municipality of Cabatuan",      region: "VI", classRating: "Gold"   },
    ],
  },
};

const gkYears: GKYear[]      = ["2024", "2023", "2022"];
const gkCategories: GKCategory[] = ["Special Awards", "Hall of Fame", "Search Results"];

const categoryColor: Record<GKCategory, string> = {
  "Special Awards": "bg-[#002E5D]",
  "Hall of Fame":   "bg-amber-600",
  "Search Results": "bg-emerald-700",
};

const ratingBadge: Record<string, string> = {
  Gold:   "bg-amber-100 text-amber-800 border border-amber-300",
  Silver: "bg-gray-100 text-gray-700 border border-gray-300",
  Bronze: "bg-orange-100 text-orange-800 border border-orange-300",
  "SA-GK": "bg-blue-100 text-blue-800 border border-blue-300",
  "HF-GK": "bg-purple-100 text-purple-800 border border-purple-300",
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  const [lightboxSrc, setLightboxSrc]   = useState<string | null>(null);
  const [lightboxLabel, setLightboxLabel] = useState("");
  const [activeYear, setActiveYear]     = useState<GKYear>("2024");
  const [activeCategory, setActiveCategory] = useState<GKCategory>("Special Awards");
  const [issuanceFilter, setIssuanceFilter] = useState<string>("All");

  const openLightbox = (src: string, label: string) => {
    setLightboxSrc(src);
    setLightboxLabel(label);
  };

  const filteredIssuances =
    issuanceFilter === "All"
      ? issuances
      : issuances.filter((i) => i.date === issuanceFilter);

  const tableRows = gawadKalasagData[activeYear][activeCategory] ?? [];

  return (
    <div className="min-h-screen bg-[#f8f9fb] font-sans text-slate-900 mt-10">

      {/* ── NAV ── */}

      {/* ── HERO BANNER ── */}
      <div className="bg-[#002E5D] text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">PDRRMO Iloilo</p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Resources</h1>
          <p className="text-blue-200 text-sm max-w-xl">
            Access hazard maps, official issuances, and Gawad Kalasag recognition records for Iloilo Province.
          </p>
          {/* Quick jump links */}
          <div className="flex flex-wrap gap-3 mt-5">
            {[
              { href: "#hazard-maps", icon: <Map className="w-3.5 h-3.5" />, label: "Hazard Maps" },
              { href: "#issuances",   icon: <FileText className="w-3.5 h-3.5" />, label: "Issuances" },
              { href: "#gawad",       icon: <Award className="w-3.5 h-3.5" />, label: "Gawad Kalasag" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full transition border border-white/20"
              >
                {item.icon} {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-12 space-y-16">

        {/* ══ HAZARD MAPS ══ */}
        <section id="hazard-maps">
          <div className="flex items-center gap-3 mb-6">
            <Map className="w-5 h-5 text-[#F58220]" />
            <h2 className="text-xl font-black text-[#002E5D] uppercase tracking-wide">Hazard Maps</h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {hazardMaps.map((map) => (
              <div
                key={map.id}
                onClick={() => openLightbox(map.src, map.label)}
                className="group cursor-zoom-in bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <Image
                    src={map.src}
                    alt={map.label}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-[#002E5D]/0 group-hover:bg-[#002E5D]/40 transition-colors duration-200 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-bold text-sm text-[#002E5D]">{map.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{map.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ ISSUANCES ══ */}
        <section id="issuances">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-5 h-5 text-[#F58220]" />
            <h2 className="text-xl font-black text-[#002E5D] uppercase tracking-wide">Issuances</h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Year filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {["All", "2025", "2024"].map((yr) => (
              <button
                key={yr}
                onClick={() => setIssuanceFilter(yr)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${
                  issuanceFilter === yr
                    ? "bg-[#002E5D] text-white border-[#002E5D]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
            {filteredIssuances.map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-blue-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-[#002E5D] shrink-0" />
                  <span className="text-sm text-[#002E5D] font-medium group-hover:underline">{item.label}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{item.date}</span>
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-[#002E5D] transition" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ══ GAWAD KALASAG ══ */}
        <section id="gawad">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-5 h-5 text-[#F58220]" />
            <h2 className="text-xl font-black text-[#002E5D] uppercase tracking-wide">Gawad Kalasag</h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Year tabs */}
          <div className="flex gap-2 mb-5">
            {gkYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setActiveYear(yr)}
                className={`px-5 py-2 rounded-md text-sm font-bold border-2 transition ${
                  activeYear === yr
                    ? "bg-[#F58220] text-white border-[#F58220]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            {gkCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wide border-2 transition ${
                  activeCategory === cat
                    ? `${categoryColor[cat]} text-white border-transparent`
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table heading banner */}
            <div className={`${categoryColor[activeCategory]} text-white px-5 py-3`}>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                {activeYear} Gawad Kalasag — {activeCategory}
              </p>
            </div>

            {tableRows.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">No records for this category and year.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-3 text-xs font-black uppercase text-gray-500 tracking-wide">Name</th>
                    <th className="text-center px-4 py-3 text-xs font-black uppercase text-gray-500 tracking-wide">Region</th>
                    <th className="text-center px-4 py-3 text-xs font-black uppercase text-gray-500 tracking-wide">Class / Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tableRows.map((row, i) => (
                    <tr key={i} className="hover:bg-blue-50 transition">
                      <td className="px-5 py-3.5 font-medium text-[#002E5D]">{row.name}</td>
                      <td className="px-4 py-3.5 text-center text-gray-600">{row.region}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${ratingBadge[row.classRating] ?? "bg-gray-100 text-gray-600"}`}>
                          {row.classRating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </main>

      {/* ── LIGHTBOX ── */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-100 bg-black/85 flex items-center justify-center p-6"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition"
            onClick={() => setLightboxSrc(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <p className="text-white text-sm font-bold mb-3 text-center">{lightboxLabel}</p>
            <Image
              src={lightboxSrc}
              alt={lightboxLabel}
              width={1200}
              height={800}
              className="w-full rounded-xl shadow-2xl object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-gray-200 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-10 border-b border-gray-100 pb-10 mb-7">
          <div className="flex items-start gap-4">
            <div className="flex gap-3 shrink-0">
              <Image src="/IPG Logo.png"   alt="Provincial Government Logo" width={40} height={40} />
              <Image src="/PDRRMO Logo.png" alt="PDRRMO Logo"               width={40} height={40} />
              <Image src="/PCDAC.png"       alt="Community Defense Logo"    width={40} height={40} />
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
              <a href="https://www.facebook.com/Heman201"   target="_blank" rel="noreferrer noopener" className="block text-xs text-gray-600 font-bold underline">Operation Center PDRRMO Iloilo</a>
              <a href="https://www.facebook.com/iloilopdrrmo" target="_blank" rel="noreferrer noopener" className="block text-xs text-gray-600 font-bold underline">Provincial Disaster Risk Reduction and Management Office - Iloilo</a>
            </div>
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
}