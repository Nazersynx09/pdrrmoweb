'use client';

import { useEffect, useState, type KeyboardEvent } from 'react';
import { Newspaper, AlertTriangle, Map, FileText, FileUp, GripVertical, Activity, TrendingUp, CalendarDays, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface DashboardStats {
  news: number;
  activeAdvisories: number;
  hazardMaps: number;
  resources: number;
  issuances: number;
  carouselSlides: number;
  visitorVisits: DailyVisit[] | null;
  visitorVisitsError: string | null;
  recentActivity: RecentActivityItem[];
  recentActivityError: string | null;
}

interface DailyVisit {
  date: string;
  visits: number;
}

interface RecentActivityItem {
  id: string;
  action: 'created' | 'updated' | 'deleted';
  entityType: string;
  itemLabel: string;
  createdAt: string;
}

interface DashboardStatsResponse {
  success: boolean;
  data?: DashboardStats;
  error?: string;
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));

const formatActivityTime = (timestamp: string) =>
  new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Manila',
  }).format(new Date(timestamp));

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

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
    { label: 'News & Updates', count: dashboardStats?.news, icon: Newspaper, color: 'bg-[#002E5D]', accent: 'border-l-[#002E5D]' },
    { label: 'Active Advisories', count: dashboardStats?.activeAdvisories, icon: AlertTriangle, color: 'bg-amber-500', accent: 'border-l-amber-500' },
    { label: 'Hazard Maps', count: dashboardStats?.hazardMaps, icon: Map, color: 'bg-red-500', accent: 'border-l-red-500' },
    { label: 'Resources', count: dashboardStats?.resources, icon: FileText, color: 'bg-green-500', accent: 'border-l-green-500' },
    { label: 'Issuances', count: dashboardStats?.issuances, icon: FileUp, color: 'bg-purple-500', accent: 'border-l-purple-500' },
    { label: 'Carousel Slides', count: dashboardStats?.carouselSlides, icon: GripVertical, color: 'bg-blue-500', accent: 'border-l-blue-500' },
  ];
  const visitorVisits = dashboardStats?.visitorVisits ?? [];
  const totalVisits = visitorVisits.reduce((total, day) => total + day.visits, 0);
  const averageVisits = visitorVisits.length ? Math.round(totalVisits / visitorVisits.length) : 0;
  const peakDay = visitorVisits.reduce<DailyVisit | null>(
    (peak, day) => (!peak || day.visits > peak.visits ? day : peak),
    null
  );
  const visitsUnavailable = Boolean(statsError || dashboardStats?.visitorVisitsError);
  const recentActivity = dashboardStats?.recentActivity ?? [];

  const summaryValue = (value: string | number) =>
    statsLoading ? '...' : visitsUnavailable ? '--' : value;

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#002E5D] px-6 py-6 shadow-sm sm:px-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#F58220]/20" aria-hidden="true" />
        <div className="absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/5" aria-hidden="true" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-blue-100">Welcome to the PDRRMO Content Management System</p>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-green-700">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <Activity className="h-5 w-5" />
            <span className="font-medium">System Online</span>
          </div>
        </div>
      </div>

      {/* Content stats */}
      <section aria-label="Content overview" className="space-y-3">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`rounded-xl border border-l-4 border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${stat.accent}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold uppercase tracking-wide text-gray-500">{stat.label}</p>
                    <p className="mt-1 text-3xl font-bold text-[#002E5D]">
                      {statsLoading ? '...' : statsError ? '--' : stat.count}
                    </p>
                  </div>
                  <div className={`shrink-0 rounded-xl p-3 shadow-sm ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {statsError && (
          <p role="alert" className="rounded-lg border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
            Could not load dashboard stats: {statsError}
          </p>
        )}
      </section>

      {/* Visits + activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-gray-100 bg-white shadow-sm xl:col-span-2">
          <div className="flex flex-col gap-1 border-b border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-[#002E5D]">Visitor Visits</h2>
            <p className="text-sm text-gray-500">Daily page views over the last 30 days</p>
          </div>

          <div className="grid grid-cols-1 divide-y divide-gray-100 border-b border-gray-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-[#002E5D]/10 p-2">
                <TrendingUp className="h-5 w-5 text-[#002E5D]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total visits</p>
                <p className="text-2xl font-bold text-[#002E5D]">{summaryValue(totalVisits)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-[#F58220]/10 p-2">
                <Activity className="h-5 w-5 text-[#F58220]" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Daily average</p>
                <p className="text-2xl font-bold text-[#002E5D]">{summaryValue(averageVisits)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="rounded-lg bg-green-50 p-2">
                <CalendarDays className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Peak day</p>
                <p className="text-2xl font-bold text-[#002E5D]">
                  {summaryValue(peakDay && peakDay.visits > 0 ? formatDate(peakDay.date) : '—')}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {statsLoading ? (
              <p className="py-24 text-center text-sm text-gray-500">Loading visitor visits...</p>
            ) : statsError ? (
              <p role="alert" className="py-24 text-center text-sm text-red-700">
                Could not load visitor visits: {statsError}
              </p>
            ) : dashboardStats?.visitorVisitsError ? (
              <p role="alert" className="py-24 text-center text-sm text-red-700">
                Could not load visitor visits: {dashboardStats.visitorVisitsError}
              </p>
            ) : totalVisits === 0 ? (
              <p className="py-24 text-center text-sm text-gray-500">
                No visits have been recorded in the last 30 days.
              </p>
            ) : (
              <VisitorVisitsChart visits={visitorVisits} />
            )}
          </div>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-[#002E5D]">Recent Activity</h2>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          {statsLoading ? (
            <p className="p-5 text-sm text-gray-500">Loading recent activity...</p>
          ) : statsError ? (
            <p role="alert" className="p-5 text-sm text-red-700">
              Could not load recent activity: {statsError}
            </p>
          ) : dashboardStats?.recentActivityError ? (
            <p role="alert" className="p-5 text-sm text-red-700">
              Could not load recent activity: {dashboardStats.recentActivityError}
            </p>
          ) : recentActivity.length === 0 ? (
            <p className="p-5 text-sm text-gray-500">
              No admin activity has been recorded yet.
            </p>
          ) : (
            <ol className="p-5">
              {recentActivity.map((activity, index) => (
                <li key={activity.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {index !== recentActivity.length - 1 && (
                    <span className="absolute left-5px top-4 h-full w-px bg-gray-200" aria-hidden="true" />
                  )}
                  <span className="relative mt-1.5 h-11px w-11px shrink-0 rounded-full border-2 border-[#F58220] bg-white" />
                  <div className="min-w-0">
                    <p className="font-medium capitalize text-gray-900">
                      {activity.action} {activity.entityType}
                    </p>
                    <p className="text-sm text-gray-600">{activity.itemLabel}</p>
                    <time
                      dateTime={activity.createdAt}
                      className="mt-1 block text-xs text-gray-500"
                    >
                      {formatActivityTime(activity.createdAt)}
                    </time>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}

function VisitorVisitsChart({ visits }: { visits: DailyVisit[] }) {
  const [range, setRange] = useState<7 | 14 | 30>(30);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const ranges = [7, 14, 30] as const;

  const data = visits.slice(-range);
  const width = 720;
  const height = 300;
  const left = 44;
  const right = 16;
  const top = 20;
  const bottom = 38;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const baseline = top + plotHeight;

  const rawMax = Math.max(1, ...data.map(({ visits: count }) => count));
  const step = Math.max(1, Math.ceil(rawMax / 4));
  const yMax = step * 4;
  const visitTicks = [0, 1, 2, 3, 4].map((i) => i * step);

  const points = data.map((day, index) => ({
    ...day,
    x: left + (plotWidth * index) / Math.max(data.length - 1, 1),
    y: top + plotHeight * (1 - day.visits / yMax),
  }));

  // Smooth curve with horizontal tangents (no overshoot below zero)
  const linePath = points.length
    ? points.reduce((path, point, i) => {
        if (i === 0) return `M ${point.x} ${point.y}`;
        const prev = points[i - 1];
        const mid = (prev.x + point.x) / 2;
        return `${path} C ${mid} ${prev.y}, ${mid} ${point.y}, ${point.x} ${point.y}`;
      }, '')
    : '';
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`
    : '';

  const rangeTotal = data.reduce((sum, day) => sum + day.visits, 0);
  const rangeAverage = data.length ? Math.round(rangeTotal / data.length) : 0;
  const peakIndex = data.reduce((best, day, i) => (day.visits > data[best].visits ? i : best), 0);

  const labelCount = Math.min(5, data.length);
  const dateLabels = [
    ...new Set(
      Array.from({ length: labelCount }, (_, i) =>
        Math.round((i * (data.length - 1)) / Math.max(labelCount - 1, 1))
      )
    ),
  ];

  const formatDay = (date: string) =>
    new Intl.DateTimeFormat('en-PH', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${date}T00:00:00Z`));

  const selectFromPointer = (clientX: number, rect: DOMRect) => {
    if (!data.length || rect.width === 0) return;
    const x = ((clientX - rect.left) / rect.width) * width;
    const ratio = (x - left) / plotWidth;
    const index = Math.round(ratio * (data.length - 1));
    setActiveIndex(Math.min(Math.max(index, 0), data.length - 1));
  };

  const handleKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (!data.length) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setActiveIndex((i) => (i === null ? 0 : Math.min(i + 1, data.length - 1)));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setActiveIndex((i) => (i === null ? data.length - 1 : Math.max(i - 1, 0)));
    } else if (event.key === 'Escape') {
      setActiveIndex(null);
    }
  };

  const active = activeIndex !== null ? points[activeIndex] : null;
  const previous = activeIndex !== null && activeIndex > 0 ? points[activeIndex - 1] : null;
  const delta = active && previous ? active.visits - previous.visits : null;

  const tooltipLeft = active ? (active.x / width) * 100 : 0;
  const tooltipTop = active ? (active.y / height) * 100 : 0;
  const tooltipShift = tooltipLeft < 15 ? '-12%' : tooltipLeft > 85 ? '-88%' : '-50%';

  return (
    <div>
      {/* Readout + range toggle */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-h-52px" aria-live="polite">
          {active ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{formatDay(active.date)}</p>
              <p className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#002E5D]">{active.visits}</span>
                <span className="text-sm text-gray-500">visits</span>
                {delta !== null && delta !== 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      delta > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {delta > 0 ? '+' : ''}
                    {delta} vs previous day
                  </span>
                )}
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Last {data.length} days
              </p>
              <p className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#002E5D]">{rangeTotal}</span>
                <span className="text-sm text-gray-500">visits · avg {rangeAverage}/day</span>
              </p>
            </>
          )}
        </div>

        <div className="inline-flex w-fit rounded-lg bg-gray-100 p-1" role="group" aria-label="Chart date range">
          {ranges.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setRange(option);
                setActiveIndex(null);
              }}
              aria-pressed={range === option}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                range === option
                  ? 'bg-white text-[#002E5D] shadow-sm'
                  : 'text-gray-500 hover:text-[#002E5D]'
              }`}
            >
              {option}D
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          className="block w-full cursor-crosshair rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F58220]/50"
          style={{ aspectRatio: `${width} / ${height}` }}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          tabIndex={0}
          aria-label={`Daily page-view visits over the last ${data.length} days. Use left and right arrow keys to inspect each day.`}
          onMouseMove={(e) => selectFromPointer(e.clientX, e.currentTarget.getBoundingClientRect())}
          onMouseLeave={() => setActiveIndex(null)}
          onTouchStart={(e) => selectFromPointer(e.touches[0].clientX, e.currentTarget.getBoundingClientRect())}
          onTouchMove={(e) => selectFromPointer(e.touches[0].clientX, e.currentTarget.getBoundingClientRect())}
          onKeyDown={handleKeyDown}
          onBlur={() => setActiveIndex(null)}
        >
          <title>{`Daily page-view visits over the last ${data.length} days`}</title>
          <defs>
            <linearGradient id="visitsAreaFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#F58220" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#F58220" stopOpacity="0" />
            </linearGradient>
          </defs>

          {visitTicks.map((tick) => {
            const y = top + plotHeight * (1 - tick / yMax);
            return (
              <g key={tick}>
                <line
                  x1={left}
                  x2={width - right}
                  y1={y}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeDasharray={tick === 0 ? undefined : '4 4'}
                />
                <text x={left - 10} y={y + 4} textAnchor="end" className="fill-gray-500 text-[11px]">
                  {tick}
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill="url(#visitsAreaFill)" />
          <path
            d={linePath}
            fill="none"
            stroke="#F58220"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Crosshair */}
          {active && (
            <line
              x1={active.x}
              x2={active.x}
              y1={top}
              y2={baseline}
              stroke="#002E5D"
              strokeOpacity="0.35"
              strokeDasharray="4 4"
            />
          )}

          {/* Data points */}
          {points.map((point, index) => {
            const isActive = index === activeIndex;
            const isPeak = index === peakIndex && point.visits > 0;
            if (!isActive && !isPeak && data.length > 14) return null;
            return (
              <g key={point.date}>
                {isActive && <circle cx={point.x} cy={point.y} r="10" fill="#F58220" fillOpacity="0.2" />}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isActive ? 6 : isPeak ? 5 : 3}
                  fill={isActive ? '#002E5D' : isPeak ? '#F58220' : '#002E5D'}
                  stroke="#fff"
                  strokeWidth={isActive || isPeak ? 2 : 0}
                />
              </g>
            );
          })}

          {dateLabels.map((index, i) => {
            const point = points[index];
            return (
              <text
                key={point.date}
                x={point.x}
                y={height - 8}
                textAnchor={i === 0 ? 'start' : i === dateLabels.length - 1 ? 'end' : 'middle'}
                className="fill-gray-500 text-xs"
              >
                {formatDate(point.date)}
              </text>
            );
          })}
        </svg>

        {/* Floating tooltip */}
        {active && (
          <div
            className="pointer-events-none absolute z-10 whitespace-nowrap rounded-lg bg-[#002E5D] px-3 py-2 text-xs text-white shadow-lg"
            style={{
              left: `${tooltipLeft}%`,
              top: `${tooltipTop}%`,
              transform: `translate(${tooltipShift}, calc(-100% - 16px))`,
            }}
          >
            <p className="text-blue-200">{formatDay(active.date)}</p>
            <p className="mt-0.5 text-sm font-bold">
              {active.visits} {active.visits === 1 ? 'visit' : 'visits'}
            </p>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col items-center justify-between gap-1 text-xs text-gray-500 sm:flex-row">
        <p>Hover, tap, or use the arrow keys to inspect a day.</p>
        <p>Each visit represents a recorded page view, not a unique person.</p>
      </div>
    </div>
  );
}