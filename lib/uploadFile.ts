import { supabase } from './supabaseClient';

export async function uploadFile(file: File, bucket: string): Promise<string | null> {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    console.error('Upload error:', sessionError?.message ?? 'No authenticated session');
    return null;
  }

  try {
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