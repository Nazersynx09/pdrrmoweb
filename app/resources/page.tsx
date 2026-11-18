"use client";

import Image from "next/image";
import {
  FileText,
  Map,
  Award,
  Eye,
  X,
  ZoomIn,
  ZoomOut,
  Download,
  RotateCcw,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import Footer from "@/components/Footer";

interface HazardMap {
  id: string;
  title: string;
  type: string;
  file_url: string | null;
  thumbnail: string | null;
  description: string;
}

interface Issuance {
  id: string;
  title: string;
  type: string;
  number: string;
  date_issued: string | null;
  file_url: string;
  description: string;
}

interface DownloadableResource {
  id: string;
  title: string;
  category: string;
  file_url: string;
  file_type: string;
  description: string;
}

interface OfficeAward {
  id: string;
  year: number;
  category: string;
  name: string;
  region: string;
  class_rating: string;
  scan_url: string | null;
}

interface ContentResponse<T> {
  success: boolean;
  data?: T[];
  error?: string;
}

async function fetchContent<T>(url: string, signal: AbortSignal): Promise<T[]> {
  const response = await fetch(url, { signal, cache: "no-store" });
  const result = (await response.json()) as ContentResponse<T>;

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || `Failed to load ${url}`);
  }

  return result.data;
}

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

