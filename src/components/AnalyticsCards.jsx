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
      bg: "bg-blue-50 border-blue-100"
    },
    {
      label: "New This Week",
      value: newThisWeek,
      icon: <UserPlus className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50 border-amber-100"
    },
    {
      label: "Interviews Scheduled",
      value: interviews,
      icon: <Calendar className="w-5 h-5 text-indigo-600" />,
      bg: "bg-indigo-50 border-indigo-100"
    },
    {
      label: "Selected Candidates",
      value: selected,
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50 border-emerald-100"
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: <Percent className="w-5 h-5 text-violet-600" />,
      bg: "bg-violet-50 border-violet-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div 
          key={idx}
          className={`bg-white border rounded-xl p-5 shadow-xs flex items-center justify-between hover:shadow-sm transition-all duration-200`}
        >
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-extrabold text-navy-800 mt-1">{stat.value}</p>
          </div>
          <div className={`${stat.bg} border rounded-lg p-2.5 flex items-center justify-center`}>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;
