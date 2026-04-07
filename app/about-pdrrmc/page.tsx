"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Globe, X, ZoomIn, ZoomOut, Home, Waves, Flame, CloudRain, Truck, Toolbox, Ambulance, ShieldCheck } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";

export default function AboutPDRRMC() {

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
            <span className="font-bold tracking-tight hidden md:block">PDRRMC ILOILO</span>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium uppercase tracking-wide">
            <Link href="/" className="hover:text-orange-400 transition">Home</Link>
            <Link href="/about-pdrrmo" className="hover:text-orange-400 transition">About PDRRMO</Link>
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
          About PDRRMC
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
                        <section className="mb-10">
        
                          <h2 className="text-2xl font-bold text-center text-[#002E5D] mb-3 font-Arial">
                            Official Office Logos
                          </h2>
        
                            <div className="flex flex-col items-center gap-3">
                              <Image
                                src="/PDRRMO LOGO.png"
                                alt="PDRRMO Logo"
                                width={150}
                                height={150}
                              />
                              <div className="flex flex-col">
                                <p className="text-lg font-medium text-[#002E5D]">Provincial Disaster Risk Reduction and Management Council</p>
                                <p className="text-md font-bold text-[#F58220] text-center">(PDRRMC)</p>
                              </div>
                            </div>
                            
                          
                        
                        </section>

        <h2 className="text-2xl font-bold text-center text-[#002E5D] mb-6 font-Arial">
            Provincial Disaster Risk Reduction and Management Council Composition
          </h2>
      </main>

        {/* PDRRMC Composition Table */}
          <section className="max-w-5xl mx-auto px-8 mb-14">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="grid grid-cols-[2fr_1fr] gap-2 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 border-b border-slate-200">
              <span className="text-lg">Name</span>
              <span className="text-left text-lg">Office</span>
            </div>

            <div className="divide-y divide-slate-200">
              {[
                { name: "John Doe", office: "Administrative Office" },
                { name: "Jane Smith", office: "Operations Center" },
                { name: "Maria Garcia", office: "Emergency Response" },
                { name: "Pedro Santos", office: "Planning Unit" },
                { name: "Anna Cruz", office: "Disaster Risk Reduction" },
                { name: "Samuel Reyes", office: "Monitoring Team" },
                { name: "Liza dela Cruz", office: "Logistics" },
                { name: "Miguel Ramos", office: "Public Information" },
                { name: "Karen Lopez", office: "Research Unit" },
                { name: "Rafael Tan", office: "Support Services" },
                { name: "May Valdez", office: "Community Outreach" },
                { name: "Evan Lee", office: "Training and Drills" },
              ].map(({ name, office }, i) => (
                <div key={i} className="grid grid-cols-[2fr_1fr] gap-2 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition">
                  <span>{name}</span>
                  <span className="text-left text-slate-500">{office}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      
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