"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF } from "react-icons/fa";
import { MapPin, Globe } from "lucide-react";
import { useState } from "react";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Row = {
  municipality: string;
  office: string;
  contact: string;
  team: string;
};

type District = {
  name: string;
  rows: Row[];
};

type TabKey = "ldrrmo" | "police" | "fire" | "rhu";

// ─── DATA ────────────────────────────────────────────────────────────────────

const ldrrmoDistricts: District[] = [
  {
    name: "1st District",
    rows: [
      { municipality: "Anilao",     office: "Lorem Ipsum", contact: "0910666666", team: "Guimbal Response & Emergency Action Team" },
      { municipality: "Badiangan",  office: "Lorem Ipsum", contact: "0910666666", team: "Guimbal Response & Emergency Action Team" },
      { municipality: "Igbaras",    office: "Lorem Ipsum", contact: "0910666666", team: "Guimbal Response & Emergency Action Team" },
      { municipality: "Miagao",     office: "Lorem Ipsum", contact: "0910666666", team: "Guimbal Response & Emergency Action Team" },
      { municipality: "Oton",       office: "Lorem Ipsum", contact: "0910666666", team: "Guimbal Response & Emergency Action Team" },
    ],
  },
  {
    name: "2nd District",
    rows: [
      { municipality: "Cabatuan",   office: "Lorem Ipsum", contact: "0910666666", team: "Guimbal Response & Emergency Action Team" },
      { municipality: "Calinog",    office: "Lorem Ipsum", contact: "0910666666", team: "Guimbal Response & Emergency Action Team" },
      { municipality: "Lambunao",   office: "Lorem Ipsum", contact: "0910666666", team: "Guimbal Response & Emergency Action Team" },
      { municipality: "Maasin",     office: "Lorem Ipsum", contact: "0910666666", team: "Guimbal Response & Emergency Action Team" },
      { municipality: "Pototan",    office: "Lorem Ipsum", contact: "0910666666", team: "Guimbal Response & Emergency Action Team" },
    ],
  },
  {
    name: "3rd District",
    rows: [
      { municipality: "Duenas",     office: "Lorem Ipsum", contact: "0910666666", team: "Guimbal Response & Emergency Action Team" },
      { municipality: "Dumangas",   office: "Lorem Ipsum", contact: "0910666666", team: "Guimbal Response & Emergency Action Team" },
      { municipality: "Passi City", office: "Lorem Ipsum", contact: "0910666666", team: "Guimbal Response & Emergency Action Team" },
    ],
  },
];

