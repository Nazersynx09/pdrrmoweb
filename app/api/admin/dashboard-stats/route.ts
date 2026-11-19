import { NextRequest, NextResponse } from 'next/server';
import { getAdminClient } from '../_auth';

export async function GET(request: NextRequest) {
  const client = await getAdminClient(request);
  if (!client) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 },
    );
  }

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [
    [news, advisories, hazardMaps, resources, issuances, carouselSlides],
    { data: analytics, error: analyticsError },
  ] = await Promise.all([
    Promise.all([
      client.from('news').select('id', { count: 'exact', head: true }),
      client
        .from('advisories')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true),
      client.from('hazard_maps').select('id', { count: 'exact', head: true }),
      client.from('resources').select('id', { count: 'exact', head: true }),
      client.from('issuances').select('id', { count: 'exact', head: true }),
      client.from('carousel_slides').select('id', { count: 'exact', head: true }),
    ]),
    client.rpc('get_website_analytics', { p_since: since }),
  ]);

  const results = [news, advisories, hazardMaps, resources, issuances, carouselSlides];
  const failedResult = results.find((result) => result.error || result.count === null);
  if (failedResult) {
    return NextResponse.json(
      {
        success: false,
        error: failedResult.error?.message ?? 'Could not retrieve dashboard stats',
      },
      { status: 500 },
    );
  }

  if (analyticsError) {
    console.error('Failed to retrieve website analytics:', analyticsError);
  }

  return NextResponse.json({
    success: true,
    data: {
      news: news.count,
      activeAdvisories: advisories.count,
      hazardMaps: hazardMaps.count,
      resources: resources.count,
      issuances: issuances.count,
      carouselSlides: carouselSlides.count,
      analytics: analytics ?? null,
      analyticsError: analyticsError?.message ?? (analytics ? null : 'Analytics summary is unavailable'),
    },
  });
}
