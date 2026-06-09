"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Globe,
  FileText,
  Map,
  Award,
  ExternalLink,
  X,
  ZoomIn,
  ZoomOut,
  Download,
  RotateCcw,
} from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { useState, useRef, useEffect, useCallback } from "react";
import Footer from "@/components/Footer";

// ─── DATA ────────────────────────────────────────────────────────────────────

const hazardMaps = [
  {
    id: 1,
    label: "Flood Hazard Map",
    src: "/floodingHazard.tif",
    desc: "Flood risk zones across Iloilo Province",
  },
  {
    id: 2,
    label: "Storm Surge Map",
    src: "/stormSurgeHazard.tif",
    desc: "Coastal storm surge susceptibility areas",
  },
  {
    id: 3,
    label: "Landslide Map",
    src: "/rainInducedLandslide.tif",
    desc: "Landslide-prone zones and evacuation routes",
  },
  {
    id: 4,
    label: "Tsunami Hazard Map",
    src: "/Tsunami.tif",
    desc: "Tsunami risk zones across Iloilo Province",
  },
  {
    id: 5,
    label: "EIL West Panay Fault Map (S.2)",
    src: "/eilScenario2WestPanayFault.tif",
    desc: "EIL risk zones across Iloilo Province (S.2)",
  },
  {
    id: 6,
    label: "EIL Negros Trench (S.6)",
    src: "/eilScenario6NegrosTrench.tif",
    desc: "EIL risk zones across Iloilo Province (S.6)",
  },
  {
    id: 7,
    label: "Groundshaking West Panay Fault Map (S.2)",
    src: "/groundshakingScenario2WestPanay.tif",
    desc: "Groundshaking risk zones across Iloilo Province (S.2)",
  },
  {
    id: 8,
    label: "Groundshaking Negros Trench (S.6)",
    src: "/groundshakingScenario6NegrosTrench.tif",
    desc: "Groundshaking risk zones across Iloilo Province (S.6)",
  },
  {
    id: 9,
    label: "Liquefaction West Panay Fault Map (S.2)",
    src: "/liquefactionScenario2WestPanay.tif",
    desc: "Liquefaction risk zones across Iloilo Province (S.2)",
  },
  {
    id: 10,
    label: "Liquefaction Negros Trench (S.6)",
    src: "/liquefactionScenario6NegrosTrench.tif",
    desc: "Liquefaction risk zones across Iloilo Province (S.6)",
  },
];

const issuances = [
  {
    label: "NDRRMC Memorandum No. 14, s.2025",
    href: "./superTyphoonTtex.pdf",
    date: "2025",
  },
  { label: "NDRRMC Memorandum No. 10, s.2025", href: "#", date: "2025" },
  { label: "NDRRMC Memorandum No. 30, s.2025", href: "#", date: "2025" },
  { label: "NDRRMC Memorandum No. 31, s.2025", href: "#", date: "2025" },
  { label: "NDRRMC Memorandum No. 383, s.2024", href: "#", date: "2024" },
  { label: "NDRRMC Memorandum No. 310, s.2024", href: "#", date: "2024" },
  { label: "NDRRMC Memorandum No. 221, s.2024", href: "#", date: "2024" },
];

type GKYear = "2024" | "2023" | "2022";
type GKCategory = "Special Awards";

const gawadKalasagData: Record<
  GKYear,
  Record<GKCategory, { name: string; region: string; classRating: string }[]>
> = {
  "2024": {
    "Special Awards": [
      {
        name: "Gawad Kalasag 2023 - DRRM",
        region: "National",
        classRating: "Bronze Awardee",
      },
      {
        name: "Resculympics 2024 - DRRM Olympics",
        region: "Regional",
        classRating: "Champion",
      },
    ],
    
    
  },
  "2023": {
    "Special Awards": [
      { name: "Iloilo Rescue Team Alpha", region: "VI", classRating: "SA-GK" },
    ],
    
  },
  "2022": {
    "Special Awards": [
      {
        name: "Provincial EROI Team",
        region: "Local",
        classRating: "Recognition",
      },
    ],
    
  },
};

const gkYears: GKYear[] = ["2024", "2023", "2022"];
const gkCategories: GKCategory[] = [
  "Special Awards",
];

const categoryColor: Record<GKCategory, string> = {
  "Special Awards": "bg-[#002E5D]",
};

