import { NextResponse } from 'next/server';
import { supabase as supabaseAdmin } from '@/lib/supabaseClient';

// GET - Admin: all slides (active + inactive)
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('carousel_slides')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch carousel slides:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch carousel slides' },
      { status: 500 }
    );
  }
}

// POST - Admin: create slide
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, type, image, description, cta, cta_link, display_order, is_active } = body;

    if (!title || !image) {
      return NextResponse.json(
        { success: false, error: 'Title and image are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('carousel_slides')
      .insert({
        title,
        type: type || '',
        image,
        description: description || '',
        cta: cta || 'Learn More',
        cta_link: cta_link || '/',
        display_order: display_order ?? 1,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to create carousel slide:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create carousel slide' },
      { status: 500 }
    );
  }
}

// PUT - Admin: update slide
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('carousel_slides')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to update carousel slide:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update carousel slide' },
      { status: 500 }
    );
  }
}

// DELETE - Admin: remove slide
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('carousel_slides')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete carousel slide:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete carousel slide' },
      { status: 500 }
    );
  }
}