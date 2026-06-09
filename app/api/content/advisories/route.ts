import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { data, error } = await supabase
    .from('advisories')
    .select('*')
    .eq('is_active', true)
    .gt('valid_until', new Date().toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { title, description, valid_until } = body;

  if (!title || !description || !valid_until) {
    return NextResponse.json({ success: false, error: 'Title, description, and valid_until are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('advisories')
    .insert([
      {
        title,
        description,
        valid_until: new Date(valid_until).toISOString(),
        is_active: true
      }
    ])
    .select();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, title, description, valid_until, is_active } = body;

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (title) updates.title = title;
  if (description) updates.description = description;
  if (valid_until) updates.valid_until = new Date(valid_until).toISOString();
  if (typeof is_active === 'boolean') updates.is_active = is_active;

  const { data, error } = await supabase
    .from('advisories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('advisories')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
