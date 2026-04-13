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
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

// GET - Public: List published news
export async function GET() {
  try {
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