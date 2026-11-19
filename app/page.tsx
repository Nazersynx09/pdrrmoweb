import { Suspense } from "react";
import HomeAlertBanner from "@/components/HomeAlertBanner";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import QuickActions from "@/components/QuickActions";
import HomeCarousel from "@/components/HomeCarousel";
import HomeUpdates from "@/components/HomeUpdates";
import UpdatesSection from "@/components/UpdatesSection";
import QuickLinks from "@/components/QuickLinks";
import Footer from "@/components/Footer";

export const revalidate = 60;

const contactInfo = {
  phone1: "(033) 328-7920",
  phone2: "(+63) 920-946-8233",
  email1: "pdrrmo@iloilo.gov.ph",
  email2: "pdrrmo_iloilo@yahoo.com",
  address1: "Iloilo Provincial Capitol, Bonifacio Drive, Iloilo City",
  address2: "Magsaysay Village, Lapaz, Iloilo",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      <Suspense
        fallback={
          <div className="bg-gray-400 px-4 py-2 text-white">
            <p className="text-center text-sm">Loading alerts...</p>
          </div>
        }
      >
        <HomeAlertBanner />
      </Suspense>
      <HeroSection
        phone1={contactInfo.phone1}
        phone2={contactInfo.phone2}
        email1={contactInfo.email1}
        email2={contactInfo.email2}
        address1={contactInfo.address1}
        address2={contactInfo.address2}
      />
      <StatsSection />
      <QuickActions />
      <Suspense
        fallback={
          <section className="bg-gray-50 py-8 sm:py-12">
            <div className="mx-auto max-w-6xl px-3 sm:px-6">
              <div className="aspect-[4/3] animate-pulse rounded-2xl bg-gray-200 sm:aspect-[16/7] lg:aspect-[21/9]" />
            </div>
          </section>
        }
      >
        <HomeCarousel />
      </Suspense>
      <Suspense
        fallback={
          <UpdatesSection
            issuances={[]}
            issuancesLoading
            latestNews={null}
            newsLoading
          />
        }
      >
        <HomeUpdates />
      </Suspense>
      <QuickLinks />
      <Footer />
    </div>
  );
}
