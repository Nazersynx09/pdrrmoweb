"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, Globe, X, ZoomIn, ZoomOut, Home, Waves, Flame, CloudRain, 
  Truck, Toolbox, ShieldCheck, Users, Target, FileText, Clock, 
  Shield, AlertTriangle, ArrowRight, Building2, GraduationCap, Heart, HandHeart
} from "lucide-react";
import { useState, useCallback } from "react";
import Footer from "@/components/Footer";

const councilMembers = [
  { name: "Hon. Arthur R. Defensor Jr.", position: "Provincial Governor & PDRRMC Chairman", role: "Chairperson" },
  { name: "Hon. Christine E. Garin", position: "Provincial Vice Governor", role: "Co-Chairperson" },
  { name: "Engr. Jose R. Cinco", position: "Provincial DRRM Officer", role: "Vice Chairperson for Operations" },
  { name: "PCOL Dennis B. Asuncion", position: "Provincial Director, PNP Iloilo", role: "Member" },
  { name: "FDir. Marc J. Ofil", position: "Provincial Fire Marshal, BFP Iloilo", role: "Member" },
  { name: "Dr. Maria Theresa S. Tirona", position: "Provincial Health Officer", role: "Member" },
  { name: "Engr. Antonio G. M. Abellada", position: "Provincial Engineer", role: "Member" },
  { name: "Dir. Ramoncito L. H. Fernandez", position: "Provincial Director, DILG", role: "Member" },
];

const memberAgencies = [
  { name: "Philippine National Police - Iloilo", icon: Shield },
  { name: "Bureau of Fire Protection - Iloilo", icon: Flame },
  { name: "Department of Health - Western Visayas", icon: Heart },
  { name: "Department of Education - Iloilo", icon: GraduationCap },
  { name: "DILG Iloilo", icon: Building2 },
  { name: "Provincial Engineering Office", icon: Toolbox },
  { name: "Provincial Social Welfare Office", icon: HandHeart },
  { name: "Private Sector Representatives", icon: Users },
];

export default function AboutPDRRMC() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* Hero Banner */}
      <section className="relative bg-[#002E5D] py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F58220]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            About PDRRMC
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            The policy-making and coordinating body for disaster risk reduction 
            and management in the Province of Iloilo.
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
            The Provincial Disaster Risk Reduction and Management Council (PDRRMC) of Iloilo is a committee established under Republic Act 10121 (Philippine Disaster Risk Reduction and Management Act of 2010). It serves as the policy-making and coordinating body for disaster risk reduction and management in the province.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            The PDRRMC is chaired by the Provincial Governor and composed of various provincial department heads, representatives from national government agencies, the private sector, and civil society organizations. The council ensures a coordinated and integrated approach to disaster management across all municipalities in Iloilo.
          </p>
          <p className="text-gray-600 leading-relaxed">
            As the highest decision-making body on DRRM in the province, the PDRRMC oversees the implementation of the Provincial DRRM Plan, allocates resources for disaster preparedness and response, and coordinates with the regional and national disaster management authorities during emergencies.
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
              A disaster-resilient and climate-adaptive Province of Iloilo where government, private sector, and communities work together to reduce disaster risks, protect lives and livelihoods, and ensure sustainable development for all Ilonggos.
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
              To provide leadership in formulating and implementing disaster risk reduction and management policies, plans, and programs; to coordinate efforts among all stakeholders; and to ensure adequate resources for disaster preparedness, response, recovery, and mitigation in the Province of Iloilo.
            </p>
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
              "Formulating and updating the Provincial DRRM Plan",
              "Approving annual DRRM budgets",
              "Coordinating disaster response operations",
              "Establishing early warning systems",
              "Conducting disaster risk assessments and mapping",
              "Ensuring compliance with national DRRM standards",
              "Representing the province in regional meetings",
              "Overseeing emergency response coordination"
            ].map((func, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-[#F58220] mt-2 shrink-0" />
                <span className="text-gray-700">{func}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Council Composition */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#002E5D] text-center mb-2">Council Composition</h2>
          <p className="text-gray-500 text-center mb-8">Key officials and representatives of the PDRRMC</p>
          
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 bg-[#002E5D] px-6 py-4">
              <span className="text-white font-bold">Position</span>
              <span className="text-white font-bold">Name / Office</span>
            </div>
            <div className="divide-y divide-gray-100">
              {councilMembers.map((member, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 px-6 py-4 hover:bg-gray-50 transition">
                  <span className="font-semibold text-[#002E5D]">{member.role}</span>
                  <div>
                    <p className="font-medium text-gray-800">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Member Agencies */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#002E5D] text-center mb-2">Member Agencies</h2>
          <p className="text-gray-500 text-center mb-8">Government agencies and organizations represented in the council</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {memberAgencies.map((agency, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition">
                <div className="w-10 h-10 rounded-lg bg-[#002E5D] flex items-center justify-center shrink-0">
                  <agency.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{agency.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Official Logo */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#002E5D] text-center mb-8">PDRRMC Official</h2>
          <div className="flex flex-col items-center">
            <Image
              src="/pdrrmoLogo.png"
              alt="PDRRMC Logo"
              width={180}
              height={180}
              className="w-44 h-44 object-contain mb-6"
            />
            <h3 className="text-xl font-bold text-[#002E5D]">Provincial Disaster Risk Reduction and Management Council</h3>
            <p className="text-[#F58220] font-bold text-lg">(PDRRMC)</p>
            <p className="text-gray-500 text-center mt-2">Province of Iloilo</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/about-pdrrmo" className="flex items-center justify-center gap-2 bg-[#002E5D] hover:bg-[#001a38] text-white font-bold py-4 px-6 rounded-xl transition-colors">
            About PDRRMO <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/operation-center" className="flex items-center justify-center gap-2 bg-[#F58220] hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-colors">
            Operation Center <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/emergency" className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-6 rounded-xl transition-colors">
            Emergency Contacts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
