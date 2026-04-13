import Link from "next/link";
import { AlertTriangle } from "lucide-react";

interface AlertBannerProps {
  alerts: {
    level: string;
    message: string;
    color: string;
  }[];
  activeAlert: number;
}

export default function AlertBanner({ alerts, activeAlert }: AlertBannerProps) {
  return (
    <div className="relative">
      <div
        className={`${alerts[activeAlert].color} text-white py-2 px-4 transition-colors duration-500`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
          <p className="text-sm font-medium text-center">
            <span className="font-bold uppercase">
              {alerts[activeAlert].level === "warning" ? "Advisory: " : ""}
            </span>
            {alerts[activeAlert].message}
          </p>
        </div>
      </div>
    </div>
  );
}
