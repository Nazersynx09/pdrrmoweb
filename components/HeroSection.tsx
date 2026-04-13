import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, LocateIcon, ArrowRight, MapPin } from "lucide-react";

interface HeroSectionProps {
  phone: string;
  email: string;
  address: string;
}

export default function HeroSection({
  phone,
  email,
  address,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#001f45] md:pt-16 md:h-screen">
      <div className="absolute inset-0 bg-linear-to-br from-[#002E5D] via-[#002b5c] to-[#05122f]" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#F58220]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <div className="flex flex-col items-center text-center gap-8 lg:flex-row lg:items-center lg:text-left lg:justify-between">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
            <div className="shrink-0 flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 bg-white/5 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
              <Image
                src="/pdrrmoLogo.png"
                alt="PDRRMO Logo"
                width={400}
                height={400}
                className="object-contain w-full h-full"
              />
            </div>

            <div className="text-white">
              <p className="text-xs sm:text-sm uppercase tracking-[0.4em] text-orange-300 font-semibold mb-3">
                Iloilo Provincial Government
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-tight">
                Provincial Disaster Risk
                <span className="block text-[#F58220]">
                  Reduction & Management
                </span>
              </h1>
              <p className="mt-4 text-sm sm:text-base uppercase tracking-[0.3em] text-slate-300">
                Prepared. Resilient. Safe.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full lg:w-auto">
            <Link
              href="/emergency"
              className="flex items-center justify-center gap-3 bg-[#F58220] hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <Phone className="w-5 h-5" />
              <span>Emergency Hotline</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/resources"
              className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl border border-white/20 transition-all backdrop-blur-sm"
            >
              <MapPin className="w-5 h-5" />
              <span>Hazard Maps & Resources</span>
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 text-white shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-3 text-orange-200 mb-2">
              <Phone className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Hotline
              </span>
            </div>
            <p className="font-bold text-lg">{phone}</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 text-white shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-3 text-orange-200 mb-2">
              <Mail className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Email
              </span>
            </div>
            <p className="text-sm font-semibold break-all">{email}</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-5 text-white shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-3 text-orange-200 mb-2">
              <LocateIcon className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Location
              </span>
            </div>
            <p className="font-semibold text-sm">{address}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
