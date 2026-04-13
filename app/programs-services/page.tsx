"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronDown, Clock, FileText, Users, ExternalLink, 
  ArrowRight, Search, Filter, MapPin, Shield, AlertTriangle,
  CheckCircle2, Circle
} from "lucide-react";
import Footer from "@/components/Footer";

type AccordionItemType = {
  id: string;
  title: string;
  description: string;
  processing?: string;
  requirements: string[];
  category: "program" | "external" | "internal";
};

const programs: AccordionItemType[] = [
  {
    id: "prog-1",
    title: "Disaster Risk Reduction and Management Training Program",
    description: "Capacity building activities for LDRRMOs, responders, volunteers, and community members focusing on disaster preparedness, response, and recovery.",
    requirements: [
      "Letter of request addressed to the PDRRMO Officer",
      "Identified target participants (LDRRMOs, responders, volunteers)",
      "Proposed training schedule and venue",
      "Coordination with barangay or municipal LGU",
      "Signed attendance sheets and post-training evaluation forms",
    ],
    category: "program",
  },
  {
    id: "prog-2",
    title: "Emergency Preparedness and Community Awareness Program",
    description: "Public education campaigns and community-based initiatives to strengthen disaster awareness, preparedness, and resilience.",
    requirements: [
      "Formal request from barangay or municipal office",
      "Identified community area and target population",
      "Proposed date and venue for the awareness campaign",
      "List of community leaders and key participants",
      "Post-activity report and photo documentation",
    ],
    category: "program",
  },
  {
    id: "prog-3",
    title: "Incident Command System (ICS) Implementation Program",
    description: "Training and implementation of ICS to ensure organized and effective disaster response operations.",
    requirements: [
      "Letter of request from the LGU or office head",
      "List of personnel to be trained",
      "Identified venue and equipment (projector, whiteboard)",
      "Coordination with the LDRRMO focal person",
      "Signed waiver and health declaration forms",
    ],
    category: "program",
  },
  {
    id: "prog-4",
    title: "Search, Rescue, and First Aid Capability Development",
    description: "Enhancing the capability of local responders through training in search and rescue operations and emergency medical response.",
    requirements: [
      "Formal request endorsed by the LDRRMO head",
      "List of qualified participants (responders, BFP, PNP, etc.)",
      "Medical clearance for physically demanding activities",
      "Availability of training ground or open venue",
      "Personal protective equipment for each participant",
    ],
    category: "program",
  },
  {
    id: "prog-5",
    title: "Early Warning System Development Program",
    description: "Designing and implementing community-based early warning systems to improve disaster preparedness and timely response.",
    requirements: [
      "Request letter from the barangay or municipal LGU",
      "Hazard and risk assessment of the area",
      "Identified EWS focal persons and community volunteers",
      "Coordination with PAGASA, MGB, or relevant agencies",
      "Community action plan for EWS maintenance and monitoring",
    ],
    category: "program",
  },
];

const externalServices: AccordionItemType[] = [
  {
    id: "ext-1",
    title: "Financial Assistance for LGUs on Calamity Prevention",
    description: "Preparation of disbursement vouchers and supporting documents for financial assistance to LGUs for calamity prevention and repair of damaged structures.",
    processing: "8 Days",
    requirements: [
      "Letter of request from the LGU chief executive",
      "Approved local ordinance or resolution",
      "Damage assessment report signed by the LDRRMO",
      "Program of work and cost estimate",
      "Barangay or municipal disaster risk reduction plan",
      "Certificate of no pending obligations from COA",
    ],
    category: "external",
  },
  {
    id: "ext-2",
    title: "Financial Assistance for LGUs for Additional DRRM Equipment",
    description: "Processing financial assistance to strengthen LGU disaster response capabilities through acquisition of DRRM property and equipment.",
    processing: "8 Days",
    requirements: [
      "Endorsed letter request from the Mayor or Governor",
      "List of equipment to be procured with specifications",
      "Resolution of the Sanggunian approving the request",
      "Annual procurement plan reflecting the equipment",
      "Certification of no available similar equipment from the LGU",
    ],
    category: "external",
  },
  {
    id: "ext-3",
    title: "Issuance of Nomination for Gawad Kalasag",
    description: "Processing and endorsement of nominations recognizing exemplary contributions and innovations in disaster risk reduction and climate adaptation.",
    processing: "7 Hours",
    requirements: [
      "Duly accomplished Gawad Kalasag nomination form",
      "Supporting documents (programs, citations, photos)",
      "Endorsement letter from the LDRRMO or LGU head",
      "Write-up on innovations or best practices implemented",
      "Proof of LDRRM Plan approval and submission",
    ],
    category: "external",
  },
  {
    id: "ext-4",
    title: "Certification of LDRRMP Compliance",
    description: "Issuance of certification verifying that the Local Disaster Risk Reduction and Management Plan complies with required standards.",
    processing: "7 Days",
    requirements: [
      "Certified true copy of the approved LDRRM Plan",
      "Sanggunian resolution approving the LDRRMP",
      "Proof of submission to the PDRRMO",
      "Updated contingency plan for priority hazards",
      "Endorsement from the LDRRMO focal person",
    ],
    category: "external",
  },
  {
    id: "ext-5",
    title: "Conduct of Requested DRRM Activities",
    description: "Provision of DRRM trainings including risk assessment, emergency planning, ICS, search and rescue, first aid, disaster awareness, and early warning systems.",
    processing: "1 Hour 15 Minutes",
    requirements: [
      "Written request from the requesting office or LGU",
      "Identified topic, date, time, and venue",
      "List of expected participants",
      "Availability of audiovisual equipment at the venue",
      "Coordination at least 5 working days in advance",
    ],
    category: "external",
  },
];

