"use client";

import { useEffect, useState } from "react";
import AlertBanner from "@/components/AlertBanner";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import QuickActions from "@/components/QuickActions";
import Carousel from "@/components/Carousel";
import UpdatesSection from "@/components/UpdatesSection";
import QuickLinks from "@/components/QuickLinks";
import Footer from "@/components/Footer";


const alerts = [
  {
    level: "info",
    message: "Stay informed with the latest weather updates from PAGASA",
    color: "bg-blue-600",
  },
  {
    level: "warning",
    message:
      "Southwest monsoon season continues. Please prepare emergency kits and know your evacuation routes.",
    color: "bg-amber-500",
  },
  {
    level: "watch",
    message:
      "Flooding occurs in low-lying areas. Avoid crossing flooded roads.",
    color: "bg-orange-500",
  },
];

const issuances = [
  {
    text: "NDRRMC Memorandum No. 58, s. 2026",
    href: "https://ndrrmc.gov.ph/wp-content/uploads/2026/03/NDRRMC-MEMO-58-s.-2026-Raising-of-the-NDRRMOC-Alert-Status-to-BLUE-ICOW-The-Observance-of-the-Holy-Week-SEMANA-SANTA-2026.pdf",
    date: "Mar 2026",
  },
  {
    text: "NDRRMC Memorandum No. 62, s. 2026",
    href: "https://ndrrmc.gov.ph/wp-content/uploads/2026/03/NDRRMC_Memorandum_No_62_s_2026.pdf",
    date: "Mar 2026",
  },
  {
    text: "PDRRMC Memorandum No. 15, s. 2026",
    href: "https://ndrrmc.gov.ph/wp-content/uploads/2026/02/NDRRMC_Memorandum_No_15_s_2026.pdf",
    date: "Feb 2026",
  },
  {
    text: "NDRRMC Memorandum No. 14, s. 2025",
    href: "./superTyphoonTtex.pdf",
    date: "2025",
  },
];

const contactInfo = {
  phone: "(033) 328-7920",
  email: "pdrrmo@iloilo.gov.ph",
  address1: "Iloilo Provincial Capitol, Bonifacio Drive, Iloilo City",
  address2: "Magsaysay Village, Lapaz, Iloilo",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      <AlertBanner />
      <HeroSection
        phone={contactInfo.phone}
        email={contactInfo.email}
        address1={contactInfo.address1}
        address2={contactInfo.address2}
      />
      <StatsSection />
      <QuickActions />
      <Carousel />
      <UpdatesSection issuances={issuances} />
      <QuickLinks />
      <Footer />
    </div>
  );
}
