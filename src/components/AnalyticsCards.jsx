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
      icon: <Users className="w-5 h-5 text-blue-400" />,
      bg: "bg-blue-500/10 border-blue-500/20"
    },
    {
      label: "New This Week",
      value: newThisWeek,
      icon: <UserPlus className="w-5 h-5 text-amber-400" />,
      bg: "bg-amber-500/10 border-amber-500/20"
    },
    {
      label: "Interviews",
      value: interviews,
      icon: <Calendar className="w-5 h-5 text-indigo-400" />,
      bg: "bg-indigo-500/10 border-indigo-500/20"
    },
    {
      label: "Selected",
      value: selected,
      icon: <CheckCircle className="w-5 h-5 text-brand-accent" />,
      bg: "bg-emerald-500/10 border-emerald-500/20"
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: <Percent className="w-5 h-5 text-purple-400" />,
      bg: "bg-purple-500/10 border-purple-500/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div 
          key={idx}
          className={`glassmorphism glassmorphism-hover rounded-xl p-5 flex items-center justify-between group`}
        >
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-extrabold text-white mt-2 group-hover:text-brand-primary transition-colors">{stat.value}</p>
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
