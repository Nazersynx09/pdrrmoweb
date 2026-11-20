export type VideoProvider = 'youtube' | 'google-drive';

export interface VideoEmbed {
  provider: VideoProvider;
  url: string;
}

const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const DRIVE_FILE_ID_PATTERN = /^[A-Za-z0-9_-]+$/;

export function getVideoEmbed(source: string): VideoEmbed | null {
  let url: URL;
  try {
    url = new URL(source);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:') return null;

  const hostname = url.hostname.toLowerCase();
  if (hostname === 'drive.google.com') {
    const filePathMatch = url.pathname.match(/^\/file\/d\/([^/]+)/);
    const supportedPath = filePathMatch || ['/open', '/uc'].includes(url.pathname);
    const fileId = filePathMatch?.[1] ?? url.searchParams.get('id');

    if (supportedPath && fileId && DRIVE_FILE_ID_PATTERN.test(fileId)) {
      return {
        provider: 'google-drive',
        url: `https://drive.google.com/file/d/${fileId}/preview`,
      };
    }

    return null;
  }

  const youtubeHosts = new Set([
    'youtu.be',
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'youtube-nocookie.com',
    'www.youtube-nocookie.com',
  ]);
  if (!youtubeHosts.has(hostname)) return null;

  const videoId =
    hostname === 'youtu.be'
      ? url.pathname.split('/').filter(Boolean)[0]
      : url.pathname === '/watch'
        ? url.searchParams.get('v')
        : url.pathname.match(/^\/(?:embed|live|shorts)\/([^/]+)/)?.[1];

  if (!videoId || !YOUTUBE_ID_PATTERN.test(videoId)) return null;

  return {
    provider: 'youtube',
    url: `https://www.youtube-nocookie.com/embed/${videoId}`,
  };
}
