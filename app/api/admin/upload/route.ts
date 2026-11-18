import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '../_auth';

const bucketRules: Record<string, { maxFileSize: number; extensions: Record<string, string> }> = {
  issuances: {
    maxFileSize: 10 * 1024 * 1024,
    extensions: {
      'application/pdf': 'pdf',
      'image/jpeg': 'jpeg',
      'image/png': 'png',
      'image/gif': 'gif',
    },
  },
  'news-images': {
    maxFileSize: 5 * 1024 * 1024,
    extensions: {
      'image/jpeg': 'jpeg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
    },
  },
};

export async function POST(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid upload request' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ success: false, error: 'Invalid upload request' }, { status: 400 });
  }

  const { bucket, contentType, fileSize } = body as Record<string, unknown>;
  if (
    typeof bucket !== 'string' ||
    !Object.hasOwn(bucketRules, bucket) ||
    typeof contentType !== 'string' ||
    typeof fileSize !== 'number' ||
    !Number.isInteger(fileSize) ||
    fileSize <= 0
  ) {
    return NextResponse.json({ success: false, error: 'A valid bucket and file are required' }, { status: 400 });
  }

  const rules = bucketRules[bucket];
  const extension = rules.extensions[contentType];
  if (!extension) {
    return NextResponse.json({ success: false, error: 'Unsupported file type' }, { status: 415 });
  }
  if (fileSize > rules.maxFileSize) {
    return NextResponse.json({ success: false, error: 'File exceeds the size limit' }, { status: 413 });
  }

  const path = `${crypto.randomUUID()}.${extension}`;
  const { data, error } = await client.storage.from(bucket).createSignedUploadUrl(path);

  if (error) {
    console.error('Storage upload authorization error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: { path: data.path, token: data.token } });
}
