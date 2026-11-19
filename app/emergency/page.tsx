"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF } from "react-icons/fa";
import { MapPin, Globe } from "lucide-react";
import { useState } from "react";
import Footer from "@/components/Footer";

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
      { municipality: "GUIMBAL",  office: "Lorem Ipsum", contact: "09291564956", team: "Guimbal Response & Emergency Alert Team" },
      { municipality: "IGBARAS",  office: "Lorem Ipsum", contact: "09550866651", team: "Igbaras Search & Emergency Response Team" },
      { municipality: "MIAGAO",   office: "Lorem Ipsum", contact: "09639866435", team: "Miagao Emergency Response Group" },
      { municipality: "OTON",     office: "Lorem Ipsum", contact: "09205115666/09681397082", team: "Oton Search and Rescue Team" },
      { municipality: "SAN JOAQUIN", office: "Lorem Ipsum", contact: "09380961680", team: "MDRRMO Response Team" },
      { municipality: "TIGBAUAN",  office: "Lorem Ipsum", contact: "09380943494 ", team: "Tigbauan Emergency Rescue Team" },
      { municipality: "TUBUNGAN",  office: "Lorem Ipsum", contact: "09481631639", team: "Tubungan Responders Emergency Action Team" },
    ],
  },
  {
    name: "2nd District",
    rows: [
      { municipality: "ALIMODIAN",   office: "Lorem Ipsum", contact: "09089672059/09515706163", team: "Alimodian READY" },
      { municipality: "LEGANES",    office: "Lorem Ipsum", contact: "09463062543", team: "Emergency Assistance Group of Leganes" },
      { municipality: "LEON",   office: "Lorem Ipsum", contact: "09814108737/09985716740", team: "MDRRMO Response Team" },
      { municipality: "NEW LUCENA",     office: "Lorem Ipsum", contact: "09700858158/09930930848", team: "New Lucena Emergency Response Team" },
      { municipality: "PAVIA",    office: "Lorem Ipsum", contact: "09462115965", team: "Pavia Emergency Responders" },
      { municipality: "SAN MIGUEL",    office: "Lorem Ipsum", contact: "09120705786", team: "San Miguel Emergency Response Team" },
      { municipality: "SANTA BARBARA",    office: "Lorem Ipsum", contact: "09491217362", team: "Alert Emergency Response Team" },
      { municipality: "ZARRAGA",    office: "Lorem Ipsum", contact: "09518618160", team: "Zarraga Blackhawk Emergency Response Unit" },
    ],
  },
  {
    name: "3rd District",
    rows: [
      { municipality: "BADIANGAN",     office: "Lorem Ipsum", contact: "09707647199/09487850398", team: "Badiangan Search and Rescue Response Team" },
      { municipality: "BINGAWAN",   office: "Lorem Ipsum", contact: "09637659991", team: "MDRRMO Response Team" },
      { municipality: "CABATUAN", office: "Lorem Ipsum", contact: "09985559619", team: "Cabatuan Response Emergency Services" },
      { municipality: "CALINOG",     office: "Lorem Ipsum", contact: "09073019231/09667767042", team: "Calinog Search and Rescue" },
      { municipality: "LAMBUNAO",       office: "Lorem Ipsum", contact: "09636669331", team: "Lambunao Emergency Response Search and Rescue" },
      { municipality: "JANIUAY",       office: "Lorem Ipsum", contact: "09309200205", team: "Janiuay Active Responders for Health and Disasters" },
      { municipality: "MAASIN",       office: "Lorem Ipsum", contact: "09604200633", team: "MDRRMO Response Team" },
      { municipality: "MINA",       office: "Lorem Ipsum", contact: "09121355276/09178633766", team: "Mina Emergency Assistance Rescue Alert Teamm" },
      { municipality: "POTOTAN",       office: "Lorem Ipsum", contact: "09307322021/09307529623", team: "Pototan Emergency Management and Response Team" },
    ],
  },
  {
    name: "4th District",
    rows: [
      { municipality: "ANILAO",     office: "Lorem Ipsum", contact: "09124236522", team: "Alert-Anilao Local Emergency Response Team" },
      { municipality: "BANATE",   office: "Lorem Ipsum", contact: "09855466152/09103949428", team: "Banate Quick Response Unit" },
      { municipality: "BAROTAC NUEVO",   office: "Lorem Ipsum", contact: "09177122077/09634234009", team: "Barotac Nuevo Emergency Response Team" },
      { municipality: "DINGLE",   office: "Lorem Ipsum", contact: "09201308479", team: "MDRRMO Response Team" },
      { municipality: "DUENAS",   office: "Lorem Ipsum", contact: "09517489563", team: "Drive & Dueñas Youth Drive Team" },
      { municipality: "DUMANGAS",   office: "Lorem Ipsum", contact: "09476045307", team: "Dumangas Rescue Emergency Assistance Movement" },
      { municipality: "PASSI CITY",   office: "Lorem Ipsum", contact: "09814961800", team: "CDRRMO Response Team" },
      { municipality: "SAN ENRIQUE",   office: "Lorem Ipsum", contact: "09639883134", team: "San Enrique Emergency Management Team" },
    ]
  },
  {
    name: "5th District",
    rows: [
      { municipality: "AJUY",     office: "Lorem Ipsum", contact: "09462576350", team: "Ajuy Response Team" },
      { municipality: "BALASAN",   office: "Lorem Ipsum", contact: "09778026477/09072499158", team: "MDRRMO Response Team" },
      { municipality: "BAROTAC VIEJO",   office: "Lorem Ipsum", contact: "09630385315", team: "Barotac Viejo Emergency Response Team" },
      { municipality: "BATAD",   office: "Lorem Ipsum", contact: "09303896034", team: "MDRRMO Response Team" },
      { municipality: "CARLES",   office: "Lorem Ipsum", contact: "0948073957", team: "Carles Response and Emergency Squad" },
      { municipality: "CONCEPCION",   office: "Lorem Ipsum", contact: "09999249263/09128584838", team: "Manaphag Quick Response Team " },
      { municipality: "ESTANCIA",   office: "Lorem Ipsum", contact: "09165740190/09212704039", team: "Estancia Search and Rescue Team" },
      { municipality: "LEMERY",   office: "Lorem Ipsum", contact: "09097486771", team: "Lemery Response Team" },
      { municipality: "SAN DIONISIO",   office: "Lorem Ipsum", contact: "09175018128/09178910990", team: "San Dionisio On Response Immediate Group" },
      { municipality: "SAN RAFAEL",   office: "Lorem Ipsum", contact: "09688723235", team: "MDRRMO Response Team" },
      { municipality: "SARA",   office: "Lorem Ipsum", contact: "09175338042/09394572249", team: "MDRRMO Response Team" },
    ]
  }
];

