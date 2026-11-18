import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '../_auth';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message;
  }
  return 'Unexpected carousel API error';
}

function isValidCtaLink(value: unknown): value is string {
  if (typeof value !== 'string') return false;

  const link = value.trim();
  if (link.startsWith('/') && !link.startsWith('//')) return true;

  try {
    return new URL(link).protocol === 'https:';
  } catch {
    return false;
  }
}

// GET - Admin: all slides (active + inactive)
export async function GET(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await client
      .from('carousel_slides')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to fetch carousel slides:', error);
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// POST - Admin: create slide
export async function POST(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, type, image, description, cta, cta_link, display_order, is_active } = body;

    if (!title || !image || !isValidCtaLink(cta_link)) {
      return NextResponse.json(
        { success: false, error: 'Title, image, and a valid button link are required' },
        { status: 400 }
      );
    }

    const { data, error } = await client
      .from('carousel_slides')
      .insert({
        title,
        type: type || '',
        image,
        description: description || '',
        cta: cta || 'Learn More',
        cta_link: cta_link.trim(),
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
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// PUT - Admin: update slide
export async function PUT(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    if ('cta_link' in updates) {
      if (!isValidCtaLink(updates.cta_link)) {
        return NextResponse.json(
          { success: false, error: 'Button link must be an HTTPS URL or a site path' },
          { status: 400 }
        );
      }
      updates.cta_link = updates.cta_link.trim();
    }

    const { data, error } = await client
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
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// DELETE - Admin: remove slide
export async function DELETE(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
    }

    const { error } = await client
      .from('carousel_slides')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete carousel slide:', error);
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}