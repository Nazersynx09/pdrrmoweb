"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface Advisory {
  id: string;
  title: string;
  content: string;
  severity: 'info' | 'warning' | 'watch' | 'critical';
  valid_from: string;
  valid_until: string;
}

interface AlertBannerProps {
  initialAlerts?: Advisory[];
}

const severityColors: Record<string, string> = {
  info: "bg-blue-600",
  warning: "bg-amber-500",
  watch: "bg-orange-500",
  critical: "bg-red-600",
};

export default function AlertBanner({ initialAlerts = [] }: AlertBannerProps) {
  const [alerts, setAlerts] = useState<Advisory[]>(initialAlerts);
  const [activeAlert, setActiveAlert] = useState(0);
  const [loading, setLoading] = useState(!initialAlerts.length);

  useEffect(() => {
    // Fetch advisories from API if no initial alerts
    if (!initialAlerts.length) {
      fetch('/api/content/advisories')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setAlerts(data.data);
          }
        })
        .catch(err => console.error('Failed to fetch advisories:', err))
        .finally(() => setLoading(false));
    }
  }, [initialAlerts.length]);

  useEffect(() => {
    if (alerts.length === 0) return;
    
    const timer = setInterval(() => {
      setActiveAlert((prev) => (prev + 1) % alerts.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [alerts.length]);

  if (loading) {
    return (
      <div className="bg-gray-400 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p className="text-sm">Loading alerts...</p>
        </div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div
        className={`${severityColors[alerts[activeAlert]?.severity] || 'bg-blue-600'} text-white py-2 px-4 transition-colors duration-500`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
          <p className="text-sm font-medium text-center">
            <span className="font-bold uppercase">
              {alerts[activeAlert]?.severity === "warning" || alerts[activeAlert]?.severity === "critical" ? "Advisory: " : ""}
            </span>
            {alerts[activeAlert]?.title}
          </p>
        </div>
      </div>
    </div>
  );
}