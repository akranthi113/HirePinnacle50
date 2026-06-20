import React from "react";
import { Bell } from "lucide-react";

const NotificationBadge = ({ count }) => {
  if (count === 0) {
    return (
      <div className="flex items-center text-slate-400 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold select-none shadow-sm transition">
        <Bell className="w-4 h-4 mr-2" />
        <span>No new profiles</span>
      </div>
    );
  }

  return (
    <div className="flex items-center text-rose-400 bg-rose-500/10 border border-rose-500/30 px-4 py-2 rounded-xl text-xs font-bold animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.15)]">
      <Bell className="w-4 h-4 mr-2 text-rose-500 fill-rose-500" />
      <span>{count} New Profile{count > 1 ? "s" : ""} Pending</span>
    </div>
  );
};

export default NotificationBadge;
