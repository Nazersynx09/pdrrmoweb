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
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { title, category, file_url, file_type, description, is_active } = body;
  if (!title) return NextResponse.json({ success: false, error: 'Title required' }, { status: 400 });

  const { data, error } = await client.from('resources').insert([{
    title,
    category: category || 'other',
    file_url: file_url || '',
    file_type: file_type || 'pdf',
    description: description || '',
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

  const { data, error } = await client.from('resources').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function DELETE(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

  const { error } = await client.from('resources').delete().eq('id', id);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}