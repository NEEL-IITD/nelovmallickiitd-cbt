import React from 'react';
import { useCountdown, formatISTWindow } from '../hooks/useCountdown';

interface MockWindowBadgeProps {
  isScheduled?: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  windowLabel?: string | null;
  isLive?: boolean;
  allowPractice?: boolean;
}

export const MockWindowBadge: React.FC<MockWindowBadgeProps> = ({
  isScheduled = false,
  startsAt,
  endsAt,
  windowLabel,
  isLive = false,
  allowPractice = true
}) => {
  const now = Date.now();
  const startTime = startsAt ? new Date(startsAt).getTime() : 0;
  const endTime = endsAt ? new Date(endsAt).getTime() : 0;

  const isUpcoming = isScheduled && startTime > 0 && now < startTime;
  const isLiveWindow = isScheduled && startTime > 0 && endTime > 0 && now >= startTime && now <= endTime;
  const isClosed = isScheduled && endTime > 0 && now > endTime;

  // Countdowns
  const startCountdown = useCountdown(isUpcoming ? startsAt : null);
  const endCountdown = useCountdown(isLiveWindow ? endsAt : null);

  // 1. Upcoming Scheduled Window
  if (isUpcoming) {
    return (
      <div className="flex flex-col items-start gap-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>{windowLabel || 'All-India Scheduled Mock'}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700 dark:text-amber-300">
          <span>⏳ Starts in: {startCountdown.formatted}</span>
        </div>
        <span className="text-[10px] text-slate-500 dark:text-zinc-400">
          {formatISTWindow(startsAt, endsAt)}
        </span>
      </div>
    );
  }

  // 2. Active Live Window
  if (isLiveWindow) {
    return (
      <div className="flex flex-col items-start gap-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-600 text-white shadow-lg shadow-rose-600/30 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span>🔴 LIVE ALL-INDIA WINDOW</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono font-black text-rose-600 dark:text-rose-400">
          <span>Closes in: {endCountdown.formatted}</span>
        </div>
      </div>
    );
  }

  // 3. Window Closed
  if (isClosed) {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
          Window Closed
        </span>
        {allowPractice && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Practice Open
          </span>
        )}
      </div>
    );
  }

  // 4. Regular Unscheduled Tests
  if (isLive) {
    return (
      <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500 text-white shadow-sm flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        Live Now · Free
      </span>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
      Coming Soon
    </span>
  );
};
