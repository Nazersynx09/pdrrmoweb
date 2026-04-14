import { NextResponse } from 'next/server';

interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  published_at: string;
  created_at: string;
}

let newsItems: News[] = [
  {
    id: '1',
    title: 'GAD Meeting on Strengthening Protection for Women and Children',
    slug: 'gad-meeting-strengthening-protection-women-children',
    content: 'The Gender and Development (GAD) Meeting focused on strengthening protection measures for women and children in disaster-prone areas. Key stakeholders from various municipalities gathered to discuss actionable strategies.',
    featured_image: '/gadMeeting.jpg',
    excerpt: 'Key stakeholders gathered to discuss protection measures.',
    status: 'published',
    author_id: 'admin',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'PDRRMO Conducts Emergency Response Training for All Personnel',
    slug: 'pdrrmo-conduct-emergency-response-training',
    content: 'A comprehensive emergency response training was conducted for all PDRRMO personnel to enhance disaster response capabilities.',
    featured_image: '/training.jpg',
    excerpt: 'Personnel undergo intensive emergency response training.',
    status: 'published',
    author_id: 'admin',
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Flood Preparedness Seminar for Baranggay Officials',
    slug: 'flood-preparedness-seminar-baranggay-officials',
    content: 'Seminar focused on flood preparedness and evacuation protocols for baranggay officials across the province.',
    featured_image: '/seminar.jpg',
    excerpt: 'Baranggay officials learn flood preparedness strategies.',
    status: 'published',
    author_id: 'admin',
    published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Typhoon Preparedness Guidelines Updated for 2026',
    slug: 'typhoon-preparedness-guidelines-2026',
    content: 'Updated guidelines for typhoon preparedness have been released to ensure public safety during the typhoon season.',
    featured_image: '/typhoon.jpg',
    excerpt: 'New preparedness guidelines released for typhoon season.',
    status: 'published',
    author_id: 'admin',
    published_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    title: 'Earthquake Drill Conducted in Provincial Capitol',
    slug: 'earthquake-drill-provincial-capitol',
    content: 'A province-wide earthquake drill was conducted to test emergency response and evacuation procedures.',
    featured_image: '/earthquake.jpg',
    excerpt: 'Province-wide earthquake drill tests emergency response.',
    status: 'published',
    author_id: 'admin',
    published_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

// GET - Public: List published news or fetch single by slug
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const newsItem = newsItems.find(n => n.slug === slug && n.status === 'published');
      if (!newsItem) {
        return NextResponse.json(
          { success: false, error: 'News not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        success: true,
        data: newsItem
      });
    }

    const publishedNews = newsItems
      .filter(n => n.status === 'published')
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

    return NextResponse.json({
      success: true,
      data: publishedNews
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// POST - Admin: Create news
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, featured_image, excerpt, status } = body;

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);
    const newNews: News = {
      id: Date.now().toString(),
      title,
      slug,
      content,
      featured_image: featured_image || '',
      excerpt: excerpt || content.substring(0, 150),
      status: status || 'draft',
      author_id: 'admin',
      published_at: status === 'published' ? new Date().toISOString() : '',
      created_at: new Date().toISOString(),
    };

    newsItems.push(newNews);

    return NextResponse.json({
      success: true,
      data: newNews
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create news' },
      { status: 500 }
    );
  }
}