import {NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const slug = searchParams.get('slug');
  if (slug) {
    const {data, error} = await supabase
      .from('resources')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    if (error || !data) {
      return NextResponse.json({success: false, error: 'Not found'}, {status: 404});
    }

    return NextResponse.json({success: true, data});
  }

  const {data, error} = await supabase
    .from('resources')
    .select('*')
    .eq('status', 'published')
    .order('published_at', {ascending: false});

  if (error) return NextResponse.json({success: false, error: error.message}, {status: 500});
  return NextResponse.json({success: true, data});
}

export async function POST(request: Request) {
  const body = await request.json();
  const {title, content, featured_image, excerpt, status} = body;
  if (!title || !content) {
    return NextResponse.json({success: false, error: 'Title and content required'}, {status: 400});
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 50);

  const {data, error} = await supabase.from('resources').insert([{
    title, slug, content,
    featured_image: featured_image || '',
    excerpt: excerpt || content.substring(0, 150),
    status: status || 'draft',
    published_at: status === 'published' ? new Date().toISOString() : null,
  }]).select().single();

  if (error) return NextResponse.json({success: false, error: error.message}, {status: 500});
  return NextResponse.json({success: true, data});
}

export async function PUT(request: Request) {
  const body = await request.json();
  const {id, title, content, featured_image, excerpt, status} = body;
  if (!id || !title || !content) {
    return NextResponse.json({success: false, error: 'ID, title and content required'}, {status: 400});
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 50);

  const updates: any = {title, slug, content, featured_image, excerpt, status};

  if (status === 'published' && !updates.published_at) {
    updates.published_at = new Date().toISOString();
  }

  const {data, error} = await supabase.from('resources').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({success: false, error: error.message}, {status: 500});
  return NextResponse.json({success: true, data});
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const {id} = body;
  if (!id) {
    return NextResponse.json({success: false, error: 'ID required'}, {status: 400});
  }

  const {data, error} = await supabase.from('resources').delete().eq('id', id).select().single();
  if (error) return NextResponse.json({success: false, error: error.message}, {status: 500});
  return NextResponse.json({success: true, data});
}

