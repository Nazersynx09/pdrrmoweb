"use client";

import Image from "next/image";
import {
  MapPin,
  Globe,
} from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import Link from "next/link";


export default function Emergency() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* --- TOP NAVIGATION --- */}
      <nav className="bg-[#002E5D] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-1">
            
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
             <Link href="/" className="hover:text-orange-400 transition">
              Home
            </Link>

            <Link href="/about-pdrrmo" className="hover:text-orange-400 transition">
              About PDRRMO
            </Link>

            <Link href="/about-pdrrmc" className="hover:text-orange-400 transition">
              About PDRRMC
            </Link>

            <Link href="/programs-services" className="hover:text-orange-400 transition">
              Programs and Services
            </Link>

            <Link href="/resources" className="hover:text-orange-400 transition">
              Resources
            </Link>

            <Link href="/operation-center" className="hover:text-orange-400 transition">
              Operation Center
            </Link>
          </div>

          <button className="bg-[#F58220] hover:bg-orange-600 px-4 py-2 rounded font-bold text-xs uppercase transition">
            Emergency Contact
          </button>
        </div>
      </nav>

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
};