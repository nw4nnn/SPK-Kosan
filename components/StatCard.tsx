import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: "blue" | "indigo" | "cyan" | "violet";
}

const colorMap = {
  blue: {
    border: "border-l-blue-500",
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    valueText: "text-blue-700",
  },
  indigo: {
    border: "border-l-indigo-500",
    iconBg: "bg-indigo-50",
    iconText: "text-indigo-600",
    valueText: "text-indigo-700",
  },
  cyan: {
    border: "border-l-cyan-500",
    iconBg: "bg-cyan-50",
    iconText: "text-cyan-600",
    valueText: "text-cyan-700",
  },
  violet: {
    border: "border-l-violet-500",
    iconBg: "bg-violet-50",
    iconText: "text-violet-600",
    valueText: "text-violet-700",
  },
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: StatCardProps) {
  const c = colorMap[color];
  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 border-l-4 ${c.border} shadow-sm p-5 hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1 truncate">
            {value}
          </p>
          {subtitle && (
            <p className={`text-xs mt-1 ${c.valueText} font-medium`}>
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`w-10 h-10 rounded-lg ${c.iconBg} flex items-center justify-center flex-shrink-0 ml-3`}
        >
          <Icon className={`w-5 h-5 ${c.iconText}`} />
        </div>
      </div>
    </div>
  );
}
