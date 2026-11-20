import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '../_auth';
import { getVideoEmbed } from '@/lib/videoEmbed';

interface VideoUpdates {
  title?: string;
  video_url?: string;
  description?: string;
  is_active?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseVideoUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const videoUrl = value.trim();
  return getVideoEmbed(videoUrl) ? videoUrl : null;
}

export async function GET(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await client
    .from('pdrmo_videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Video list query failed:', error.message);
    return NextResponse.json({ success: false, error: 'Could not load videos' }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function POST(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
  if (!isRecord(body)) {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const videoUrl = parseVideoUrl(body.video_url);
  const description = body.description === undefined ? '' : body.description;
  const isActive = body.is_active === undefined ? true : body.is_active;

  if (!title) {
    return NextResponse.json({ success: false, error: 'A title is required' }, { status: 400 });
  }
  if (!videoUrl) {
    return NextResponse.json(
      { success: false, error: 'Enter a valid HTTPS YouTube or Google Drive video link' },
      { status: 400 },
    );
  }
  if (typeof description !== 'string') {
    return NextResponse.json({ success: false, error: 'Description must be text' }, { status: 400 });
  }
  if (typeof isActive !== 'boolean') {
    return NextResponse.json({ success: false, error: 'is_active must be a boolean' }, { status: 400 });
  }

  const { data, error } = await client
    .from('pdrmo_videos')
    .insert({
      title,
      video_url: videoUrl,
      description: description.trim(),
      is_active: isActive,
    })
    .select()
    .single();

  if (error) {
    console.error('Video creation failed:', error.message);
    return NextResponse.json({ success: false, error: 'Could not save the video' }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function PUT(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
  }
  if (!isRecord(body) || typeof body.id !== 'string' || !body.id) {
    return NextResponse.json({ success: false, error: 'A valid video ID is required' }, { status: 400 });
  }

  const updates: VideoUpdates = {};
  if ('title' in body) {
    if (typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json({ success: false, error: 'Title cannot be empty' }, { status: 400 });
    }
    updates.title = body.title.trim();
  }
  if ('video_url' in body) {
    const videoUrl = parseVideoUrl(body.video_url);
    if (!videoUrl) {
      return NextResponse.json(
        { success: false, error: 'Enter a valid HTTPS YouTube or Google Drive video link' },
        { status: 400 },
      );
    }
    updates.video_url = videoUrl;
  }
  if ('description' in body) {
    if (typeof body.description !== 'string') {
      return NextResponse.json({ success: false, error: 'Description must be text' }, { status: 400 });
    }
    updates.description = body.description.trim();
  }
  if ('is_active' in body) {
    if (typeof body.is_active !== 'boolean') {
      return NextResponse.json({ success: false, error: 'is_active must be a boolean' }, { status: 400 });
    }
    updates.is_active = body.is_active;
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ success: false, error: 'No video fields to update' }, { status: 400 });
  }

  const { data, error } = await client
    .from('pdrmo_videos')
    .update(updates)
    .eq('id', body.id)
    .select()
    .single();

  if (error) {
    console.error('Video update failed:', error.message);
    return NextResponse.json({ success: false, error: 'Could not update the video' }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function DELETE(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, error: 'A video ID is required' }, { status: 400 });
  }

  const { error } = await client.from('pdrmo_videos').delete().eq('id', id);
  if (error) {
    console.error('Video deletion failed:', error.message);
    return NextResponse.json({ success: false, error: 'Could not delete the video' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
