"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  User,
  ArrowRight,
} from "lucide-react";

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

export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null,
  );

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    async function fetchNews() {
      try {
        const id = resolvedParams?.id;
        const res = await fetch(`/api/content/news?slug=${id}`);
        const data = await res.json();

        if (data.success && data.data) {
          setNews(data.data);
        } else {
          setNews(null);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
        setNews(null);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [resolvedParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-16 bg-[#002E5D]" />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002E5D]" />
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-16 bg-[#002E5D]" />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">News Not Found</h2>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-[#F58220] font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  const displayNews = news;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-PH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderContent = (content: string) => {
    const paragraphs = content.split("\n\n");
    return paragraphs.map((para, index) => {
      if (para.startsWith("## ")) {
        return (
          <h2 key={index} className="text-xl font-bold text-gray-900 mt-8 mb-4">
            {para.replace("## ", "")}
          </h2>
        );
      }
      if (para.startsWith("- ")) {
        const items = para.split("\n").filter((item) => item.startsWith("- "));
        return (
          <ul
            key={index}
            className="list-disc list-inside space-y-2 my-4 text-gray-700"
          >
            {items.map((item, i) => (
              <li key={i} className="ml-4">
                {item.replace("- ", "")}
              </li>
            ))}
          </ul>
        );
      }
      if (para.match(/^\d+\.\s/)) {
        const items = para.split("\n").filter((item) => item.match(/^\d+\.\s/));
        return (
          <ol
            key={index}
            className="list-decimal list-inside space-y-2 my-4 text-gray-700"
          >
            {items.map((item, i) => (
              <li key={i} className="ml-4">
                {item.replace(/^\d+\.\s/, "")}
              </li>
            ))}
          </ol>
        );
      }
      return (
        <p key={index} className="text-gray-700 leading-relaxed my-4">
          {para}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16 bg-[#002E5D]" />

      <article className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#F58220] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to News
        </Link>

        <header className="mb-8">
          <span className="inline-block bg-[#002E5D]/10 text-[#002E5D] text-xs font-semibold px-3 py-1 rounded-full mb-4">
            News
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {displayNews.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(displayNews.published_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="capitalize">{displayNews.author_id}</span>
            </div>
            <button className="flex items-center gap-2 text-gray-500 hover:text-[#F58220] transition-colors ml-auto">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </header>

        {displayNews.featured_image && (
          <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
            <Image
              src={displayNews.featured_image}
              alt={displayNews.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <p className="text-lg text-gray-600 font-medium mb-8 pb-8 border-b border-gray-100">
            {displayNews.excerpt}
          </p>

          <div className="prose prose-lg max-w-none">
            {renderContent(displayNews.content)}
          </div>
        </div>

        <footer className="mt-8 pt-8 border-t border-gray-200">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-[#F58220] font-semibold hover:underline"
          >
            View All News <ArrowRight className="w-4 h-4" />
          </Link>
        </footer>
      </article>
    </div>
  );
}
