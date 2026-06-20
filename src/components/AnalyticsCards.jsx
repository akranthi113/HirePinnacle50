import React from "react";
import { Users, UserPlus, Calendar, CheckCircle, Percent } from "lucide-react";

const AnalyticsCards = ({ candidates }) => {
  const total = candidates.length;
  
  // Calculate Candidates in the last 7 days (New This Week)
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newThisWeek = candidates.filter(cand => {
    if (!cand.timestamp) return false;
    const date = cand.timestamp.toDate ? cand.timestamp.toDate() : new Date(cand.timestamp);
    return date.getTime() >= oneWeekAgo;
  }).length;

  const interviews = candidates.filter(c => c.status === "Interview").length;
  const selected = candidates.filter(c => c.status === "Selected").length;
  
  // Conversion Rate (Selected / Total * 100)
  const conversionRate = total > 0 ? ((selected / total) * 100).toFixed(1) : "0.0";

  const stats = [
    {
      label: "Total Candidates",
      value: total,
      icon: <Users className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50 border-blue-200"
    },
    {
      label: "New This Week",
      value: newThisWeek,
      icon: <UserPlus className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50 border-amber-200"
    },
    {
      label: "Interviews",
      value: interviews,
      icon: <Calendar className="w-5 h-5 text-indigo-600" />,
      bg: "bg-indigo-50 border-indigo-200"
    },
    {
      label: "Selected",
      value: selected,
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50 border-emerald-200"
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: <Percent className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-50 border-purple-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div 
          key={idx}
          className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-primary/30 p-5 flex items-center justify-between group transition-all`}
        >
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2 group-hover:text-brand-primary transition-colors">{stat.value}</p>
          </div>
          <div className={`${stat.bg} border rounded-xl p-3 flex items-center justify-center group-hover:scale-110 transition-transform`}>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
