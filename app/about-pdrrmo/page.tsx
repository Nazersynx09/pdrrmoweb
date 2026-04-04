"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Globe, X, ZoomIn, ZoomOut, Home, Waves, Flame, CloudRain, Truck, Toolbox, Ambulance, ShieldCheck } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import { useState, useCallback } from "react";

export default function AboutPDRRMO() {
  const [modalOpen, setModalOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openModal = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setDragStart(null);
    setIsDragging(false);
  };

  const zoomIn = useCallback(() => setScale((s) => Math.min(s + 0.25, 3)), []);
  const zoomOut = useCallback(() => setScale((s) => Math.max(s - 0.25, 0.5)), []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeModal();
  };

  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart) return;
    setDragStart(null);
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">

      {/* --- TOP NAVIGATION --- */}
      <nav className="bg-[#002E5D] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/PDRRMO Logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="font-bold tracking-tight hidden md:block">PDRRMO ILOILO</span>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium uppercase tracking-wide">
            <Link href="/" className="hover:text-orange-400 transition">Home</Link>
            <Link href="/about-pdrrmo" className="text-orange-400">About PDRRMO</Link>
            <Link href="/about-pdrrmc" className="hover:text-orange-400 transition">About PDRRMC</Link>
            <Link href="/programs-services" className="hover:text-orange-400 transition">Programs and Services</Link>
            <Link href="/resources" className="hover:text-orange-400 transition">Resources</Link>
            <Link href="/operation-center" className="hover:text-orange-400 transition">Operation Center</Link>
          </div>

          <Link href="/emergency" className="bg-[#F58220] hover:bg-orange-600 px-4 py-2 rounded font-bold text-xs uppercase transition inline-block text-center">
            Emergency Contact
          </Link>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-5xl mx-auto px-4 py-10">

        {/* Page Title */}
        <h1 className="text-center text-3xl font-bold text-[#002E5D] mb-6 font-Arial">
          About PDRRMO
        </h1>

        {/* About Text Box */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm leading-relaxed text-gray-600 mb-10 shadow-sm">
          <p className="mb-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.
          </p>
          <p className="mb-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.Lorem 
            ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.Lorem 
            ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.Lorem 
            ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.Lorem 
            ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.
          </p>
        </div>

        {/* Vision */}
        <section className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8 items-center mb-10">
          <div>
            <h2 className="text-xl font-bold text-[#002E5D] border-l-4 border-[#F58220] pl-3 mb-3">VISION</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { Icon: Home, color: "text-orange-500" },
              { Icon: Waves, color: "text-sky-500" },
              { Icon: Flame, color: "text-rose-500" },
            ].map(({ Icon, color }, i) => (
              <div key={i} className="aspect-square rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                <Icon className={`h-10 w-10 ${color}`} aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8 items-center mb-10">
          <div>
            <h2 className="text-xl font-bold text-[#002E5D] border-l-4 border-[#F58220] pl-3 mb-3">MISSION</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { Icon: Home, color: "text-orange-500" },
              { Icon: CloudRain, color: "text-cyan-500" },
              { Icon: Truck, color: "text-rose-500" },
            ].map(({ Icon, color }, i) => (
              <div key={i} className="aspect-square rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                <Icon className={`h-10 w-10 ${color}`} aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        {/* Functions, Duties and Responsibilities */}
        <section className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8 items-center mb-14">
          <div>
            <h2 className="text-xl font-bold text-[#002E5D] border-l-4 border-[#F58220] pl-3 mb-3">
              Functions, Duties and Responsibilities
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { Icon: Toolbox, color: "text-emerald-500" },
              { Icon: ShieldCheck, color: "text-violet-500" },
              { Icon: Ambulance, color: "text-pink-500" },
            ].map(({ Icon, color }, i) => (
              <div key={i} className="aspect-square rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                <Icon className={`h-10 w-10 ${color}`} aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        {/* Official Background*/}
                <section className="mb-13">

                  <h2 className="text-2xl font-bold text-center text-[#002E5D] mb-6 font-Arial">
                    Official Office Logos
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center">
                    <div className="flex items-center gap-6">
                      <Image
                        src="/PDRRMO LOGO.png"
                        alt="PDRRMO Logo"
                        width={150}
                        height={150}
                      />
                      <div className="flex flex-col">
                        <p className="text-lg font-medium text-[#002E5D]">Office of the Provincial Disaster Risk Reduction and Management Officer</p>
                        <p className="text-md font-bold text-[#F58220]">(PDRRMO)</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <Image
                        src="/PDRRMO LOGO.png"
                        alt="PDRRMO Logo"
                        width={150}
                        height={150}
                      />
                      <div className="flex flex-col">
                        <p className="text-lg font-medium text-[#002E5D]">Provincial DRRM Operation Center</p>
                        <p className="text-md font-bold text-[#F58220]">(OPCEN)</p>
                      </div>
                    </div>
                  </div>
                
                </section>

        {/* Organizational Structure */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-center text-[#002E5D] mb-6 font-Arial">
            Organizational Structure
          </h2>

          {/* Clickable Org Chart Image */}
          <div
            className="cursor-zoom-in relative group"
            onClick={openModal}
            title="Click to view full screen"
          >
            <Image
              src="/Orgstruct.png"
              alt="PDRRMO Organizational Structure"
              width={1200}
              height={800}
              className="w-full rounded-lg border border-gray-200 shadow-sm transition-opacity group-hover:opacity-90"
            />
            {/* Zoom hint overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/50 text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
                <ZoomIn className="w-4 h-4" />
                Click to enlarge
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- ORG CHART MODAL --- */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-100 bg-black/80 flex items-center justify-center"
          onClick={handleBackdropClick}
        >
          {/* Controls */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow transition disabled:opacity-40"
              title="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="bg-white/90 text-gray-800 text-sm font-bold px-3 py-2 rounded-full shadow min-w-14 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              disabled={scale >= 3}
              className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow transition disabled:opacity-40"
              title="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={closeModal}
              className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable image container */}
          <div className="w-full h-full overflow-auto flex items-center justify-center p-8">
            <div
              className={`touch-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
              onPointerLeave={handleDragEnd}
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                transformOrigin: "center center",
                transition: dragStart ? "none" : "transform 0.2s ease",
              }}
            >
              <Image
                src="/Orgstruct.png"
                alt="PDRRMO Organizational Structure"
                width={1400}
                height={900}
                className="max-w-none rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-gray-200 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-10 border-b border-gray-100 pb-10 mb-7">
          <div className="flex items-center gap-20">
            <div className="flex gap-3">
              <Image src="/IPG Logo.png" alt="Provincial Government Logo" width={40} height={40} />
              <Image src="/PDRRMO Logo.png" alt="PDRRMO Logo" width={40} height={40} />
              <Image src="/PCDAC.png" alt="Community Defense Logo" width={40} height={40} />
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
                rel="noreferrer"
                className="block text-xs text-gray-600 font-bold underline"
              >
                Operation Center PDRRMO Iloilo
              </a>
              <a
                href="https://www.facebook.com/iloilopdrrmo"
                target="_blank"
                rel="noreferrer"
                className="block text-xs text-gray-600 font-bold underline"
              >
                Provincial Disaster Risk Reduction and Management Office - Iloilo
              </a>
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