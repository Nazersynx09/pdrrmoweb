'use client';

import { useEffect, useState } from 'react';
import { Newspaper, AlertTriangle, Map, FileText, FileUp, GripVertical, Activity } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface DashboardStats {
  news: number;
  activeAdvisories: number;
  hazardMaps: number;
  resources: number;
  issuances: number;
  carouselSlides: number;
  analytics: DashboardAnalytics | null;
  analyticsError: string | null;
}

interface DashboardAnalytics {
  pageViews: number;
  topPages: { path: string; views: number }[];
  referrers: { source: string; views: number }[];
  devices: { category: string; views: number }[];
  downloads: { targetPath: string; downloads: number }[];
}

interface DashboardStatsResponse {
  success: boolean;
  data?: DashboardStats;
  error?: string;
}

const recentActivity = [
  { action: 'Published new news article', item: 'GAD Meeting on Strengthening Protection', time: '2 hours ago' },
  { action: 'Updated advisory', item: 'Southwest Monsoon Advisory', time: '5 hours ago' },
  { action: 'Added hazard map', item: 'Flood Hazard Map - Iloilo City', time: '1 day ago' },
  { action: 'Uploaded resource', item: 'Emergency Contact Directory 2026', time: '2 days ago' },
  { action: 'Published issuance', item: 'Executive Order No. 2026-001', time: '3 days ago' },
];

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) throw new Error('Your session has expired. Sign in again.');

        const response = await fetch('/api/admin/dashboard-stats', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const result = await response.json() as DashboardStatsResponse;

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || 'Failed to load dashboard stats');
        }

        if (!cancelled) setDashboardStats(result.data);
        if (!cancelled) setAnalyticsError(result.data.analyticsError);
      } catch (error) {
        if (!cancelled) {
          setStatsError(error instanceof Error ? error.message : 'Failed to load dashboard stats');
        }
      } finally {
        if (!cancelled) setStatsLoading(false);
      }
    };

    void fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    { label: 'News & Updates', count: dashboardStats?.news, icon: Newspaper, color: 'bg-[#002E5D]' },
    { label: 'Active Advisories', count: dashboardStats?.activeAdvisories, icon: AlertTriangle, color: 'bg-amber-500' },
    { label: 'Hazard Maps', count: dashboardStats?.hazardMaps, icon: Map, color: 'bg-red-500' },
    { label: 'Resources', count: dashboardStats?.resources, icon: FileText, color: 'bg-green-500' },
    { label: 'Issuances', count: dashboardStats?.issuances, icon: FileUp, color: 'bg-purple-500' },
    { label: 'Carousel Slides', count: dashboardStats?.carouselSlides, icon: GripVertical, color: 'bg-blue-500' },
  ];
  const analyticsSections = [
    {
      title: 'Most-viewed pages',
      rows: dashboardStats?.analytics?.topPages.map(({ path, views }) => ({ label: path, count: views })) ?? [],
    },
    {
      title: 'Traffic sources',
      rows: dashboardStats?.analytics?.referrers.map(({ source, views }) => ({ label: source, count: views })) ?? [],
    },
    {
      title: 'Device categories',
      rows: dashboardStats?.analytics?.devices.map(({ category, views }) => ({ label: category, count: views })) ?? [],
    },
    {
      title: 'Download clicks',
      rows: dashboardStats?.analytics?.downloads.map(({ targetPath, downloads }) => ({ label: targetPath, count: downloads })) ?? [],
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#002E5D]">Dashboard</h1>
          <p className="text-gray-600">Welcome to the PDRRMO Content Management System</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
          <Activity className="w-5 h-5" />
          <span className="font-medium">System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#002E5D] mt-1">
                    {statsLoading ? '...' : statsError ? '--' : stat.count}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {statsError && (
        <p role="alert" className="text-sm text-red-700">
          Could not load dashboard stats: {statsError}
        </p>
      )}

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#002E5D]">Website Interaction</h2>
            <p className="text-sm text-gray-500">Analytics from the last 30 days</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white px-5 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Page views</p>
            <p className="mt-1 text-2xl font-bold text-[#002E5D]">
              {statsLoading
                ? '...'
                : statsError || analyticsError
                  ? '--'
                  : dashboardStats?.analytics?.pageViews ?? '--'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {analyticsSections.map((section) => {
            const maxCount = Math.max(1, ...section.rows.map((row) => row.count));
            return (
              <div key={section.title} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                <h3 className="mb-4 font-semibold text-[#002E5D]">{section.title}</h3>
                {statsLoading ? (
                  <p className="text-sm text-gray-500">Loading...</p>
                ) : statsError || analyticsError ? (
                  <p className="text-sm text-gray-500">Unavailable</p>
                ) : section.rows.length === 0 ? (
                  <p className="text-sm text-gray-500">No activity recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {section.rows.map((row) => (
                      <div key={row.label}>
                        <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                          <span className="min-w-0 truncate text-gray-700" title={row.label}>{row.label}</span>
                          <span className="shrink-0 font-semibold text-gray-900">{row.count}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-[#F58220]"
                            style={{ width: `${(row.count / maxCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {analyticsError && !statsError && (
          <p role="alert" className="text-sm text-red-700">
            Could not load interaction analytics: {analyticsError}
          </p>
        )}
      </section>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-[#002E5D]">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.item}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
