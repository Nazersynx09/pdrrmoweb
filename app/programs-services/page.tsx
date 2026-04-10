"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Globe } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";

type AccordionItemType = {
  title: string;
  description: string;
  processing?: string;
  requirements: string[];
};

type SectionType = "program" | "external" | "internal";

const programs: AccordionItemType[] = [
  {
    title: "Disaster Risk Reduction and Management Training Program",
    description:
      "Capacity building activities for LDRRMOs, responders, volunteers, and community members focusing on disaster preparedness, response, and recovery.",
    requirements: [
      "Letter of request addressed to the PDRRMO Officer",
      "Identified target participants (LDRRMOs, responders, volunteers)",
      "Proposed training schedule and venue",
      "Coordination with barangay or municipal LGU",
      "Signed attendance sheets and post-training evaluation forms",
    ],
  },
  {
    title: "Emergency Preparedness and Community Awareness Program",
    description:
      "Public education campaigns and community-based initiatives to strengthen disaster awareness, preparedness, and resilience.",
    requirements: [
      "Formal request from barangay or municipal office",
      "Identified community area and target population",
      "Proposed date and venue for the awareness campaign",
      "List of community leaders and key participants",
      "Post-activity report and photo documentation",
    ],
  },
  {
    title: "Incident Command System (ICS) Implementation Program",
    description:
      "Training and implementation of ICS to ensure organized and effective disaster response operations.",
    requirements: [
      "Letter of request from the LGU or office head",
      "List of personnel to be trained",
      "Identified venue and equipment (projector, whiteboard)",
      "Coordination with the LDRRMO focal person",
      "Signed waiver and health declaration forms",
    ],
  },
  {
    title: "Search, Rescue, and First Aid Capability Development",
    description:
      "Enhancing the capability of local responders through training in search and rescue operations and emergency medical response.",
    requirements: [
      "Formal request endorsed by the LDRRMO head",
      "List of qualified participants (responders, BFP, PNP, etc.)",
      "Medical clearance for physically demanding activities",
      "Availability of training ground or open venue",
      "Personal protective equipment for each participant",
    ],
  },
  {
    title: "Early Warning System Development Program",
    description:
      "Designing and implementing community-based early warning systems to improve disaster preparedness and timely response.",
    requirements: [
      "Request letter from the barangay or municipal LGU",
      "Hazard and risk assessment of the area",
      "Identified EWS focal persons and community volunteers",
      "Coordination with PAGASA, MGB, or relevant agencies",
      "Community action plan for EWS maintenance and monitoring",
    ],
  },
];

const externalServices: AccordionItemType[] = [
  {
    title: "Financial Assistance for LGUs on Calamity Prevention / Damaged Structures",
    description:
      "Preparation of disbursement vouchers and supporting documents for financial assistance to LGUs for calamity prevention and repair of damaged structures.",
    processing: "8 Days",
    requirements: [
      "Letter of request from the LGU chief executive",
      "Approved local ordinance or resolution",
      "Damage assessment report signed by the LDRRMO",
      "Program of work and cost estimate",
      "Barangay or municipal disaster risk reduction plan",
      "Certificate of no pending obligations from COA",
    ],
  },
  {
    title: "Financial Assistance for LGUs for Additional DRRM Equipment",
    description:
      "Processing financial assistance to strengthen LGU disaster response capabilities through acquisition of DRRM property and equipment.",
    processing: "8 Days",
    requirements: [
      "Endorsed letter request from the Mayor or Governor",
      "List of equipment to be procured with specifications",
      "Resolution of the Sanggunian approving the request",
      "Annual procurement plan reflecting the equipment",
      "Certification of no available similar equipment from the LGU",
    ],
  },
  {
    title: "Issuance of Nomination for Gawad Kalasag",
    description:
      "Processing and endorsement of nominations recognizing exemplary contributions and innovations in disaster risk reduction and climate adaptation.",
    processing: "7 Hours",
    requirements: [
      "Duly accomplished Gawad Kalasag nomination form",
      "Supporting documents (programs, citations, photos)",
      "Endorsement letter from the LDRRMO or LGU head",
      "Write-up on innovations or best practices implemented",
      "Proof of LDRRM Plan approval and submission",
    ],
  },
  {
    title: "Certification of LDRRMP Compliance",
    description:
      "Issuance of certification verifying that the Local Disaster Risk Reduction and Management Plan complies with required standards.",
    processing: "7 Days",
    requirements: [
      "Certified true copy of the approved LDRRM Plan",
      "Sanggunian resolution approving the LDRRMP",
      "Proof of submission to the PDRRMO",
      "Updated contingency plan for priority hazards",
      "Endorsement from the LDRRMO focal person",
    ],
  },
  {
    title: "Conduct of Requested DRRM Activities",
    description:
      "Provision of DRRM trainings including risk assessment, emergency planning, ICS, search and rescue, first aid, disaster awareness, and early warning systems.",
    processing: "1 Hour 15 Minutes",
    requirements: [
      "Written request from the requesting office or LGU",
      "Identified topic, date, time, and venue",
      "List of expected participants",
      "Availability of audiovisual equipment at the venue",
      "Coordination at least 5 working days in advance",
    ],
  },
];

