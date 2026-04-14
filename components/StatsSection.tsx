import { Users, Clock, Shield, TrendingUp } from "lucide-react";

interface StatItem {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const stats: StatItem[] = [
  { value: "42", label: "Municipal DRRMOs", icon: Users },
  { value: "24/7", label: "Operation Center", icon: Clock },
  { value: "100+", label: "Evacuation Sites", icon: Shield },
  { value: "2.5M+", label: "Protected Population", icon: TrendingUp },
];

export default function StatsSection() {
  return (
    <section className="py-10 bg-[#002E5D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="flex justify-center mb-2">
                <stat.icon className="w-8 h-8 text-[#F58220]" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white">{stat.value}</p>
              <p className="text-xs sm:text-sm text-slate-300 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
