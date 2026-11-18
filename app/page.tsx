"use client";

import { useEffect, useState } from "react";
import AlertBanner from "@/components/AlertBanner";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import QuickActions from "@/components/QuickActions";
import Carousel from "@/components/Carousel";
import UpdatesSection from "@/components/UpdatesSection";
import QuickLinks from "@/components/QuickLinks";
import Footer from "@/components/Footer";

interface Issuance {
  id: string;
  title: string;
  number: string;
  date_issued: string | null;
  file_url: string;
}

interface IssuancesResponse {
  success: boolean;
  data?: Issuance[];
  error?: string;
}

interface DisplayIssuance {
  id: string;
  text: string;
  href: string;
  date: string;
}

interface NewsItem {
  id: string;
  title: string;
  featured_image: string;
  excerpt: string;
  published_at: string;
}

interface NewsResponse {
  success: boolean;
  data?: NewsItem[];
  error?: string;
}

const contactInfo = {
  phone1: "(033) 328-7920",
  phone2: "(+63) 920-946-8233",
  email: "pdrrmo@iloilo.gov.ph",
  address1: "Iloilo Provincial Capitol, Bonifacio Drive, Iloilo City",
  address2: "Magsaysay Village, Lapaz, Iloilo",
};

export default function Home() {
  const [issuances, setIssuances] = useState<DisplayIssuance[]>([]);
  const [issuancesLoading, setIssuancesLoading] = useState(true);
  const [issuancesError, setIssuancesError] = useState<string | null>(null);
  const [latestNews, setLatestNews] = useState<NewsItem | null>(null);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchIssuances() {
      try {
        const response = await fetch("/api/content/issuances", {
          signal: controller.signal,
          cache: "no-store",
        });
        const result = (await response.json()) as IssuancesResponse;
        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || "Failed to load issuances.");
        }

        setIssuances(
          result.data.map((issuance) => ({
            id: issuance.id,
            text: issuance.number
              ? `${issuance.title} — ${issuance.number}`
              : issuance.title,
            href: issuance.file_url,
            date: issuance.date_issued
              ? new Date(issuance.date_issued).toLocaleDateString("en-PH", {
                  month: "short",
                  year: "numeric",
                  timeZone: "Asia/Manila",
                })
              : "Date not set",
          })),
        );
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setIssuancesError(
          error instanceof Error ? error.message : "Failed to load issuances.",
        );
      } finally {
        if (!controller.signal.aborted) setIssuancesLoading(false);
      }
    }

    fetchIssuances();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchLatestNews() {
      try {
        const response = await fetch("/api/content/news", {
          signal: controller.signal,
          cache: "no-store",
        });
        const result = (await response.json()) as NewsResponse;
        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || "Failed to load latest news.");
        }

        setLatestNews(result.data[0] ?? null);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setNewsError(
          error instanceof Error ? error.message : "Failed to load latest news.",
        );
      } finally {
        if (!controller.signal.aborted) setNewsLoading(false);
      }
    }

    fetchLatestNews();
    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      <AlertBanner />
      <HeroSection
        phone1={contactInfo.phone1}
        phone2={contactInfo.phone2}
        email={contactInfo.email}
        address1={contactInfo.address1}
        address2={contactInfo.address2}
      />
      <StatsSection />
      <QuickActions />
      <Carousel />
      <UpdatesSection
        issuances={issuances}
        issuancesLoading={issuancesLoading}
        issuancesError={issuancesError}
        latestNews={latestNews}
        newsLoading={newsLoading}
        newsError={newsError}
      />
      <QuickLinks />
      <Footer />
    </div>
  );
}
