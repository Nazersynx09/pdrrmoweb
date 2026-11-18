import{NextResponse} from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('issuances')
    .select('id, title, type, number, date_issued, file_url:File, description, is_active, created_at')
    .eq('is_active', true)
    .order('date_issued', { ascending: false });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, content, featured_image, excerpt, status } = body;

  if (!title || !content) {
    return NextResponse.json({ success: false, error: 'Title and content required' }, { status: 400 });
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 50);

  const { data, error } = await supabase.from('issuances').insert([{
    title, slug, content,
    featured_image: featured_image || '',
    excerpt: excerpt || content.substring(0, 150),
    status: status || 'draft',
    published_at: status === 'published' ? new Date().toISOString() : null,
  }]).select('id, title, slug, excerpt, published_at').single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, title, content, featured_image, excerpt, status } = body; 

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
  }

  const updates: {
    title?: string;
    slug?: string;
    content?: string;
    featured_image?: string;
    excerpt?: string;
    status?: string;
    published_at?: string;
  } = {};
  if (title) {
    updates.title = title;
    updates.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 50);
  }

  if (content) updates.content = content;
  if (featured_image) updates.featured_image = featured_image;
  if (excerpt) updates.excerpt = excerpt;
  if (status) {
    updates.status = status;
    if (status === 'published' && !updates.published_at) {
      updates.published_at = new Date().toISOString();
    }
  }

  const { data, error } = await supabase.from('issuances').update(updates).eq('id', id).select('id, title, slug, excerpt, published_at').single();
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
  }

  const { data, error } = await supabase.from('issuances').delete().eq('id', id).select().single();
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}
