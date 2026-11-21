import { useState, useEffect } from 'react';

export interface CountdownState {
  totalSecondsRemaining: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formatted: string;
}

export function useCountdown(targetIsoString?: string | null): CountdownState {
  const calculate = (): CountdownState => {
    if (!targetIsoString) {
      return {
        totalSecondsRemaining: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        formatted: '00:00:00'
      };
    }

    const target = new Date(targetIsoString).getTime();
    const now = Date.now();
    const diff = target - now;

    if (isNaN(target) || diff <= 0) {
      return {
        totalSecondsRemaining: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        formatted: '00:00:00'
      };
    }

    const totalSecondsRemaining = Math.floor(diff / 1000);
    const days = Math.floor(totalSecondsRemaining / 86400);
    const hours = Math.floor((totalSecondsRemaining % 86400) / 3600);
    const minutes = Math.floor((totalSecondsRemaining % 3600) / 60);
    const seconds = totalSecondsRemaining % 60;

    let formatted = '';
    if (days > 0) {
      formatted = `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    } else {
      formatted = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
    }

    return {
      totalSecondsRemaining,
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
      formatted
    };
  };

  const [state, setState] = useState<CountdownState>(calculate);

  useEffect(() => {
    setState(calculate());
    if (!targetIsoString) return;

    const interval = setInterval(() => {
      setState(calculate());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetIsoString]);

  return state;
}

/**
 * Format timestamp into standard Indian Standard Time (IST) strings
 */
export function formatIST(isoString?: string | null, formatType: 'full' | 'short' | 'time' = 'full'): string {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';

    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      hour12: true
    };

    if (formatType === 'time') {
      options.hour = 'numeric';
      options.minute = '2-digit';
      return new Intl.DateTimeFormat('en-IN', options).format(date) + ' IST';
    }

    if (formatType === 'short') {
      options.month = 'short';
      options.day = 'numeric';
      options.hour = 'numeric';
      options.minute = '2-digit';
      return new Intl.DateTimeFormat('en-IN', options).format(date) + ' IST';
    }

    options.weekday = 'short';
    options.day = 'numeric';
    options.month = 'short';
    options.hour = 'numeric';
    options.minute = '2-digit';
    return new Intl.DateTimeFormat('en-IN', options).format(date) + ' IST';
  } catch (e) {
    return isoString;
  }
}

/**
 * Helper to format start and end into e.g. "Sun, 29 Nov · 9:00 AM – 2:00 PM IST"
 */
export function formatISTWindow(startsAt?: string | null, endsAt?: string | null): string {
  if (!startsAt) return '';
  const startStr = formatIST(startsAt, 'full');
  if (!endsAt) return startStr;
  const endTimeStr = formatIST(endsAt, 'time');
  // If same day, return e.g. "Sun, 29 Nov · 9:00 AM – 2:00 PM IST"
  const startParts = startStr.replace(' IST', '');
  return `${startParts} – ${endTimeStr}`;
}
