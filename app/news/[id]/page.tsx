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

const sampleJson = {
  success: true,
  data: {
    id: "1",
    title: "GAD Meeting on Strengthening Protection for Women and Children",
    slug: "gad-meeting-strengthening-protection-women-children",
    content: `The Gender and Development (GAD) Meeting focused on strengthening protection measures for women and children in disaster-prone areas. Key stakeholders from various municipalities gathered to discuss actionable strategies.

The meeting addressed the unique vulnerabilities faced by women and children during disasters and emergencies. Participants included representatives from the provincial government, PDRRMO, local GAD focal points, and civil society organizations.

## Key Objectives

- Review existing protection protocols for women and children
- Develop new guidelines for evacuation procedures
- Coordinate with local government units for resource allocation
- Establish communication channels for emergency alerts

## Outcomes

The meeting resulted in a comprehensive action plan that will be implemented over the next quarter. Key highlights include the establishment of women-friendly evacuation centers and the training of community volunteers on gender-sensitive disaster response.

PDRRMO reminds the public to stay vigilant and prepared. For more information, contact the PDRRMO office at (033) 328-7920.`,
    featured_image: "/gadMeeting.jpg",
    excerpt:
      "Key stakeholders gathered to discuss protection measures for women and children in disaster-prone areas during GAD Meeting.",
    status: "published",
    author_id: "admin",
    published_at: "2026-04-14T10:00:00Z",
    created_at: "2026-04-14T10:00:00Z",
  },
};

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

  const displayNews = sampleJson.data;

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