// const policeDistricts: District[] = [
//   {
//     name: "1st District",
//     rows: [
//       { municipality: "Anilao",     office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
//       { municipality: "Badiangan",  office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
//       { municipality: "Igbaras",    office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
//       { municipality: "Miagao",     office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
//       { municipality: "Oton",       office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
//     ],
//   },
//   {
//     name: "2nd District",
//     rows: [
//       { municipality: "Cabatuan",   office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
//       { municipality: "Calinog",    office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
//       { municipality: "Lambunao",   office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
//       { municipality: "Maasin",     office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
//       { municipality: "Pototan",    office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
//     ],
//   },
//   {
//     name: "3rd District",
//     rows: [
//       { municipality: "Duenas",     office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
//       { municipality: "Dumangas",   office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
//       { municipality: "Passi City", office: "P/Col. Lorem Ipsum", contact: "0910666666", team: "Iloilo Police Provincial Office" },
//     ],
//   },
//     {
//     name: "4th District",
//     rows: [
//       { municipality: "Lemery",     office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "San Rafael",   office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Concepcion", office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//     ],
//   },
//   {
//     name: "5th District",
//     rows: [
//       { municipality: "Carles",     office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Batad",   office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Anilao", office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//     ],
//   },
// ];

// const fireDistricts: District[] = [
//   {
//     name: "1st District",
//     rows: [
//       { municipality: "Anilao",     office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
//       { municipality: "Badiangan",  office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
//       { municipality: "Igbaras",    office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
//       { municipality: "Miagao",     office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
//       { municipality: "Oton",       office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
//     ],
//   },
//   {
//     name: "2nd District",
//     rows: [
//       { municipality: "Cabatuan",   office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
//       { municipality: "Calinog",    office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
//       { municipality: "Lambunao",   office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
//       { municipality: "Maasin",     office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
//       { municipality: "Pototan",    office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
//     ],
//   },
//   {
//     name: "3rd District",
//     rows: [
//       { municipality: "Duenas",     office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
//       { municipality: "Dumangas",   office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
//       { municipality: "Passi City", office: "SFO1 Lorem Ipsum", contact: "0910666666", team: "Bureau of Fire Protection" },
//     ],
//   },
//     {
//     name: "4th District",
//     rows: [
//       { municipality: "Lemery",     office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "San Rafael",   office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Concepcion", office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//     ],
//   },
//   {
//     name: "5th District",
//     rows: [
//       { municipality: "Carles",     office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Batad",   office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Anilao", office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//     ],
//   },
// ];

