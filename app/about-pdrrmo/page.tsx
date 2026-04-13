"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, Globe, X, ZoomIn, ZoomOut, Home, Waves, Flame, CloudRain, 
  Truck, Toolbox, ShieldCheck, Users, Target, FileText, Clock, 
  Shield, AlertTriangle, ArrowRight 
} from "lucide-react";
import { useState, useCallback } from "react";
import Footer from "@/components/Footer";

const coreValues = [
  { title: "Prevention", desc: "Proactive measures to prevent disaster impacts", icon: Shield },
  { title: "Preparedness", desc: "Community education and emergency planning", icon: AlertTriangle },
  { title: "Response", desc: "Rapid and coordinated emergency actions", icon: Truck },
  { title: "Recovery", desc: "Restoration and rebuilding after disasters", icon: Waves },
];

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
      {/* Hero Banner */}
      <section className="relative bg-[#002E5D] py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F58220]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            About PDRRMO
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Building a disaster-resilient Province of Iloilo through proactive planning, 
            community engagement, and rapid response capabilities.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12 -mt-8">
        {/* About Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#F58220] flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#002E5D]">Who We Are</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            The Iloilo Provincial Disaster Risk Reduction and Management Office (PDRRMO) is the primary agency responsible for coordinating disaster risk reduction and management activities in the Province of Iloilo. Established pursuant to Republic Act 10121, the office serves as the operational arm of the Provincial Disaster Risk Reduction and Management Council (PDRRMC).
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            The PDRRMO is dedicated to building a disaster-resilient Province of Iloilo through proactive planning, community engagement, and rapid response capabilities. The office works closely with municipal DRRMOs, national government agencies, and partner organizations to ensure the safety and welfare of all Ilonggos.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Through its comprehensive programs and services, the office aims to minimize the loss of lives, properties, and livelihoods caused by natural and human-induced disasters. The PDRRMO operates the Provincial Operation Center (OPCEN) which monitors weather conditions and coordinates emergency response operations 24/7.
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-[#002E5D]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#002E5D] flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#002E5D]">Vision</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              A disaster-resilient Province of Iloilo where communities are prepared, protected, and able to recover quickly from any disaster, ensuring the safety, security, and sustainable development of all Ilonggos.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-[#F58220]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#F58220] flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#002E5D]">Mission</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To lead and coordinate disaster risk reduction and management programs in the Province of Iloilo by promoting disaster preparedness, implementing mitigation measures, ensuring rapid response, and facilitating recovery and rehabilitation efforts for affected communities.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#002E5D] text-center mb-8">Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreValues.map((value, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 text-center hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-[#F58220]" />
                </div>
                <h4 className="font-bold text-[#002E5D] mb-2">{value.title}</h4>
                <p className="text-sm text-gray-500">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Functions & Responsibilities */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#002E5D] flex items-center justify-center">
              <Toolbox className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#002E5D]">Functions & Responsibilities</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Formulating and implementing comprehensive DRRM plans",
              "Coordinating with municipal DRRMOs and national agencies",
              "Operating early warning systems",
              "Conducting disaster risk assessments",
              "Managing the Provincial Operation Center",
              "Organizing and training emergency response teams",
              "Implementing relief and recovery operations",
              "Ensuring compliance with national DRRM standards"
            ].map((func, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-[#F58220] mt-2 shrink-0" />
                <span className="text-gray-700">{func}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Office Logos */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#002E5D] text-center mb-8">Official Office Units</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl">
              <Image
                src="/pdrrmoLogo.png"
                alt="PDRRMO Logo"
                width={120}
                height={120}
                className="w-28 h-28 object-contain"
              />
              <div>
                <h4 className="text-lg font-bold text-[#002E5D]">Office of the Provincial DRRM Officer</h4>
                <p className="text-[#F58220] font-bold">PDRRMO</p>
                <p className="text-sm text-gray-500 mt-1">Main office responsible for DRRM coordination</p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-xl">
              <Image
                src="/pdrrmoLogo.png"
                alt="OPCEN Logo"
                width={120}
                height={120}
                className="w-28 h-28 object-contain"
              />
              <div>
                <h4 className="text-lg font-bold text-[#002E5D]">Provincial DRRM Operation Center</h4>
                <p className="text-[#F58220] font-bold">OPCEN</p>
                <p className="text-sm text-gray-500 mt-1">24/7 monitoring and emergency coordination</p>
              </div>
            </div>
          </div>
        </div>

        {/* Organizational Structure */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#002E5D] text-center mb-2">Organizational Structure</h2>
          <p className="text-gray-500 text-center mb-8">Click image to enlarge</p>
          
          <div
            className="cursor-zoom-in relative group"
            onClick={openModal}
            title="Click to view full screen"
          >
            <Image
              src="/orgstruct.png"
              alt="PDRRMO Organizational Structure"
              width={1200}
              height={800}
              className="w-full rounded-lg border border-gray-200 shadow-sm transition-opacity group-hover:opacity-90"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/50 text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
                <ZoomIn className="w-4 h-4" />
                Click to enlarge
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/about-pdrrmc" className="flex items-center justify-center gap-2 bg-[#002E5D] hover:bg-[#001a38] text-white font-bold py-4 px-6 rounded-xl transition-colors">
            About PDRRMC <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/operation-center" className="flex items-center justify-center gap-2 bg-[#F58220] hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-colors">
            Operation Center <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/emergency" className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-6 rounded-xl transition-colors">
            Emergency Contacts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* Org Chart Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center"
          onClick={handleBackdropClick}
        >
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.5}
              className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow transition disabled:opacity-40"
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
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={closeModal}
              className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full h-full overflow-auto flex items-center justify-center p-8">
            <div
              className={`touch-none ${isDragging ? "cursor-grabbing dragging" : "cursor-grab"}`}
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
              onPointerLeave={handleDragEnd}
              onClick={(e) => e.stopPropagation()}
              style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
            >
              <Image
                src="/orgstruct.png"
                alt="PDRRMO Organizational Structure"
                width={1400}
                height={900}
                className="max-w-none rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
