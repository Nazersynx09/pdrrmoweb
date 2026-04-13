import Link from "next/link";
import { Phone, MapPin, Shield, Users } from "lucide-react";

interface QuickAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  desc: string;
}

const quickActions: QuickAction[] = [
  {
    label: "Emergency Hotline",
    icon: Phone,
    href: "/emergency",
    color: "bg-red-500 hover:bg-red-600",
    desc: "24/7 Available",
  },
  {
    label: "Hazard Maps",
    icon: MapPin,
    href: "/resources",
    color: "bg-orange-500 hover:bg-orange-600",
    desc: "View Risk Areas",
  },
  {
    label: "Emergency Checklist",
    icon: Shield,
    href: "/resources",
    color: "bg-blue-500 hover:bg-blue-600",
    desc: "Be Prepared",
  },
  {
    label: "Programs & Services",
    icon: Users,
    href: "/programs-services",
    color: "bg-emerald-500 hover:bg-emerald-600",
    desc: "Learn More",
  },
];

export default function QuickActions() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className={`${action.color} text-white p-6 rounded-xl transition-all hover:-translate-y-1 hover:shadow-lg group`}
            >
              <action.icon className="w-8 h-8 mb-3" />
              <p className="font-bold text-lg mb-1">{action.label}</p>
              <p className="text-xs text-white/80">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
