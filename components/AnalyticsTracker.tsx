'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const downloadableExtensions = /\.(pdf|docx?|xlsx?|pptx?|csv|zip|jpe?g|png|gif|webp|tiff?)$/i;

function getDeviceCategory() {
  if (window.innerWidth < 768) return 'mobile';
  if (window.innerWidth < 1024) return 'tablet';
  return 'desktop';
}

function getReferrerDomain() {
  if (!document.referrer) return null;

  const referrer = new URL(document.referrer);
  return referrer.origin === window.location.origin ? null : referrer.hostname;
}

function recordEvent(event: Record<string, string | null>) {
  void fetch('/api/analytics/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
    keepalive: true,
  })
    .then((response) => {
      if (!response.ok) console.error('Failed to record website analytics event');
    })
    .catch((error: unknown) => {
      console.error('Failed to record website analytics event:', error);
    });
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (
      pathname === '/admin' ||
      pathname.startsWith('/admin/') ||
      pathname === '/login' ||
      pathname.startsWith('/login/') ||
      pathname === '/api' ||
      pathname.startsWith('/api/')
    ) {
      lastTrackedPath.current = null;
      return;
    }
    if (lastTrackedPath.current === pathname) {
      return;
    }

    lastTrackedPath.current = pathname;
    recordEvent({
      eventType: 'page_view',
      pagePath: pathname,
      referrerDomain: getReferrerDomain(),
      deviceCategory: getDeviceCategory(),
    });
  }, [pathname]);

  useEffect(() => {
    if (
      !pathname ||
      pathname === '/admin' ||
      pathname.startsWith('/admin/') ||
      pathname === '/login' ||
      pathname.startsWith('/login/') ||
      pathname === '/api' ||
      pathname.startsWith('/api/')
    ) {
      return;
    }

    const trackFileDownload = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a');
      if (!link) return;

      const targetUrl = new URL(link.href, window.location.origin);
      const linkLabel = `${link.getAttribute('aria-label') || ''} ${link.textContent || ''}`;
      const isDownload =
        link.hasAttribute('download') ||
        link.hasAttribute('data-analytics-download') ||
        /\bdownload\b/i.test(linkLabel) ||
        downloadableExtensions.test(targetUrl.pathname);
      if (!isDownload || !['http:', 'https:'].includes(targetUrl.protocol)) return;

      const targetPath =
        targetUrl.origin === window.location.origin
          ? targetUrl.pathname
          : `${targetUrl.hostname}${targetUrl.pathname}`;

      recordEvent({
        eventType: 'file_download',
        pagePath: window.location.pathname,
        targetPath,
      });
    };

    document.addEventListener('click', trackFileDownload);
    return () => document.removeEventListener('click', trackFileDownload);
  }, [pathname]);

  return null;
}
