"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Activity, ArrowRight } from "lucide-react";

interface Issuance {
  text: string;
  href: string;
  date: string;
}

interface UpdatesSectionProps {
  issuances: Issuance[];
  activityImage?: string;
  activityDate?: string;
  activityTitle?: string;
  activityLink?: string;
}

const formatPhilippineTime = (date: Date) =>
  new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Manila",
  }).format(date);

export default function UpdatesSection({ 
  issuances,
  activityImage = "/gadMeeting.jpg",
  activityDate = "March 26, 2026",
  activityTitle = "GAD Meeting on Strengthening Protection for Women and Children",
  activityLink = "/programs-services"
}: UpdatesSectionProps) {
  const [phTime, setPhTime] = useState<string>(() =>
    formatPhilippineTime(new Date()),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPhTime(formatPhilippineTime(new Date()));
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-[#F58220] uppercase mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-[#F58220] block shrink-0" />
          Latest Updates
        </h2>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-[#002E5D] px-4 py-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Issuances & Advisories
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {issuances.map((issuance, i) => (
                <a
                  key={i}
                  href={issuance.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-[#F58220] hover:bg-orange-50 group transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#F58220] bg-orange-100 px-2 py-1 rounded">
                      {issuance.date}
                    </span>
                    <span className="text-sm text-[#002E5D] font-medium group-hover:text-[#F58220]">
                      {issuance.text}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#F58220]" />
                </a>
              ))}
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <Link href="/resources" className="text-sm font-bold text-[#002E5D] hover:text-[#F58220] flex items-center gap-1">
                View All Resources <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-md bg-white">
            <div className="relative h-100">
              <Image
                src={activityImage}
                alt="Recent Activities"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-xs font-semibold text-orange-300 uppercase">
                  {activityDate}
                </p>
                <p className="text-lg font-bold text-white">
                  {activityTitle}
                </p>
              </div>
            </div>
            <div className="p-4">
              <Link href={activityLink} className="text-sm font-bold text-[#002E5D] hover:text-[#F58220] flex items-center gap-1">
                View Activity <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <h2 className="text-xl sm:text-2xl font-black text-[#F58220] uppercase mb-6 flex items-center gap-2">
          <span className="w-2 h-7 bg-[#F58220] block shrink-0" />
          Live Updates
        </h2>
        
        <FacebookFeed phTime={phTime} />
      </div>
    </section>
  );
}

interface FacebookFeedProps {
  phTime: string;
}

function FacebookFeed({ phTime }: FacebookFeedProps) {
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 overflow-hidden shadow-md bg-white h-full">
      <div className="bg-[#002E5D] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-[#F58220] flex items-center justify-center">
            <svg className="w-5 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-bold">
              Operation Center PDRRMO Iloilo
            </p>
            <a
              href="https://www.facebook.com/Heman201"
              target="_blank"
              rel="noreferrer noopener"
              className="text-blue-300 text-xs hover:underline"
            >
              @Operation Center - PDRRMO ILOILO
            </a>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-300 text-xs font-semibold uppercase">
            Live
          </span>
        </div>
      </div>

      <div className="bg-[#F58220]/10 border-b border-[#F58220]/20 px-4 py-2 flex items-center gap-2">
        <span className="w-2 h-2 bg-[#F58220] rounded-full animate-pulse" />
        <p className="text-xs font-bold text-[#002E5D] uppercase tracking-wider">
          As of {phTime}
        </p>
      </div>

      <div className="relative flex justify-center bg-gray-50 p-3 min-h-652px w-full overflow-x-hidden">
        {!iframeLoaded && (
          <div className="absolute inset-0 flex flex-col gap-3 p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="h-2 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
                <div className="h-24 bg-gray-200 rounded-lg w-full" />
              </div>
            ))}
          </div>
        )}
        <iframe
          src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FHeman201&tabs=timeline&width=500&height=652&small_header=true&hide_cover=true&adapt_container_width=true&hide_header=true"
          width="500"
          height="652"
          className={`border-0 transition-opacity duration-500 w-full sm:w-500px ${
            iframeLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          scrolling="no"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          onLoad={() => setIframeLoaded(true)}
          title="PDRRMO Iloilo Facebook Feed"
        />
      </div>

      <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center justify-between mt-auto">
        <p className="text-xs text-gray-500">
          Follow for real-time updates
        </p>
        <a
          href="https://www.facebook.com/Heman201"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 bg-[#002E5D] hover:bg-[#F58220] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Follow
        </a>
      </div>
    </div>
  );
}