const internalServices: AccordionItemType[] = [
  {
    title: "Financial Assistance to Provincial Government Offices",
    description:
      "Processing of financial assistance requests for the implementation of DRRM-related programs and projects of provincial offices.",
    processing: "3 Days",
    requirements: [
      "Memorandum request from the department head",
      "Approved project proposal or work plan",
      "Budget breakdown and justification",
      "Endorsement from the PDRRMO Officer",
      "Certification from the Budget Office on fund availability",
    ],
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transition: "transform 0.2s ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        color: "#9ca3af",
        flexShrink: 0,
      }}
    >
      <path
        d="M3 5l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AccordionItem({
  item,
  index,
  type,
}: {
  item: AccordionItemType;
  index: number;
  type: SectionType;
}) {
  const [open, setOpen] = useState(false);

  const procBadgeStyle: React.CSSProperties =
    type === "internal"
      ? { background: "#EAF3DE", color: "#27500A" }
      : { background: "#FAEEDA", color: "#633806" };

  return (
    <div
      style={{
        borderBottom: "0.5px solid #e5e7eb",
        ...(index === 0 ? { borderTop: "0.5px solid #e5e7eb" } : {}),
      }}
    >
      <button
  onClick={() => setOpen(!open)}
  aria-expanded={open}
  className="w-full flex items-center justify-between gap-3 py-13px text-left focus:outline-none"
>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flex: 1,
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 500,
              color: "#9ca3af",
              minWidth: "18px",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: open ? "#002E5D" : "inherit",
              lineHeight: 1.4,
            }}
          >
            {item.title}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          {item.processing && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 500,
                padding: "2px 8px",
                borderRadius: "20px",
                whiteSpace: "nowrap",
                ...procBadgeStyle,
              }}
            >
              {item.processing}
            </span>
          )}
          <ChevronIcon open={open} />
        </div>
      </button>

      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? "600px" : "0px",
          transition: "max-height 0.25s ease",
        }}
      >
        <div style={{ padding: "0 0 14px 28px" }}>
          <p
            style={{
              fontSize: "13px",
              color: "#6b7280",
              lineHeight: 1.65,
              marginBottom: "10px",
            }}
          >
            {item.description}
          </p>

          {item.requirements.length > 0 && (
            <>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "#9ca3af",
                  marginBottom: "6px",
                }}
              >
                Requirements
              </p>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  padding: 0,
                  margin: 0,
                }}
              >
                {item.requirements.map((req, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "7px",
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#F58220",
                        marginTop: "5px",
                        flexShrink: 0,
                        display: "inline-block",
                      }}
                    />
                    {req}
                  </li>
                ))}
              </ul>
            </>
          )}

          {item.processing && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "10px",
              }}
            >
              <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                Processing time:
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#002E5D",
                }}
              >
                {item.processing}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  count,
  pillStyle,
}: {
  title: string;
  count: string;
  pillStyle: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "0.75rem",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          color: "#6b7280",
        }}
      >
        {title}
      </span>
      <span
        style={{
          fontSize: "11px",
          fontWeight: 500,
          padding: "2px 8px",
          borderRadius: "20px",
          ...pillStyle,
        }}
      >
        {count}
      </span>
      <div style={{ flex: 1, height: "0.5px", background: "#e5e7eb" }} />
    </div>
  );
}

export default function ProgramServices() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900 mt-10">

      {/* ── HERO BANNER ── */}
      <div className="bg-[#002E5D] text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-1">PDRRMO Iloilo</p>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Programs &amp; Services</h1>
          <p className="text-blue-200 text-sm max-w-xl">
            Disaster Risk Reduction and Management initiatives and services
            provided by the Iloilo Provincial Government.
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-16">


        {/* PROGRAMS */}
        <div style={{ marginBottom: "2rem" }}>
          <SectionHeader
            title="Programs"
            count="5 programs"
            pillStyle={{ background: "#E6F1FB", color: "#0C447C" }}
          />
          {programs.map((item, i) => (
            <AccordionItem key={i} item={item} index={i} type="program" />
          ))}
        </div>

        {/* EXTERNAL SERVICES */}
        <div style={{ marginBottom: "2rem" }}>
          <SectionHeader
            title="External Services"
            count="5 services"
            pillStyle={{ background: "#FAEEDA", color: "#633806" }}
          />
          {externalServices.map((item, i) => (
            <AccordionItem key={i} item={item} index={i} type="external" />
          ))}
        </div>

        {/* INTERNAL SERVICES */}
        <div style={{ marginBottom: "2rem" }}>
          <SectionHeader
            title="Internal Services"
            count="1 service"
            pillStyle={{ background: "#EAF3DE", color: "#27500A" }}
          />
          {internalServices.map((item, i) => (
            <AccordionItem key={i} item={item} index={i} type="internal" />
          ))}
        </div>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 pt-12 pb-6 mt-10">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-10 border-b border-gray-100 pb-10 mb-7">

          {/* LOGOS + NAMES */}
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
              <p className="text-xs font-bold text-[#002E5D]">
                Iloilo Provincial Disaster Risk Reduction and Management Office
              </p>
              <p className="text-xs font-bold text-[#002E5D]">
                Provincial Community Defense Action Center - Iloilo
              </p>
            </div>
          </div>

          {/* CONTACT */}
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

          {/* SOCIAL + PORTALS */}
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
            <a
              href="https://iloilo.gov.ph"
              target="_blank"
              rel="noreferrer noopener"
              className="text-xs text-gray-600 font-bold underline"
            >
              Iloilo.gov.ph
            </a>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-400 font-bold uppercase">
          <p>Developed by: PDRRMO Research and Planning Intern (Batch 2025)</p>
          <p>© 2024 All Rights Reserved</p>
        </div>
      </footer>

    </div>
  );
}