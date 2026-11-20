import { supabase } from './supabaseClient';

export const IMAGE_COMPRESSION_THRESHOLD_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_UPLOAD_BYTES = 500 * 1024 * 1024;

const tinifySupportedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function uploadFile(file: File, bucket: string): Promise<string | null> {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    console.error('Upload error:', sessionError?.message ?? 'No authenticated session');
    return null;
  }

  try {
    if (file.type.startsWith('image/') && file.size > IMAGE_COMPRESSION_THRESHOLD_BYTES) {
      if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
        console.error("Upload error: Image exceeds TinyPNG's 500 MB limit");
        return null;
      }
      if (!tinifySupportedTypes.has(file.type)) {
        console.error('Upload error: Images over 5 MB must be JPG, PNG, or WebP');
        return null;
      }

      const formData = new FormData();
      formData.append('bucket', bucket);
      formData.append('file', file);

      const response = await fetch('/api/admin/upload/compress', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      });
      const result = await response.json();

      if (!response.ok || typeof result.data?.publicUrl !== 'string') {
        console.error('Image compression error:', result.error ?? `Request failed with status ${response.status}`);
        return null;
      }

      return result.data.publicUrl;
    }

    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bucket, contentType: file.type, fileSize: file.size }),
    });
    const result = await response.json();

    if (!response.ok || typeof result.data?.path !== 'string' || typeof result.data?.token !== 'string') {
      console.error('Upload error:', result.error ?? `Request failed with status ${response.status}`);
      return null;
    }

    const { error } = await supabase.storage.from(bucket).uploadToSignedUrl(
      result.data.path,
      result.data.token,
      file,
      { cacheControl: '3600', contentType: file.type, upsert: false },
    );

    if (error) {
      console.error('Upload error:', error.message);
      return null;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(result.data.path);
    return data.publicUrl;
  } catch (error) {
    console.error('Upload error:', error instanceof Error ? error.message : 'Request failed');
    return null;
  }
}