import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { FaFacebookF } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#002E5D] text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-white/10 pb-10 mb-7">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex gap-3">
              <Image
                src="/ipgLogo.png"
                alt="Provincial Government Logo"
                width={48}
                height={48}
                className="w-12 h-12 bg-white rounded-lg p-1"
              />
              <Image
                src="/pdrrmoLogo.png"
                alt="PDRRMO Logo"
                width={48}
                height={48}
                className="w-12 h-12 bg-white rounded-lg p-1"
              />
            </div>
          </div>
          <p className="text-sm font-bold mb-2">
            Iloilo Provincial Disaster Risk Reduction and Management Office
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Building a disaster-resilient Province of Iloilo through proactive planning, 
            community engagement, and rapid response capabilities.
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="https://www.facebook.com/Heman201"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F58220] transition-colors"
            >
              <FaFacebookF className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase text-[#F58220] mb-4">Contact Us</h4>
          <div className="space-y-3 text-sm">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-slate-300" />
              3rd Floor, Left Wing, Iloilo Provincial Capitol, Bonifacio Drive, Iloilo City
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-300" />
              (033) 328-7920
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-300" />
              pdrrmo@iloilo.gov.ph
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-black uppercase text-[#F58220] mb-4">Quick Links</h4>
          <div className="space-y-2 text-sm">
            <Link href="/about-pdrrmo" className="block hover:text-[#F58220] transition-colors">
              About PDRRMO
            </Link>
            <Link href="/about-pdrrmc" className="block hover:text-[#F58220] transition-colors">
              About PDRRMC
            </Link>
            <Link href="/resources" className="block hover:text-[#F58220] transition-colors">
              Resources
            </Link>
            <Link href="/programs-services" className="block hover:text-[#F58220] transition-colors">
              Programs & Services
            </Link>
            <Link href="/emergency" className="block hover:text-[#F58220] transition-colors">
              Emergency Contacts
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400 font-bold uppercase">
        <p>© 2026 PDRRMO Iloilo. All Rights Reserved.</p>
        <p>Developed by: PDRRMO Research and Planning Intern</p>
      </div>
    </footer>
  );
}
