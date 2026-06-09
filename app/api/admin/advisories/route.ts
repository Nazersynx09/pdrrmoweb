import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '../_auth';
import {createClient} from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getAuthenticatedClient(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;
    const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );
  return supabase;
}

export async function GET(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await client
    .from('advisories')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { title, content, image, severity, valid_from, valid_until, is_active } = body;
  if (!title) return NextResponse.json({ success: false, error: 'Title required' }, { status: 400 });

  const { data, error } = await client.from('advisories').insert([{
    title,
    content: content || '',
    image: image || '',
    severity: severity || 'info',
    valid_from: valid_from || new Date().toISOString(),
    valid_until: valid_until || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: is_active ?? true,
  }]).select().single();

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function PUT(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

  const { data, error } = await client.from('advisories').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function DELETE(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

  const { error } = await client.from('advisories').delete().eq('id', id);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}