const internalServices: AccordionItemType[] = [
  {
    id: "int-1",
    title: "Financial Assistance to Provincial Government Offices",
    description: "Processing of financial assistance requests for the implementation of DRRM-related programs and projects of provincial offices.",
    processing: "3 Days",
    requirements: [
      "Memorandum request from the department head",
      "Approved project proposal or work plan",
      "Budget breakdown and justification",
      "Endorsement from the PDRRMO Officer",
      "Certification from the Budget Office on fund availability",
    ],
    category: "internal",
  },
];

type TabType = "all" | "program" | "external" | "internal";

export default function ProgramServices() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const allItems = [...programs, ...externalServices, ...internalServices];

  const filteredItems = allItems.filter((item) => {
    const matchesTab = activeTab === "all" || item.category === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabCounts = {
    all: allItems.length,
    program: programs.length,
    external: externalServices.length,
    internal: internalServices.length,
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "all", label: "All Services" },
    { id: "program", label: "Programs" },
    { id: "external", label: "External Services" },
    { id: "internal", label: "Internal Services" },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "program":
        return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" };
      case "external":
        return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" };
      case "internal":
        return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" };
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "program": return "Program";
      case "external": return "External Service";
      case "internal": return "Internal Service";
      default: return category;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* Hero Banner */}
      <section className="relative bg-[#002E5D] py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F58220]/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">
            PDRRMO Iloilo
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Programs & Services
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl">
            Disaster Risk Reduction and Management initiatives and services 
            provided by the Iloilo Provincial Government.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-8 -mt-4">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search programs and services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F58220] focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[140px] px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                  activeTab === tab.id
                    ? "bg-[#002E5D] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.label}
                <span className={`ml-2 text-xs ${activeTab === tab.id ? "text-orange-200" : "text-gray-400"}`}>
                  ({tabCounts[tab.id]})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing {filteredItems.length} {filteredItems.length === 1 ? "result" : "results"}
          {searchQuery && ` for "${searchQuery}"`}
        </p>

        {/* Services List */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No services found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search or filter</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const colors = getCategoryColor(item.category);
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    aria-expanded={isExpanded}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#F58220]"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
                          {getCategoryLabel(item.category)}
                        </span>
                      </div>
                      <h3 className={`font-bold text-lg ${isExpanded ? "text-[#002E5D]" : "text-gray-800"}`}>
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {item.processing && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{item.processing}</span>
                        </div>
                      )}
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[500px]" : "max-h-0"}`}>
                    <div className="px-5 pb-5 border-t border-gray-100">
                      <p className="text-gray-600 mt-4 leading-relaxed">
                        {item.description}
                      </p>

                      {item.requirements.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-bold text-[#002E5D] uppercase tracking-wide mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Requirements
                          </h4>
                          <ul className="space-y-2">
                            {item.requirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle2 className="w-4 h-4 text-[#F58220] mt-0.5 shrink-0" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.processing && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                          <Clock className="w-4 h-4 text-[#F58220]" />
                          <span>Processing Time:</span>
                          <span className="font-semibold text-[#002E5D]">{item.processing}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Contact Card */}
        <div className="bg-gradient-to-r from-[#002E5D] to-[#001a38] rounded-xl shadow-lg p-8 mt-12 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Need More Information?</h3>
              <p className="text-blue-200">Contact us for inquiries about our programs and services</p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/emergency"
                className="flex items-center gap-2 bg-[#F58220] hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                <Shield className="w-5 h-5" />
                Emergency Contact
              </Link>
              <Link
                href="/about-pdrrmo"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                About Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
