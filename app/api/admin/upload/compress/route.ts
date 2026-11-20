import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '../../_auth';

export const runtime = 'nodejs';

const TARGET_SIZE = 5 * 1024 * 1024;
const MAX_UPLOAD_SIZE = 500 * 1024 * 1024;
const MAX_RESIZE_ATTEMPTS = 5;

const allowedTypes: Record<string, Record<string, string>> = {
  issuances: {
    'image/jpeg': 'jpeg',
    'image/png': 'png',
  },
  'news-images': {
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/webp': 'webp',
  },
};

function jsonError(error: string, status: number) {
  return NextResponse.json({ success: false, error }, { status });
}

function tinyPngHeaders(apiKey: string, contentType?: string) {
  return {
    Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
    ...(contentType ? { 'Content-Type': contentType } : {}),
  };
}

export async function POST(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) return jsonError('Unauthorized', 401);

  const apiKey = process.env.TINIFY_API_KEY;
  if (!apiKey) {
    return jsonError('Set TINIFY_API_KEY in the server environment and restart the app', 503);
  }

  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_UPLOAD_SIZE + 64 * 1024) {
    return jsonError("Image exceeds TinyPNG's 500 MB limit", 413);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError('Invalid image upload request', 400);
  }

  const bucket = formData.get('bucket');
  const file = formData.get('file');
  if (typeof bucket !== 'string' || !Object.hasOwn(allowedTypes, bucket) || !(file instanceof File)) {
    return jsonError('A valid image and storage bucket are required', 400);
  }
  if (file.size <= TARGET_SIZE) {
    return jsonError('Only images larger than 5 MB need compression', 400);
  }
  if (file.size > MAX_UPLOAD_SIZE) {
    return jsonError("Image exceeds TinyPNG's 500 MB limit", 413);
  }

  const extension = allowedTypes[bucket][file.type];
  if (!extension) {
    return jsonError('Images over 5 MB must be JPG, PNG, or WebP', 415);
  }

  try {
    const authorization = tinyPngHeaders(apiKey);
    const compressionResponse = await fetch('https://api.tinify.com/shrink', {
      method: 'POST',
      headers: { ...authorization, 'Content-Type': file.type },
      body: await file.arrayBuffer(),
      cache: 'no-store',
    });

    if (!compressionResponse.ok) {
      console.error('TinyPNG compression request failed:', compressionResponse.status);
      return jsonError('TinyPNG could not compress the image. Please try again later.', 502);
    }

    const outputUrl = compressionResponse.headers.get('location');
    const metadata: unknown = await compressionResponse.json();
    if (
      !outputUrl?.startsWith('https://api.tinify.com/output/') ||
      typeof metadata !== 'object' ||
      metadata === null ||
      !('output' in metadata)
    ) {
      console.error('TinyPNG returned an invalid compression response');
      return jsonError('TinyPNG returned an invalid compression response', 502);
    }

    const output = metadata.output;
    if (
      typeof output !== 'object' ||
      output === null ||
      !('width' in output) ||
      !('height' in output) ||
      typeof output.width !== 'number' ||
      typeof output.height !== 'number' ||
      output.width < 1 ||
      output.height < 1
    ) {
      console.error('TinyPNG returned invalid image dimensions');
      return jsonError('TinyPNG returned invalid image details', 502);
    }

    const optimizedResponse = await fetch(outputUrl, {
      headers: authorization,
      cache: 'no-store',
    });
    if (!optimizedResponse.ok) {
      console.error('TinyPNG image download failed:', optimizedResponse.status);
      return jsonError('Could not download the compressed image from TinyPNG', 502);
    }

    let optimizedBytes = new Uint8Array(await optimizedResponse.arrayBuffer());
    let outputType = optimizedResponse.headers.get('content-type')?.split(';')[0] ?? file.type;
    let width = Number(optimizedResponse.headers.get('image-width')) || output.width;
    let height = Number(optimizedResponse.headers.get('image-height')) || output.height;
    let resizeAttempts = 0;

    while (optimizedBytes.byteLength > TARGET_SIZE && resizeAttempts < MAX_RESIZE_ATTEMPTS) {
      const longestDimension = Math.max(width, height);
      const scale = Math.min(0.9, Math.sqrt(TARGET_SIZE / optimizedBytes.byteLength) * 0.95);
      const targetDimension = Math.max(1, Math.floor(longestDimension * scale));
      if (targetDimension >= longestDimension) break;

      const resizeResponse = await fetch(outputUrl, {
        method: 'POST',
        headers: tinyPngHeaders(apiKey, 'application/json'),
        body: JSON.stringify({
          resize: {
            method: 'scale',
            [width >= height ? 'width' : 'height']: targetDimension,
          },
        }),
        cache: 'no-store',
      });

      if (!resizeResponse.ok) {
        console.error('TinyPNG image resize failed:', resizeResponse.status);
        return jsonError('TinyPNG could not reduce the image below 5 MB', 422);
      }

      optimizedBytes = new Uint8Array(await resizeResponse.arrayBuffer());
      outputType = resizeResponse.headers.get('content-type')?.split(';')[0] ?? outputType;
      width = Number(resizeResponse.headers.get('image-width')) || targetDimension;
      height = Number(resizeResponse.headers.get('image-height')) || targetDimension;
      resizeAttempts += 1;
    }

    if (optimizedBytes.byteLength > TARGET_SIZE) {
      return jsonError('Image could not be reduced below 5 MB. Try a smaller image.', 422);
    }

    const outputExtension = allowedTypes[bucket][outputType];
    if (!outputExtension) {
      console.error('TinyPNG returned an unsupported image type:', outputType);
      return jsonError('TinyPNG returned an unsupported image type', 502);
    }

    const path = `${crypto.randomUUID()}.${outputExtension}`;
    const { data, error } = await client.storage.from(bucket).upload(path, optimizedBytes, {
      cacheControl: '3600',
      contentType: outputType,
      upsert: false,
    });

    if (error) {
      console.error('Compressed image storage upload failed:', error.message);
      return jsonError('Could not save the compressed image', 500);
    }

    const { data: publicUrl } = client.storage.from(bucket).getPublicUrl(data.path);
    return NextResponse.json({ success: true, data: { publicUrl: publicUrl.publicUrl } });
  } catch (error) {
    console.error('Image compression upload failed:', error instanceof Error ? error.message : 'Unknown error');
    return jsonError('Image compression failed. Please try again.', 502);
  }
}