const ratingBadge: Record<string, string> = {
  Gold: "bg-amber-100 text-amber-800 border border-amber-300",
  Silver: "bg-gray-100 text-gray-700 border border-gray-300",
  Bronze: "bg-orange-100 text-orange-800 border border-orange-300",
  "SA-GK": "bg-blue-100 text-blue-800 border border-blue-300",
  "HF-GK": "bg-purple-100 text-purple-800 border border-purple-300",
};

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const MIN_SCALE = 1;
const MAX_SCALE = 5;

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  // ─── GENERAL STATE ──────────────────────────────────────────────────────────
  const [activeYear, setActiveYear] = useState<GKYear>("2024");
  const [activeCategory, setActiveCategory] =
    useState<GKCategory>("Special Awards");
  const [issuanceFilter, setIssuanceFilter] = useState<string>("All");

  // ─── LIGHTBOX STATE ─────────────────────────────────────────────────────────
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxLabel, setLightboxLabel] = useState("");
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  // ─── LIGHTBOX HANDLERS ──────────────────────────────────────────────────────

  const openLightbox = (src: string, label: string) => {
    setLightboxSrc(src);
    setLightboxLabel(label);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    positionRef.current = { x: 0, y: 0 };
  };

  const closeLightbox = () => {
    setLightboxSrc(null);
    setLightboxLabel("");
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    positionRef.current = { x: 0, y: 0 };
  };

  // ─── DRAG HANDLERS ──────────────────────────────────────────────────────────

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStart.current = {
      x: e.clientX - positionRef.current.x,
      y: e.clientY - positionRef.current.y,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart.current) return;
    const next = {
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    };
    positionRef.current = next;
    setPosition(next);
  };

  const handleMouseUp = () => {
    dragStart.current = null;
    setIsDragging(false);
  };

  // ─── WHEEL ZOOM ─────────────────────────────────────────────────────────────
  // Attached via useEffect with { passive: false } so we can call preventDefault()
  // and block the browser's own page zoom. React's synthetic onWheel can't do this.

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    setScale((prev) =>
      Math.min(MAX_SCALE, Math.max(MIN_SCALE, +(prev + delta).toFixed(2))),
    );
  }, []);

  useEffect(() => {
    const el = imageWrapperRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel, lightboxSrc]); // re-attach when lightbox opens

  // ─── DERIVED ────────────────────────────────────────────────────────────────

  const filteredIssuances =
    issuanceFilter === "All"
      ? issuances
      : issuances.filter((i) => i.date === issuanceFilter);

  const tableRows = gawadKalasagData[activeYear][activeCategory] ?? [];

  // ─── RENDER ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f8f9fb] font-sans text-slate-900">
      {/* ── HERO BANNER ── */}
      <div className="bg-[#002E5D] text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">
            PDRRMO Iloilo
          </p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
            Resources
          </h1>
          <p className="text-blue-200 text-sm max-w-xl">
            Access hazard maps, official issuances, and Gawad Kalasag
            recognition records for Iloilo Province.
          </p>
          {/* Quick jump links */}
          <div className="flex flex-wrap gap-3 mt-5">
            {[
              {
                href: "#hazard-maps",
                icon: <Map className="w-3.5 h-3.5" />,
                label: "Hazard Maps",
              },
              {
                href: "#issuances",
                icon: <FileText className="w-3.5 h-3.5" />,
                label: "Issuances",
              },
              {
                href: "#gawad",
                icon: <Award className="w-3.5 h-3.5" />,
                label: "Gawad Kalasag",
              },
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
            <h2 className="text-xl font-black text-[#002E5D] uppercase tracking-wide">
              Hazard Maps
            </h2>
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    draggable={false}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-[#002E5D]/0 group-hover:bg-[#002E5D]/40 transition-colors duration-200 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-bold text-sm text-[#002E5D]">
                    {map.label}
                  </p>
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
            <h2 className="text-xl font-black text-[#002E5D] uppercase tracking-wide">
              Issuances
            </h2>
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
                  <span className="text-sm text-[#002E5D] font-medium group-hover:underline">
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {item.date}
                  </span>
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
            <h2 className="text-xl font-black text-[#002E5D] uppercase tracking-wide">
              Awards and Recognitions
            </h2>
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

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div
              className={`${categoryColor[activeCategory]} text-white px-5 py-3`}
            >
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                {activeYear} Gawad Kalasag — {activeCategory}
              </p>
            </div>

            {tableRows.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">
                No records for this category and year.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-3 text-xs font-black uppercase text-gray-500 tracking-wide">
                      Name
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-black uppercase text-gray-500 tracking-wide">
                      Region
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-black uppercase text-gray-500 tracking-wide">
                      Class / Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tableRows.map((row, i) => (
                    <tr key={i} className="hover:bg-blue-50 transition">
                      <td className="px-5 py-3.5 font-medium text-[#002E5D]">
                        {row.name}
                      </td>
                      <td className="px-4 py-3.5 text-center text-gray-600">
                        {row.region}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${ratingBadge[row.classRating] ?? "bg-gray-100 text-gray-600"}`}
                        >
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
          onClick={closeLightbox}
        >
          {/* Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition disabled:opacity-30"
              onClick={(e) => {
                e.stopPropagation();
                setScale((s) => Math.max(MIN_SCALE, +(s - 0.25).toFixed(2)));
              }}
              disabled={scale <= MIN_SCALE}
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="text-white text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full min-w-52px text-center">
              {Math.round(scale * 100)}%
            </span>

            <button
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition disabled:opacity-30"
              onClick={(e) => {
                e.stopPropagation();
                setScale((s) => Math.min(MAX_SCALE, +(s + 0.25).toFixed(2)));
              }}
              disabled={scale >= MAX_SCALE}
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition"
              onClick={(e) => {
                e.stopPropagation();
                resetView();
              }}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition"
              onClick={closeLightbox}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Hint */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs pointer-events-none select-none">
            Scroll to zoom · Drag to pan
          </p>

          {/* Image container */}
          <div
            className="flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white text-sm font-bold text-center">
              {lightboxLabel}
            </p>

            {/*
              ref wrapper receives the non-passive wheel listener.
              overflow-hidden clips the image when dragged/zoomed beyond bounds.
              Inner div carries the transform — scale + translate applied together.
            */}
            <div
              ref={imageWrapperRef}
              className="relative overflow-hidden rounded-xl shadow-2xl"
              style={{
                width: "min(90vw, 900px)",
                height: "min(80vh, 650px)",
                cursor: isDragging
                  ? "grabbing"
                  : scale > 1
                    ? "grab"
                    : "default",
              }}
            >
              <div
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                  // Smooth transition for button zoom, instant for drag
                  transition: isDragging ? "none" : "transform 0.15s ease",
                  width: "100%",
                  height: "100%",
                  position: "relative",
                }}
              >
                <Image
                  src={lightboxSrc}
                  alt={lightboxLabel}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  draggable={false}
                  className="object-contain select-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}