function getGoogleDrivePreviewUrl(source: string) {
  try {
    const url = new URL(source);
    if (url.hostname !== "drive.google.com") return null;

    const fileId =
      url.pathname.match(/^\/file\/d\/([^/]+)/)?.[1] ??
      url.searchParams.get("id");
    if (!fileId) return null;

    return `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview`;
  } catch {
    return null;
  }
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  // ─── GENERAL STATE ──────────────────────────────────────────────────────────
  const [hazardMaps, setHazardMaps] = useState<HazardMap[]>([]);
  const [issuances, setIssuances] = useState<Issuance[]>([]);
  const [downloadableResources, setDownloadableResources] = useState<DownloadableResource[]>([]);
  const [awards, setAwards] = useState<OfficeAward[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeYear, setActiveYear] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [issuanceFilter, setIssuanceFilter] = useState<string>("All");

  useEffect(() => {
    const controller = new AbortController();

    async function loadResources() {
      const results = await Promise.allSettled([
        fetchContent<HazardMap>("/api/content/hazard-maps", controller.signal),
        fetchContent<Issuance>("/api/content/issuances", controller.signal),
        fetchContent<DownloadableResource>("/api/content/downloadable-resources", controller.signal),
        fetchContent<OfficeAward>("/api/content/awards", controller.signal),
      ]);

      if (controller.signal.aborted) return;

      const [mapsResult, issuancesResult, resourcesResult, awardsResult] = results;
      const failures: string[] = [];

      if (mapsResult.status === "fulfilled") {
        setHazardMaps(mapsResult.value);
      } else {
        failures.push(
          `hazard maps: ${mapsResult.reason instanceof Error ? mapsResult.reason.message : String(mapsResult.reason)}`,
        );
      }

      if (issuancesResult.status === "fulfilled") {
        setIssuances(issuancesResult.value);
      } else {
        failures.push(
          `issuances: ${issuancesResult.reason instanceof Error ? issuancesResult.reason.message : String(issuancesResult.reason)}`,
        );
      }

      if (resourcesResult.status === "fulfilled") {
        setDownloadableResources(resourcesResult.value);
      } else {
        failures.push(
          `downloadable resources: ${resourcesResult.reason instanceof Error ? resourcesResult.reason.message : String(resourcesResult.reason)}`,
        );
      }

      if (awardsResult.status === "fulfilled") {
        setAwards(awardsResult.value);
      } else {
        failures.push(
          `awards: ${awardsResult.reason instanceof Error ? awardsResult.reason.message : String(awardsResult.reason)}`,
        );
      }

      setLoadError(
        failures.length ? `Some sections could not be loaded: ${failures.join("; ")}` : null,
      );
      setLoading(false);
    }

    loadResources();
    return () => controller.abort();
  }, []);

  // ─── LIGHTBOX STATE ─────────────────────────────────────────────────────────
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxLabel, setLightboxLabel] = useState("");
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const lightboxDrivePreviewUrl = lightboxSrc
    ? getGoogleDrivePreviewUrl(lightboxSrc)
    : null;

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

  const issuanceYears = Array.from(
    new Set(
      issuances
        .map((item) => item.date_issued?.slice(0, 4))
        .filter((year): year is string => Boolean(year)),
    ),
  ).sort((a, b) => Number(b) - Number(a));
  const filteredIssuances =
    issuanceFilter === "All"
      ? issuances
      : issuances.filter(
          (item) => item.date_issued?.slice(0, 4) === issuanceFilter,
        );

  const awardYears = Array.from(new Set(awards.map((award) => award.year)))
    .sort((a, b) => b - a)
    .map(String);
  const selectedYear = awardYears.includes(activeYear)
    ? activeYear
    : awardYears[0] ?? "";
  const awardCategories = Array.from(
    new Set(
      awards
        .filter((award) => String(award.year) === selectedYear)
        .map((award) => award.category),
    ),
  ).sort();
  const selectedCategory = awardCategories.includes(activeCategory)
    ? activeCategory
    : awardCategories[0] ?? "";
  const tableRows = awards.filter(
    (award) =>
      String(award.year) === selectedYear &&
      award.category === selectedCategory,
  );

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
            Access hazard maps, official issuances, downloadable documents, and
            awards and recognition records received by the office.
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
                href: "#downloads",
                icon: <Download className="w-3.5 h-3.5" />,
                label: "Downloadable Resources",
              },
              {
                href: "#awards",
                icon: <Award className="w-3.5 h-3.5" />,
                label: "Awards & Recognition",
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
        {loadError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {loadError}
          </div>
        )}

        {/* ══ HAZARD MAPS ══ */}
        <section id="hazard-maps">
          <div className="flex items-center gap-3 mb-6">
            <Map className="w-5 h-5 text-[#F58220]" />
            <h2 className="text-xl font-black text-[#002E5D] uppercase tracking-wide">
              Hazard Maps
            </h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-gray-500">Loading hazard maps...</p>
          ) : hazardMaps.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No hazard maps available.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {hazardMaps.map((map) => {
                const imageSource = map.thumbnail || map.file_url || "";
                const drivePreviewUrl = getGoogleDrivePreviewUrl(imageSource);

                return (
                  <div
                    key={map.id}
                    onClick={
                      map.file_url
                        ? () => openLightbox(map.file_url!, map.title)
                        : undefined
                    }
                    className={`group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 ${
                      map.file_url ? "cursor-zoom-in" : "cursor-default"
                    }`}
                  >
                    <div className="relative h-44 bg-gray-100 overflow-hidden">
                      {drivePreviewUrl ? (
                        <iframe
                          src={drivePreviewUrl}
                          title={`Preview of ${map.title}`}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="h-full w-full border-0 pointer-events-none"
                        />
                      ) : imageSource ? (
                        <Image
                          src={imageSource}
                          alt={map.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          draggable={false}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <Map className="h-10 w-10" />
                        </div>
                      )}
                      {map.file_url && (
                        <div className="absolute inset-0 bg-[#002E5D]/0 group-hover:bg-[#002E5D]/40 transition-colors duration-200 flex items-center justify-center">
                          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-sm text-[#002E5D]">
                        {map.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {map.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
            {["All", ...issuanceYears].map((yr) => (
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
            {loading ? (
              <p className="px-5 py-8 text-center text-sm text-gray-500">Loading issuances...</p>
            ) : filteredIssuances.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-500">No issuances available.</p>
            ) : (
              filteredIssuances.map((item) => (
                <a
                  key={item.id}
                  href={item.file_url || undefined}
                  target={item.file_url ? "_blank" : undefined}
                  rel={item.file_url ? "noopener noreferrer" : undefined}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-blue-50 transition group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#002E5D] shrink-0" />
                    <span className="text-sm text-[#002E5D] font-medium group-hover:underline">
                      {item.title}
                      {item.number ? ` — ${item.number}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {item.date_issued?.slice(0, 4) || "—"}
                    </span>
                    {item.file_url && (
                      <Download className="w-4 h-4 text-gray-400 group-hover:text-[#002E5D] transition" />
                    )}
                  </div>
                </a>
              ))
            )}
          </div>
        </section>

        {/* ══ DOWNLOADABLE RESOURCES ══ */}
        <section id="downloads">
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-5 h-5 text-[#F58220]" />
            <h2 className="text-xl font-black text-[#002E5D] uppercase tracking-wide">
              Downloadable Resources
            </h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
            {loading ? (
              <p className="px-5 py-8 text-center text-sm text-gray-500">
                Loading downloadable resources...
              </p>
            ) : downloadableResources.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-gray-500">
                No downloadable resources available.
              </p>
            ) : (
              downloadableResources.map((item) => (
                <a
                  key={item.id}
                  href={item.file_url || undefined}
                  target={item.file_url ? "_blank" : undefined}
                  rel={item.file_url ? "noopener noreferrer" : undefined}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-blue-50 transition group"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="w-5 h-5 text-[#002E5D] shrink-0" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#002E5D] group-hover:underline">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="mt-1 truncate text-xs text-gray-500">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase text-blue-800">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-gray-400">
                      {item.file_type}
                    </span>
                    {item.file_url && (
                      <Download className="w-4 h-4 text-gray-400 group-hover:text-[#002E5D] transition" />
                    )}
                  </div>
                </a>
              ))
            )}
          </div>
        </section>

        {/* ══ AWARDS AND RECOGNITIONS ══ */}
        <section id="awards">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-5 h-5 text-[#F58220]" />
            <h2 className="text-xl font-black text-[#002E5D] uppercase tracking-wide">
              Awards and Recognitions
            </h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Year and category filters */}
          <div className="flex flex-wrap gap-2 mb-3">
            {awardCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-bold border transition ${
                  selectedCategory === category
                    ? "bg-[#002E5D] text-white border-[#002E5D]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-5">
            {awardYears.map((yr) => (
              <button
                key={yr}
                onClick={() => setActiveYear(yr)}
                className={`px-5 py-2 rounded-md text-sm font-bold border-2 transition ${
                  selectedYear === yr
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
            <div className="bg-[#002E5D] text-white px-5 py-3">
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">
                {selectedYear || "Awards and Recognitions"}{" "}
                {selectedCategory && `— ${selectedCategory}`}
              </p>
            </div>

            {loading ? (
              <div className="py-10 text-center text-sm text-gray-400">
                Loading awards...
              </div>
            ) : tableRows.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">
                No records for this category and year.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-3 text-xs font-black uppercase text-gray-500 tracking-wide">
                      Award / Recognition
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-black uppercase text-gray-500 tracking-wide">
                      Region
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-black uppercase text-gray-500 tracking-wide">
                      Distinction / Rating
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-black uppercase text-gray-500 tracking-wide">
                      Scan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tableRows.map((row) => (
                    <tr key={row.id} className="hover:bg-blue-50 transition">
                      <td className="px-5 py-3.5 font-medium text-[#002E5D]">
                        {row.name}
                      </td>
                      <td className="px-4 py-3.5 text-center text-gray-600">
                        {row.region || "—"}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {row.class_rating ? (
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${ratingBadge[row.class_rating] ?? "bg-gray-100 text-gray-600"}`}
                          >
                            {row.class_rating}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {row.scan_url ? (
                          /\.(?:jpe?g|png|gif|webp)(?:[?#]|$)/i.test(row.scan_url) ? (
                            <button
                              type="button"
                              onClick={() => openLightbox(row.scan_url!, row.name)}
                              aria-label={`View scanned image for ${row.name}`}
                              className="inline-flex items-center gap-1 text-[#002E5D] hover:underline"
                            >
                              <Eye className="h-4 w-4" />
                              View image
                            </button>
                          ) : (
                            <a
                              href={row.scan_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[#002E5D] hover:underline"
                            >
                              <FileText className="h-4 w-4" />
                              View PDF
                            </a>
                          )
                        ) : (
                          "—"
                        )}
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
      {lightboxSrc && lightboxDrivePreviewUrl && (
        <div
          className="fixed inset-0 z-100 bg-black/85 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div
            className="w-full max-w-5xl rounded-xl bg-gray-900 p-3 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="truncate text-sm font-bold text-white">
                {lightboxLabel}
              </p>
              <div className="flex shrink-0 items-center gap-3">
                <a
                  href={lightboxSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue-200 hover:text-white"
                >
                  Open in Google Drive
                </a>
                <button
                  type="button"
                  onClick={closeLightbox}
                  aria-label="Close preview"
                  className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <iframe
              src={lightboxDrivePreviewUrl}
              title={`Preview of ${lightboxLabel}`}
              allow="autoplay"
              allowFullScreen
              referrerPolicy="no-referrer"
              className="h-[min(80vh,700px)] w-full rounded-lg border-0 bg-white"
            />
          </div>
        </div>
      )}

      {lightboxSrc && !lightboxDrivePreviewUrl && (
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
