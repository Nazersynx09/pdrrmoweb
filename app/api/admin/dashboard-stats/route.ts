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

  const [
    [news, advisories, hazardMaps, resources, issuances, carouselSlides],
    { data: visitorVisits, error: visitorVisitsError },
    { data: recentActivity, error: recentActivityError },
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
    client.rpc('get_website_visit_trend'),
    client
      .from('admin_activity')
      .select('id, action, entity_type, item_label, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
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

  if (visitorVisitsError) {
    console.error('Failed to retrieve website visit trend:', visitorVisitsError);
  }
  if (recentActivityError) {
    console.error('Failed to retrieve admin activity:', recentActivityError);
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
      visitorVisits: visitorVisits ?? null,
      visitorVisitsError: visitorVisitsError?.message
        ?? (visitorVisits ? null : 'Visitor visit data is unavailable'),
      recentActivity: (recentActivity ?? []).map((activity) => ({
        id: activity.id,
        action: activity.action,
        entityType: activity.entity_type,
        itemLabel: activity.item_label,
        createdAt: activity.created_at,
      })),
      recentActivityError: recentActivityError?.message ?? null,
    },
  });
}
