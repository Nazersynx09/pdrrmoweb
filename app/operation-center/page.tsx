"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, Globe, X, ZoomIn, ZoomOut, Home, Waves, Flame, CloudRain, 
  Truck, Toolbox, ShieldCheck, Users, Target, FileText, Clock, 
  Shield, AlertTriangle, ArrowRight, Radio, Phone, Bell, Activity
} from "lucide-react";
import { useState, useCallback } from "react";
import Footer from "@/components/Footer";

const capabilities = [
  { title: "24/7 Monitoring", desc: "Round-the-clock surveillance of weather and hazard conditions", icon: Clock },
  { title: "Emergency Communications", desc: "Multi-channel communication system for rapid response", icon: Radio },
  { title: "Early Warning System", desc: "Real-time alerts and advisories to communities", icon: Bell },
  { title: "Coordination Hub", desc: "Link between municipal DRRMOs and national agencies", icon: Activity },
];

export default function OperationCenter() {
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
            Operation Center
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            The central monitoring and coordination hub for disaster operations 
            in the Province of Iloilo, operating 24/7.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12 -mt-8">
        {/* About Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#F58220] flex items-center justify-center">
              <Radio className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[#002E5D]">Who We Are</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            The Provincial Disaster Risk Reduction and Management Operation Center (PDRRMO OPCEN) serves as the central monitoring and coordination hub for disaster operations in the Province of Iloilo. Operating 24 hours a day, 7 days a week, the center is responsible for gathering, analyzing, and disseminating critical information related to disaster events and emergencies.
          </p>
          <p className="text-gray-600 leading-relaxed">
            The OPCEN maintains real-time coordination with municipal DRRMOs, national government agencies, and other stakeholders to ensure swift and effective response during disasters. Equipped with modern communication technologies, the center monitors weather conditions, water levels, and other hazard indicators to provide early warnings to communities.
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
              A state-of-the-art operation center that serves as the nerve center of disaster management in Iloilo, enabling timely decision-making and coordinated response to protect every Ilonggo community.
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
              To provide seamless monitoring, communication, and coordination services that enable proactive disaster preparedness, rapid emergency response, and effective recovery operations across all municipalities of Iloilo.
            </p>
          </div>
        </div>

        {/* Core Capabilities */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#002E5D] text-center mb-8">Core Capabilities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {capabilities.map((cap, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 text-center hover:-translate-y-1 transition-transform">
                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <cap.icon className="w-7 h-7 text-[#F58220]" />
                </div>
                <h4 className="font-bold text-[#002E5D] mb-2">{cap.title}</h4>
                <p className="text-sm text-gray-500">{cap.desc}</p>
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
              "Continuous monitoring of weather and hazard conditions",
              "Reception and transmission of disaster reports",
              "Coordination with municipal DRRMOs and national agencies",
              "Dissemination of early warnings and advisories",
              "Management of emergency communications",
              "Documentation of disaster events and response activities",
              "Maintenance of the provincial emergency operations database",
              "24/7 operational readiness and rapid response activation"
            ].map((func, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-[#F58220] mt-2 shrink-0" />
                <span className="text-gray-700">{func}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#002E5D] text-center mb-8">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-[#002E5D] flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-[#002E5D] mb-1">Hotline</h4>
                <p className="text-gray-600">(033) 328-7920</p>
                <p className="text-gray-600">328-7900</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-[#F58220] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-[#002E5D] mb-1">Location</h4>
                <p className="text-gray-600">3rd Floor, Left Wing</p>
                <p className="text-gray-600">Iloilo Provincial Capitol</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 rounded-lg bg-[#002E5D] flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-[#002E5D] mb-1">Operating Hours</h4>
                <p className="text-gray-600">24 hours / 7 days</p>
                <p className="text-gray-600">Always operational</p>
              </div>
            </div>
          </div>
        </div>

        {/* Official Logo */}
        {/* <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#002E5D] text-center mb-8">Official Unit</h2>
          <div className="flex flex-col items-center">
            <Image
              src="/pdrrmoLogo.png"
              alt="OPCEN Logo"
              width={180}
              height={180}
              className="w-44 h-44 object-contain mb-6"
            />
            <h3 className="text-xl font-bold text-[#002E5D]">Provincial DRRM Operation Center</h3>
            <p className="text-[#F58220] font-bold text-lg">(OPCEN)</p>
            <p className="text-gray-500 text-center mt-2">PDRRMO Iloilo</p>
          </div>
        </div> */}

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/about-pdrrmo" className="flex items-center justify-center gap-2 bg-[#002E5D] hover:bg-[#001a38] text-white font-bold py-4 px-6 rounded-xl transition-colors">
            About PDRRMO <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/about-pdrrmc" className="flex items-center justify-center gap-2 bg-[#F58220] hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-colors">
            About PDRRMC <ArrowRight className="w-4 h-4" />
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
              className={`touch-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
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