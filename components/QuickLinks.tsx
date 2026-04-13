import Link from "next/link";
import { CloudRain, Activity, Shield, MapPin, Users, Phone } from "lucide-react";

interface QuickLinksProps {
  pagasaUrl?: string;
  phivolcsUrl?: string;
  ndrrmcUrl?: string;
}

export default function QuickLinks({ 
  pagasaUrl = "https://www.pagasa.dost.gov.ph/",
  phivolcsUrl = "https://www.phivolcs.dost.gov.ph/",
  ndrrmcUrl = "https://ndrrmc.gov.ph/"
}: QuickLinksProps) {
  const links = [
    {
      label: "PAGASA Weather",
      href: pagasaUrl,
      icon: CloudRain,
      color: "text-blue-500",
      hoverColor: "group-hover:text-[#F58220]",
    },
    {
      label: "PHIVOLCS",
      href: phivolcsUrl,
      icon: Activity,
      color: "text-red-500",
      hoverColor: "group-hover:text-[#F58220]",
    },
    {
      label: "NDRRMC",
      href: ndrrmcUrl,
      icon: Shield,
      color: "text-green-500",
      hoverColor: "group-hover:text-[#F58220]",
    },
    {
      label: "OPCEN",
      href: "/operation-center",
      icon: MapPin,
      color: "text-purple-500",
      hoverColor: "group-hover:text-[#F58220]",
      isInternal: true,
    },
    {
      label: "About Us",
      href: "/about-pdrrmo",
      icon: Users,
      color: "text-orange-500",
      hoverColor: "group-hover:text-[#F58220]",
      isInternal: true,
    },
    {
      label: "Emergency",
      href: "/emergency",
      icon: Phone,
      color: "text-white",
      hoverColor: "group-hover:text-[#002E5D]",
      isPrimary: true,
    },
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-center text-xl sm:text-2xl font-black text-[#002E5D] uppercase mb-3">
          Quick Links
        </h2>
        <p className="text-center text-gray-500 mb-10">
          Access important resources and services
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {links.map((link, i) => (
            link.isInternal ? (
              <Link
                key={i}
                href={link.href}
                className={`flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all group ${
                  link.isPrimary ? "bg-[#F58220]" : ""
                }`}
              >
                <link.icon className={`w-8 h-8 ${link.isPrimary ? "text-white" : `${link.color} ${link.hoverColor} transition-colors`}`} />
                <span className={`text-xs font-bold text-center ${link.isPrimary ? "text-white" : "text-[#002E5D]"}`}>
                  {link.label}
                </span>
              </Link>
            ) : (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-2 bg-white p-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all group"
              >
                <link.icon className={`w-8 h-8 ${link.color} ${link.hoverColor} transition-colors`} />
                <span className="text-xs font-bold text-[#002E5D] text-center">
                  {link.label}
                </span>
              </a>
            )
          ))}
        </div>
      </div>
    </section>
  );
}
