"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, Globe, X, ZoomIn, ZoomOut, Home, Waves, Flame, CloudRain, 
  Truck, Toolbox, ShieldCheck, Users, Target, FileText, Clock, 
  Shield, AlertTriangle, ArrowRight, Building2, GraduationCap, Heart, HandHeart,
} from "lucide-react";
import { useState, useCallback } from "react";
import Footer from "@/components/Footer";

const councilMembers = [
  { name: "Hon. Arthur R. Defensor Jr.", position: "Provincial Governor & PDRRMC Chairman", role: "Chairperson" },
  { name: "Department of Science and technology - Iloilo", position: "Vice-Chairperson for Prevention and Mitigation", role: "Vice-Chairperson" },
  { name: "Department of Interior and Local Government - Iloilo", position: "Vice Chairperson for Preparedness", role: "Vice-Chairperson" },
  { name: "Provincial Social Welfare and Development Office", position: "Vice-Chairperson for Response", role: "Vice-Chairperson" },
  { name: "Provincial Planning and Development Coordinator", position: "Vice-Chairperson for Rehabilitation and Recovery", role: "Vice-Chairperson" },
  { name: "Representative of the Sangguniang Panlalawigan President", role: "Member" },
  { name: "Philippine Councilor's League - Iloilo", role: "Member" },
  { name: "President, Liga ng mga Punong Barangay - Iloilo", role: "Member" },
];

const ProvincialOffices = [
  // Provincial Offices
  { name: "Information Communication Technology Management Office", role: "Member" },
  { name: "General Services Office", role: "Member" },
  { name: "Hospital Management Office", role: "Member" },
  { name: "Provincial Administrator's Office", role: "Member" },
  { name: "Provincial Agriculture Office", role: "Member" },
  { name: "Provincial Budget Office", role: "Member" },
  { name: "Provincial Disaster Risk Reduction & Management Office", role: "Member" },
  { name: "Provincial Engineer's Office", role: "Member" },
  { name: "Provincial Environment & Natural Resources Office", role: "Member" },
  { name: "Provincial Health Office", role: "Member" },
  { name: "Provincial Planning and Development Office", role: "Member" },
  { name: "Gender and Development Division - PPDO", role: "Member" },
  { name: "Provincial Social Welfare & Development Office", role: "Member" },
  { name: "Provincial Tourism Office", role: "Member" },
  { name: "Provincial Trade Investment & Cooperatives Development Office", role: "Member" },
  { name: "Provincial Treasurer's Office", role: "Member" },
  { name: "Provincial Veterinary Office", role: "Member" },
]

const memberAgencies = [
  { name: "Philippine National Police - Iloilo", icon: Shield },
  { name: "Armed Forces of the Philippines - 6th Infantry Division", icon: Shield },
  { name: "Philippine Coast Guard - Iloilo District", icon: Waves },
  { name: "Bureau of Fire Protection - Iloilo", icon: Flame },
  { name: "Office of the Civil Defense VI", icon: ShieldCheck },
  { name: "Department of Education - Iloilo", icon: GraduationCap },
  { name: "DILG Iloilo", icon: Building2 },
  { name: "Philippine Red Cross - Iloilo Chapter", icon: HandHeart },
  { name: "Department of Science and Technology - Iloilo", icon: Globe },
  { name: "Philippine Atmospheric, Geophysical and Astronomical Services Administration (PAGASA) - Iloilo", icon: CloudRain },
  { name: "Philippine Information Agency - Iloilo", icon: Globe },
  { name: "Department of Public Works and Highways - Iloilo", icon: Truck },
  { name: "Department of Agrarian Reform - Iloilo", icon: HandHeart },
  { name: "Department of Transportation", icon: HandHeart },
  { name: "Civil Aviation Authority VI", icon: HandHeart },
  { name: "Department of Trade and Industry - Iloilo", icon: HandHeart },
  { name: "Department of Tourism VI", icon: HandHeart },
  { name: "Regional Maritime Unit 6", icon: HandHeart },
  { name: "Philippine Crop Insurance Corporation - Iloilo", icon: HandHeart },
  { name: "National Food Authority - Iloilo", icon: HandHeart },
  { name: "National Irrigation Administration - Iloilo", icon: HandHeart },
  { name: "Technical Education and Skills Development Authority - Iloilo", icon: HandHeart },
  { name: "National Telecommunications Commission - Iloilo", icon: HandHeart },
  { name: "Iloilo Electric Companies (I, II & III)", icon: HandHeart },
  { name: "Philippine Information Agency - Iloilo", icon: HandHeart },

  
    // Accredited Civil Society Organizations (CSOs)
  { name: "Iloilo Provincial Federation of Associations of Persons with Disabilities (IPFADPWD), Inc.", role: "Member" },
  { name: "Creative Community Foundation, Inc.", role: "Member" },
  { name: "Association of Dedicated Values Ordained Chaplain Advocators Towards Excellence Services, Inc. (ADVOCATES, INC. - ILOILO)", role: "Member" },
  { name: "Iloilo Federation Fire Brigade, Inc.", role: "Member" },
  { name: "Zoological Society of London-CMRP Philippines, Inc.", role: "Member" },
  { name: "Philippine Alliance of Volunteer Communicators and Responders for Emergency Services Inc. (PAVCARES INC)", role: "Member" },
  { name: "Regional Coordinator, Homeless Peoples Federation Philippines Inc. (HPFPI)", role: "Member" },
  { name: "Samahan Defense Force Multiplier (SDFM) Inc.", role: "Member" },
  { name: "Iloilo Caucus of Development Non Organization Inc.", role: "Member" },

  // Private Sector Representatives
  { name: "Dingle Multi-Purpose Cooperative", role: "Member" },
  { name: "Western Visayas Caving Association, Inc.", role: "Member" },

  // Academe Representative
  { name: "Iloilo Science and Technology University", role: "Member" }
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

        {/* Provincial Offices */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#002E5D] text-center mb-2">Provincial Offices</h2>
          <p className="text-gray-500 text-center mb-8">Key provincial offices and departments</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ProvincialOffices.map((office, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition">
                <div className="w-10 h-10 rounded-lg bg-[#002E5D] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{office.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Member Agencies */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#002E5D] text-center mb-2">Member Agencies and Organizations</h2>
          <p className="text-gray-500 text-center mb-8">Government agencies and organizations represented in the council</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {memberAgencies.map((agency, i) => {
              const AgencyIcon = agency.icon ?? Building2;

              return (
                <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition">
                  <div className="w-10 h-10 rounded-lg bg-[#002E5D] flex items-center justify-center shrink-0">
                    <AgencyIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{agency.name}</span>
                </div>
              );
            })}
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