const policeDistricts: District[] = [
  {
    name: "1st District",
    rows: [
      { municipality: "Anilao",     office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
      { municipality: "Badiangan",  office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
      { municipality: "Igbaras",    office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
      { municipality: "Miagao",     office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
      { municipality: "Oton",       office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
    ],
  },
  {
    name: "2nd District",
    rows: [
      { municipality: "Cabatuan",   office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
      { municipality: "Calinog",    office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
      { municipality: "Lambunao",   office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
      { municipality: "Maasin",     office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
      { municipality: "Pototan",    office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
    ],
  },
  {
    name: "3rd District",
    rows: [
      { municipality: "Duenas",     office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
      { municipality: "Dumangas",   office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
      { municipality: "Passi City", office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
    ],
  },
];

const fireDistricts: District[] = [
  {
    name: "1st District",
    rows: [
      { municipality: "Anilao",     office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
      { municipality: "Badiangan",  office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
      { municipality: "Igbaras",    office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
      { municipality: "Miagao",     office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
      { municipality: "Oton",       office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
    ],
  },
  {
    name: "2nd District",
    rows: [
      { municipality: "Cabatuan",   office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
      { municipality: "Calinog",    office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
      { municipality: "Lambunao",   office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
      { municipality: "Maasin",     office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
      { municipality: "Pototan",    office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
    ],
  },
  {
    name: "3rd District",
    rows: [
      { municipality: "Duenas",     office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
      { municipality: "Dumangas",   office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
      { municipality: "Passi City", office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
    ],
  },
];

const rhuDistricts: District[] = [
  {
    name: "1st District",
    rows: [
      { municipality: "Anilao",     office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
      { municipality: "Badiangan",  office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
      { municipality: "Igbaras",    office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
      { municipality: "Miagao",     office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
      { municipality: "Oton",       office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
    ],
  },
  {
    name: "2nd District",
    rows: [
      { municipality: "Cabatuan",   office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
      { municipality: "Calinog",    office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
      { municipality: "Lambunao",   office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
      { municipality: "Maasin",     office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
      { municipality: "Pototan",    office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
    ],
  },
  {
    name: "3rd District",
    rows: [
      { municipality: "Duenas",     office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
      { municipality: "Dumangas",   office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
      { municipality: "Passi City", office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
    ],
  },
];

// ─── TAB CONFIG ───────────────────────────────────────────────────────────────

const tabs: {
  key: TabKey;
  label: string;
  shortLabel: string;
  headers: [string, string, string, string];
  data: District[];
  activeBg: string;
  headerBg: string;
  accentText: string;
}[] = [
  {
    key: "ldrrmo",
    label: "LDRRMO",
    shortLabel: "LDRRMO",
    headers: ["Municipality", "DRRM Office / Focal Person", "Contact Number", "Local Response Team"],
    data: ldrrmoDistricts,
    activeBg: "bg-[#002E5D] text-white border-[#002E5D]",
    headerBg: "bg-[#002E5D]",
    accentText: "text-[#002E5D]",
  },
  {
    key: "police",
    label: "Municipal Police Station",
    shortLabel: "Police",
    headers: ["Municipality", "Station Commander", "Contact Number", "Office"],
    data: policeDistricts,
    activeBg: "bg-blue-700 text-white border-blue-700",
    headerBg: "bg-blue-700",
    accentText: "text-blue-700",
  },
  {
    key: "fire",
    label: "Bureau of Fire",
    shortLabel: "Fire",
    headers: ["Municipality", "Fire Marshal / OIC", "Contact Number", "Office"],
    data: fireDistricts,
    activeBg: "bg-orange-600 text-white border-orange-600",
    headerBg: "bg-orange-600",
    accentText: "text-orange-600",
  },
  {
    key: "rhu",
    label: "Rural Health Unit",
    shortLabel: "RHU",
    headers: ["Municipality", "Municipal Health Officer", "Contact Number", "Office"],
    data: rhuDistricts,
    activeBg: "bg-green-700 text-white border-green-700",
    headerBg: "bg-green-700",
    accentText: "text-green-700",
  },
];

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function ContactDetailsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("ldrrmo");

  const current = tabs.find((t) => t.key === activeTab)!;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">

      {/* NAV */}
      <nav className="bg-[#002E5D] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/PDRRMO Logo.png" alt="Logo" width={40} height={40} className="object-contain" />
            <span className="font-bold tracking-tight hidden md:block">PDRRMO ILOILO</span>
          </div>
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium uppercase tracking-wide">
            <Link href="/" className="hover:text-orange-400 transition">Home</Link>
            <Link href="/about-pdrrmo" className="hover:text-orange-400 transition">About PDRRMO</Link>
            <Link href="/about-pdrrmc" className="hover:text-orange-400 transition">About PDRRMC</Link>
            <Link href="/programs-services" className="hover:text-orange-400 transition">Programs and Services</Link>
            <Link href="/resources" className="hover:text-orange-400 transition">Resources</Link>
            <Link href="/operation-center" className="hover:text-orange-400 transition">Operation Center</Link>
          </div>
          <button className="bg-[#F58220] hover:bg-orange-600 px-4 py-2 rounded font-bold text-xs uppercase transition">
            Emergency Contact
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-4xl mx-auto px-4 py-10">

        {/* Page Title */}
        <h1 className="text-center text-2xl font-black uppercase tracking-widest text-[#F58220] mb-2">
          Contact Details
        </h1>
        <p className="text-center text-sm text-gray-500 mb-8">
          Iloilo Province — Emergency and Disaster Response Contacts
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition border-2 ${
                activeTab === tab.key
                  ? tab.activeBg
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {/* Show short label on small screens, full label on md+ */}
              <span className="md:hidden">{tab.shortLabel}</span>
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {current.headers.map((h) => (
            <div
              key={h}
              className={`${current.headerBg} text-white text-center text-xs font-bold uppercase px-3 py-3 rounded`}
            >
              {h}
            </div>
          ))}
        </div>

        {/* District Sections */}
        {current.data.map((district) => (
          <div key={district.name} className="mb-8">
            {/* District Label */}
            <div className="flex items-center gap-3 mb-3">
              <h2 className={`text-sm font-black uppercase tracking-wide ${current.accentText}`}>
                {district.name}
              </h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Rows */}
            <div className="flex flex-col gap-2">
              {district.rows.map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-4 gap-2 bg-white border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-700 shadow-sm hover:shadow-md hover:border-gray-300 transition"
                >
                  <span className={`font-semibold text-sm ${current.accentText}`}>
                    {row.municipality}
                  </span>
                  <span className="text-center text-gray-600 text-sm">{row.office}</span>
                  <span className="text-center text-gray-600 text-sm">{row.contact}</span>
                  <span className={`text-right text-xs font-semibold leading-snug ${current.accentText}`}>
                    {row.team}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

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