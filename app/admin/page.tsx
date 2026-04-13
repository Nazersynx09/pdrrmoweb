'use client';

import { Newspaper, AlertTriangle, Map, FileText, FileUp, Activity } from 'lucide-react';

const stats = [
  { label: 'News & Updates', count: 12, icon: Newspaper, color: 'bg-[#002E5D]' },
  { label: 'Active Advisories', count: 3, icon: AlertTriangle, color: 'bg-amber-500' },
  { label: 'Hazard Maps', count: 8, icon: Map, color: 'bg-red-500' },
  { label: 'Resources', count: 24, icon: FileText, color: 'bg-green-500' },
  { label: 'Issuances', count: 15, icon: FileUp, color: 'bg-purple-500' },
];

const recentActivity = [
  { action: 'Published new news article', item: 'GAD Meeting on Strengthening Protection', time: '2 hours ago' },
  { action: 'Updated advisory', item: 'Southwest Monsoon Advisory', time: '5 hours ago' },
  { action: 'Added hazard map', item: 'Flood Hazard Map - Iloilo City', time: '1 day ago' },
  { action: 'Uploaded resource', item: 'Emergency Contact Directory 2026', time: '2 days ago' },
  { action: 'Published issuance', item: 'Executive Order No. 2026-001', time: '3 days ago' },
];

export default function AdminDashboard() {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{stat.label}</p>
                  <p className="text-3xl font-bold text-[#002E5D] mt-1">{stat.count}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
