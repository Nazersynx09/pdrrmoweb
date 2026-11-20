import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdminClient';

const deviceCategories = ['mobile', 'tablet', 'desktop'] as const;
const eventTypes = ['page_view', 'file_download'] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPublicPagePath(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const isExcludedPath = (path: string) =>
    value === path || value.startsWith(`${path}/`);

  return (
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !isExcludedPath('/admin') &&
    !isExcludedPath('/login') &&
    !isExcludedPath('/api') &&
    value.length <= 512 &&
    !value.includes('?') &&
    !value.includes('#')
  );
}

function isTargetPath(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= 1024 &&
    !value.includes('?') &&
    !value.includes('#')
  );
}

function getRequestOrigins(request: NextRequest) {
  const origins = new Set([request.nextUrl.origin]);
  const forwardedHost = request.headers
    .get('x-forwarded-host')
    ?.split(',')[0]
    .trim();
  const host = forwardedHost || request.headers.get('host');
  const forwardedProtocol = request.headers
    .get('x-forwarded-proto')
    ?.split(',')[0]
    .trim();
  const protocol = (forwardedProtocol || request.nextUrl.protocol.slice(0, -1))
    .replace(/:$/, '')
    .toLowerCase();

  if (host && (protocol === 'http' || protocol === 'https')) {
    origins.add(`${protocol}://${host.toLowerCase()}`);
  }

  return origins;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && !getRequestOrigins(request).has(origin)) {
    return NextResponse.json({ success: false, error: 'Invalid origin' }, { status: 403 });
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

  const { eventType, pagePath } = body;
  if (
    typeof eventType !== 'string' ||
    !eventTypes.includes(eventType as (typeof eventTypes)[number]) ||
    !isPublicPagePath(pagePath)
  ) {
    return NextResponse.json({ success: false, error: 'Invalid analytics event' }, { status: 400 });
  }

  const event = {
    event_type: eventType,
    page_path: pagePath,
    target_path: null as string | null,
    referrer_domain: null as string | null,
    device_category: null as string | null,
  };

  if (eventType === 'page_view') {
    const { referrerDomain, deviceCategory } = body;
    if (
      (referrerDomain !== null &&
        (typeof referrerDomain !== 'string' || referrerDomain.length > 253 || /[/?#]/.test(referrerDomain))) ||
      typeof deviceCategory !== 'string' ||
      !deviceCategories.includes(deviceCategory as (typeof deviceCategories)[number])
    ) {
      return NextResponse.json({ success: false, error: 'Invalid page-view data' }, { status: 400 });
    }

    event.referrer_domain = referrerDomain;
    event.device_category = deviceCategory;
  } else {
    if (!isTargetPath(body.targetPath)) {
      return NextResponse.json({ success: false, error: 'Invalid download target' }, { status: 400 });
    }
    event.target_path = body.targetPath;
  }

  const { error } = await supabaseAdmin.from('website_analytics_events').insert(event);
  if (error) {
    console.error('Failed to record website analytics event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record analytics event' },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
