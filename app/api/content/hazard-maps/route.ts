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
      .from('hazard_maps')
      .select('id, title, slug, description, map_url, created_at')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return NextResponse.json({success: false, error: 'Not found'}, {status: 404});
    }
    return NextResponse.json({success: true, data});
  }

  const {data, error} = await supabase
    .from('hazard_maps')
    .select('id, title, slug, created_at')
    .order('created_at', {ascending: false});

  if (error) {
    return NextResponse.json({success: false, error: error.message}, {status: 500});
  }

  return NextResponse.json({success: true, data});
}

export async function POST(request: Request) {
  const body = await request.json();
  const {title, description, map_url} = body;

  if (!title || !description || !map_url) {
    return NextResponse.json({success: false, error: 'Title, description, and map URL are required'}, {status: 400});
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 50);

  const {data, error} = await supabase.from('hazard_maps').insert([{
    title, slug, description, map_url
  }]).select('id, title, slug, created_at').single();

  if (error) {
    return NextResponse.json({success: false, error: error.message}, {status: 500});
  }

  return NextResponse.json({success: true, data});
}

export async function PUT(request: Request) {
  const body = await request.json();
  const {id, title, description, map_url} = body;

  if (!id) {
    return NextResponse.json({success: false, error: 'ID is required'}, {status: 400});
  }

  const updates: any = {};
  if (title) {
    updates.title = title;
    updates.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 50);
  }
  if (description) updates.description = description;
  if (map_url) updates.map_url = map_url;

  const {data, error} = await supabase.from('hazard_maps').update(updates).eq('id', id).select('id, title, slug, created_at').single();
  if (error) {
    return NextResponse.json({success: false, error: error.message}, {status: 500});
  }

  return NextResponse.json({success: true, data});
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const {id} = body;

  if (!id) {
    return NextResponse.json({success: false, error: 'ID is required'}, {status: 400});
  }
  const {data, error} = await supabase.from('hazard_maps').delete().eq('id', id).select('id, title, slug, created_at').single();
  if (error) {
    return NextResponse.json({success: false, error: error.message}, {status: 500});
  }
  return NextResponse.json({success: true, data});
}

