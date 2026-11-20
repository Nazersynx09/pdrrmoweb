"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronRight, Clock } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  excerpt: string;
  status: "draft" | "published" | "archived";
  author_id: string;
  published_at: string;
  created_at: string;
}

interface NewsSectionProps {
  title: string;
  items: NewsItem[];
}

function NewsCard({ item }: { item: NewsItem }) {
  const date = new Date(item.published_at);
  const formattedDate = date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/news/${item.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] bg-gray-100">
        {item.featured_image ? (
          <Image
            src={item.featured_image}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#002E5D]/10">
            <span className="text-4xl font-bold text-[#002E5D]/20">N</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Calendar className="w-3 h-3" />
          <span>{formattedDate}</span>
        </div>
        <h3 className="font-semibold text-gray-900 group-hover:text-[#F58220] transition-colors line-clamp-2">
          {item.title}
        </h3>
        {item.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-gray-600">{item.excerpt}</p>
        )}
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-semibold text-[#F58220]">
          Read story <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

function NewsSection({ title, items }: NewsSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-[#002E5D]">{title}</h2>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredNews, setFeaturedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/content/news");
        const data = await res.json();
        if (data.success && data.data) {
          const publishedNews = data.data;
          setFeaturedNews(publishedNews[0] || null);
          setNews(publishedNews);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const latestItems = featuredNews
    ? news.filter((item) => item.id !== featuredNews.id).slice(0, 3)
    : news.slice(0, 3);
  const latestIds = new Set([...(featuredNews ? [featuredNews.id] : []), ...latestItems.map((item) => item.id)]);
  const archivedNews = news.filter((item) => !latestIds.has(item.id));
  const olderPostsByMonth = new Map<string, NewsItem[]>();

  archivedNews.forEach((item) => {
    const date = new Date(item.published_at);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!olderPostsByMonth.has(monthKey)) {
      olderPostsByMonth.set(monthKey, []);
    }
    olderPostsByMonth.get(monthKey)?.push(item);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002E5D]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Featured story */}
      {featuredNews ? (
        <section className="relative min-h-[380px] overflow-hidden bg-[#002E5D] md:min-h-[420px]">
          {featuredNews.featured_image && (
            <Image
              src={featuredNews.featured_image}
              alt={featuredNews.title}
              fill
              sizes="100vw"
              className="object-cover opacity-30"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#002E5D] via-[#002E5D]/70 to-transparent" />
          <div className="relative mx-auto flex min-h-[380px] max-w-7xl flex-col justify-end px-4 py-10 md:min-h-[420px] sm:px-6 lg:px-8">
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 bg-[#F58220] text-white text-xs font-semibold px-3 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                Featured News
              </span>
            </div>
            <h1 className="mb-4 max-w-4xl text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
              {featuredNews.title}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mb-6 line-clamp-2">
              {featuredNews.excerpt}
            </p>
            <div className="flex items-center gap-4">
              <Link
                href={`/news/${featuredNews.id}`}
                className="inline-flex items-center gap-2 bg-[#F58220] text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Read More <ChevronRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Calendar className="w-4 h-4" />
                {new Date(featuredNews.published_at).toLocaleDateString("en-PH", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="min-h-[250px] bg-[#002E5D] flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">News & Updates</h1>
            <p className="text-white/70">Stay updated with the latest news from PDRRMO Iloilo</p>
          </div>
        </div>
      )}

      {/* Latest News Cards */}
      {latestItems.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#002E5D]">Latest News</h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestItems.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* News Sections */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {news.length === 0 && !featuredNews ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No News Yet</h3>
            <p className="text-gray-600 mb-6">Check back later for updates</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#F58220] font-semibold hover:underline"
            >
              Return to Home <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          olderPostsByMonth.size > 0 && (
            <>
              <div className="mb-6 flex items-center gap-3">
                <h2 className="text-xl font-bold text-[#002E5D]">Older Posts</h2>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              {Array.from(olderPostsByMonth.entries()).map(([monthKey, items]) => {
                const [year, month] = monthKey.split("-").map(Number);
                const monthLabel = new Date(year, month - 1, 1).toLocaleDateString("en-PH", {
                  month: "long",
                  year: "numeric",
                });

                return (
                  <NewsSection
                    key={monthKey}
                    title={monthLabel}
                    items={items}
                  />
                );
              })}
            </>
          )
        )}
      </div>
    </div>
  );
}