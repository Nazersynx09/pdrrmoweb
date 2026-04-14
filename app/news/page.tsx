"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronRight, Clock, ArrowLeft } from "lucide-react";

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
      href={`/news/${item.slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
    >
      <div className="relative h-48 bg-gray-100">
        {item.featured_image ? (
          <Image
            src={item.featured_image}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#002E5D]/10">
            <span className="text-4xl font-bold text-[#002E5D]/20">N</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Calendar className="w-3 h-3" />
          <span>{formattedDate}</span>
        </div>
        <h3 className="font-semibold text-gray-900 group-hover:text-[#F58220] transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.excerpt}</p>
      </div>
    </Link>
  );
}

function NewsSection({ title, items }: NewsSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
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
          setNews(publishedNews.slice(1));
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const categorizeByDate = (items: NewsItem[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    const todayItems: NewsItem[] = [];
    const thisWeekItems: NewsItem[] = [];
    const thisMonthItems: NewsItem[] = [];
    const olderItems: NewsItem[] = [];

    items.forEach((item) => {
      const itemDate = new Date(item.published_at);
      if (itemDate >= today) {
        todayItems.push(item);
      } else if (itemDate >= weekAgo) {
        thisWeekItems.push(item);
      } else if (itemDate >= monthAgo) {
        thisMonthItems.push(item);
      } else {
        olderItems.push(item);
      }
    });

    return { todayItems, thisWeekItems, thisMonthItems, olderItems };
  };

  const { todayItems, thisWeekItems, thisMonthItems, olderItems } = categorizeByDate(news);

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
      {/* NavbarPlaceholder */}
      <div className="h-16 bg-[#002E5D]" />

      {/* Hero/Splash Section */}
      {featuredNews ? (
        <div className="relative h-[50vh] min-h-[400px] bg-[#002E5D]">
          {featuredNews.featured_image && (
            <Image
              src={featuredNews.featured_image}
              alt={featuredNews.title}
              fill
              className="object-cover opacity-30"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#002E5D] via-[#002E5D]/70 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-end pb-12">
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 bg-[#F58220] text-white text-xs font-semibold px-3 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                Featured News
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl">
              {featuredNews.title}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mb-6 line-clamp-2">
              {featuredNews.excerpt}
            </p>
            <div className="flex items-center gap-4">
              <Link
                href={`/news/${featuredNews.slug}`}
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
        </div>
      ) : (
        <div className="h-[30vh] min-h-[250px] bg-[#002E5D] flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">News & Updates</h1>
            <p className="text-white/70">Stay updated with the latest news from PDRRMO Iloilo</p>
          </div>
        </div>
      )}

      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#F58220] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Latest News Cards */}
      {news.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Latest News</h2>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.slice(0, 3).map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* News Sections */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
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
          <>
            <NewsSection title="Today" items={todayItems} />
            <NewsSection title="This Week" items={thisWeekItems} />
            <NewsSection title="This Month" items={thisMonthItems} />
            <NewsSection title="Older News" items={olderItems} />
          </>
        )}
      </div>
    </div>
  );
}