// const rhuDistricts: District[] = [
//   {
//     name: "1st District",
//     rows: [
//       { municipality: "Anilao",     office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Badiangan",  office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Igbaras",    office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Miagao",     office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Oton",       office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//     ],
//   },
//   {
//     name: "2nd District",
//     rows: [
//       { municipality: "Cabatuan",   office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Calinog",    office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Lambunao",   office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Maasin",     office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Pototan",    office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//     ],
//   },
//   {
//     name: "3rd District",
//     rows: [
//       { municipality: "Duenas",     office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Dumangas",   office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Passi City", office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//     ],
//   },
//   {
//     name: "4th District",
//     rows: [
//       { municipality: "Lemery",     office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "San Rafael",   office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Concepcion", office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//     ],
//   },
//   {
//     name: "5th District",
//     rows: [
//       { municipality: "Carles",     office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Batad",   office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//       { municipality: "Anilao", office: "Dr. Lorem Ipsum", contact: "0910666666", team: "Rural Health Unit" },
//     ],
//   },
// ];

// ─── TAB CONFIG ───────────────────────────────────────────────────────────────

const tabs: {
  key: TabKey;
  label: string;
  shortLabel: string;
  headers: [string, string, string];
  data: District[];
  activeBg: string;
  headerBg: string;
  accentText: string;
}[] = [
  {
    key: "ldrrmo",
    label: "LDRRMO",
    shortLabel: "LDRRMO",
    headers: ["Municipality", "Contact Number", "Local Response Team"],
    data: ldrrmoDistricts,
    activeBg: "bg-[#002E5D] text-white border-[#002E5D]",
    headerBg: "bg-[#002E5D]",
    accentText: "text-[#002E5D]",
  },
  // {
  //   key: "police",
  //   label: "Municipal Police Station",
  //   shortLabel: "Police",
  //   headers: ["Municipality", "Station Commander", "Contact Number", "Office"],
  //   data: policeDistricts,
  //   activeBg: "bg-blue-700 text-white border-blue-700",
  //   headerBg: "bg-blue-700",
  //   accentText: "text-blue-700",
  // },
  // {
  //   key: "fire",
  //   label: "Bureau of Fire",
  //   shortLabel: "Fire",
  //   headers: ["Municipality", "Fire Marshal / OIC", "Contact Number", "Office"],
  //   data: fireDistricts,
  //   activeBg: "bg-orange-600 text-white border-orange-600",
  //   headerBg: "bg-orange-600",
  //   accentText: "text-orange-600",
  // },
  // {
  //   key: "rhu",
  //   label: "Rural Health Unit",
  //   shortLabel: "RHU",
  //   headers: ["Municipality", "Municipal Health Officer", "Contact Number", "Office"],
  //   data: rhuDistricts,
  //   activeBg: "bg-green-700 text-white border-green-700",
  //   headerBg: "bg-green-700",
  //   accentText: "text-green-700",
  // },
];

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function ContactDetailsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("ldrrmo");

  const current = tabs.find((t) => t.key === activeTab)!;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">

      {/* NAV */}

      {/* MAIN */}
      <main className="max-w-4xl mx-auto px-4 py-10">

        {/* Page Title */}
        <h1 className="text-center text-2xl font-black uppercase tracking-widest text-[#F58220] mb-2">
          Contact Details
        </h1>
        <p className="text-center text-sm text-gray-500 mb-8">
          Iloilo Province — Emergency and Disaster Response Contacts
        </p>

        <div className="mb-8 flex justify-center px-2">
          <a
            href="tel:911"
            className="inline-flex min-h-12 w-full max-w-sm items-center justify-center rounded-lg bg-orange-600 px-5 py-3 text-center text-base font-bold text-white shadow-md transition hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 active:scale-[0.98] sm:w-auto sm:px-8 sm:text-lg"
          >
            Immediate emergency? Call 911
          </a>
        </div>

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
        <div className="grid grid-cols-3 gap-2 mb-4">
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
                  className="grid grid-cols-3 gap-2 bg-white border border-gray-200 rounded-md px-3 py-3 text-sm text-gray-700 shadow-sm hover:shadow-md hover:border-gray-300 transition"
                >
                  <span className={`font-semibold text-sm ${current.accentText}`}>
                    {row.municipality}
                  </span>
                  {/* <span className="text-center text-gray-600 text-sm">{row.office}</span> */}
                  <span className="text-center text-gray-600 text-sm">{row.contact}</span>
                  <span className={`text-right text-xs font-semibold leading-snug ${current.accentText}`}>
                    {row.team}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="card bg-white border border-gray-200 rounded-md px-4 py-6 shadow-sm hover:shadow-md hover:border-gray-300 transition">
          <p className="text-center text-lg text-orange-600 font-bold">
            PDRRMO OFFICE: (033) 328-7920
          </p>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  );
}