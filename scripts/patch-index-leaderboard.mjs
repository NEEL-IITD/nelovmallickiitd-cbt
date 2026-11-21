import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const indexPath = path.join(rootDir, 'index.html');

console.log('Reading index.html...');
let html = fs.readFileSync(indexPath, 'utf8');

// ==============================================================================
// 1. ADD HELPER FUNCTIONS & MockWindowBadge (after formatDuration)
// ==============================================================================
const formatDurationMarker = `    // Helper: Format duration into readable Xm Ys
    function formatDuration(seconds) {
      if (!seconds || seconds <= 0) return '0s';
      if (seconds < 60) return \`\${seconds}s\`;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0 ? \`\${mins}m \${secs}s\` : \`\${mins}m\`;
    }`;

const countdownAndBadgeCode = `    // Helper: Live Countdown Hook
    function useCountdown(targetIsoString) {
      const calculate = () => {
        if (!targetIsoString) {
          return { totalSecondsRemaining: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, formatted: '00:00:00' };
        }
        const target = new Date(targetIsoString).getTime();
        const now = Date.now();
        const diff = target - now;
        if (isNaN(target) || diff <= 0) {
          return { totalSecondsRemaining: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, formatted: '00:00:00' };
        }
        const totalSecondsRemaining = Math.floor(diff / 1000);
        const days = Math.floor(totalSecondsRemaining / 86400);
        const hours = Math.floor((totalSecondsRemaining % 86400) / 3600);
        const minutes = Math.floor((totalSecondsRemaining % 3600) / 60);
        const seconds = totalSecondsRemaining % 60;
        let formatted = '';
        if (days > 0) {
          formatted = \`\${days}d \${String(hours).padStart(2, '0')}h \${String(minutes).padStart(2, '0')}m \${String(seconds).padStart(2, '0')}s\`;
        } else {
          formatted = \`\${String(hours).padStart(2, '0')}h \${String(minutes).padStart(2, '0')}m \${String(seconds).padStart(2, '0')}s\`;
        }
        return { totalSecondsRemaining, days, hours, minutes, seconds, isExpired: false, formatted };
      };

      const [state, setState] = useState(calculate);

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

    // Helper: Format to Indian Standard Time (IST)
    function formatIST(isoString, formatType = 'full') {
      if (!isoString) return '';
      try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return '';
        const options = { timeZone: 'Asia/Kolkata', hour12: true };
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

    function formatISTWindow(startsAt, endsAt) {
      if (!startsAt) return '';
      const startStr = formatIST(startsAt, 'full');
      if (!endsAt) return startStr;
      const endTimeStr = formatIST(endsAt, 'time');
      const startParts = startStr.replace(' IST', '');
      return \`\${startParts} â€“ \${endTimeStr}\`;
    }

    // Component: MockWindowBadge (Ticking Countdown & Status)
    function MockWindowBadge({ isScheduled = false, startsAt, endsAt, windowLabel, isLive = false, allowPractice = true }) {
      const now = Date.now();
      const startTime = startsAt ? new Date(startsAt).getTime() : 0;
      const endTime = endsAt ? new Date(endsAt).getTime() : 0;

      const isUpcoming = isScheduled && startTime > 0 && now < startTime;
      const isLiveWindow = isScheduled && startTime > 0 && endTime > 0 && now >= startTime && now <= endTime;
      const isClosed = isScheduled && endTime > 0 && now > endTime;

      const startCountdown = useCountdown(isUpcoming ? startsAt : null);
      const endCountdown = useCountdown(isLiveWindow ? endsAt : null);

      if (isUpcoming) {
        return (
          <div className="flex flex-col items-start gap-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{windowLabel || 'All-India Scheduled Mock'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-700 dark:text-amber-300">
              <span>â ³ Starts in: {startCountdown.formatted}</span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">
              {formatISTWindow(startsAt, endsAt)}
            </span>
          </div>
        );
      }

      if (isLiveWindow) {
        return (
          <div className="flex flex-col items-start gap-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-600 text-white shadow-lg shadow-rose-600/30 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span>ðŸ”´ LIVE ALL-INDIA WINDOW</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-black text-rose-600 dark:text-rose-400">
              <span>Closes in: {endCountdown.formatted}</span>
            </div>
          </div>
        );
      }

      if (isClosed) {
        return (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
              Window Closed
            </span>
            {allowPractice && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Practice Open
              </span>
            )}
          </div>
        );
      }

      if (isLive) {
        return (
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500 text-white shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Live Now Â· Free
          </span>
        );
      }

      return (
        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
          Coming Soon
        </span>
      );
    }`;

if (html.includes(formatDurationMarker)) {
  html = html.replace(formatDurationMarker, `${formatDurationMarker}\n\n${countdownAndBadgeCode}`);
  console.log('âœ… Added useCountdown, formatIST, and MockWindowBadge');
} else {
  console.warn('âš ï¸  Could not find formatDuration marker');
}

// ==============================================================================
// 2. ADD LiveLeaderboardResultsCard (after RankPredictorCard)
// ==============================================================================
const rankPredictorEndMarker = `          {/* Disclaimer */}
          <p className="relative z-10 text-[11px] text-slate-400/80 leading-relaxed italic border-t border-white/5 pt-3">
            * Disclaimer: Estimated rank ranges are projected using piecewise linear interpolation from official multi-year JEE cutoff distributions. Actual AIR depends on exam paper difficulty, candidate pool variance, and official normalization schemes.
          </p>
        </div>
      );
    }`;

const liveLeaderboardResultsCardCode = `    // COMPONENT: Live All-India CBT Leaderboard Card for Results Page
    function LiveLeaderboardResultsCard({ currentPaper, candidateName, evaluationData, currentUser, setView }) {
      const [leaderboardData, setLeaderboardData] = useState(null);
      const [loading, setLoading] = useState(true);
      const [attemptCount, setAttemptCount] = useState(1);

      useEffect(() => {
        if (!currentPaper) return;
        const testId = currentPaper.id || currentPaper.testId;

        // Check user's attempt count for this test
        if (currentUser && window.studentStorage?.getAttempts) {
          const userAtts = window.studentStorage.getAttempts(currentUser.id) || [];
          const testAtts = userAtts.filter(a => a.testId === testId);
          setAttemptCount(Math.max(1, testAtts.length));
        }

        // Fetch leaderboard data
        if (window.studentStorage?.getTestLeaderboard) {
          window.studentStorage.getTestLeaderboard(testId).then(res => {
            setLeaderboardData(res);
            setLoading(false);
          }).catch(err => {
            console.warn('Error loading results leaderboard:', err);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      }, [currentPaper, currentUser]);

      if (!currentPaper || !evaluationData) return null;

      const isFirstAttempt = attemptCount <= 1;
      const topper = leaderboardData?.topper;
      const myStanding = leaderboardData?.myStanding;
      const scoreDiff = topper && topper.marks !== undefined ? Math.max(0, topper.marks - evaluationData.totalMarksScored) : 0;

      return (
        <div className="rounded-3xl border-2 border-indigo-600 bg-white dark:bg-[#121318] p-6 sm:p-8 shadow-xl shadow-indigo-600/5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                ðŸ †
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-zinc-50">
                    Live All-India CBT Leaderboard Standing
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    Official Ranks
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Benchmarked against {leaderboardData?.totalParticipants || 0} active JEE aspirants Â· NTA Percentile Normalized
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (typeof setView === 'function') setView('leaderboard');
                window.location.hash = \`#/leaderboard/\${currentPaper.id || currentPaper.testId}\`;
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 self-start sm:self-auto hover:scale-105"
            >
              <span>View Full Leaderboard</span>
              <span>â†’</span>
            </button>
          </div>

          {/* 1st Attempt vs Practice Attempt Notice */}
          {!isFirstAttempt && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-200 font-medium">
              <span className="text-base">âš–ï¸ </span>
              <p>
                <strong>Practice Attempt #{attemptCount}:</strong> To preserve strict examination integrity and mirror NTA ranking standards, official All-India ranks and percentiles are locked to your 1st Attempt. This attempt is recorded for your personal diagnosis.
              </p>
            </div>
          )}

          {/* 4 Standing Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Your All-India Rank</p>
              <p className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 pt-1">
                {myStanding?.rank ? \`#\${myStanding.rank}\` : (isFirstAttempt ? '#1' : 'Rank Locked')}
              </p>
              <p className="text-[10px] text-slate-400">of {leaderboardData?.totalParticipants || 1} candidates</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Normalized Percentile</p>
              <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 pt-1">
                {myStanding?.percentile ? \`\${myStanding.percentile}%ile\` : \`\${evaluationData.percentage}%ile\`}
              </p>
              <p className="text-[10px] text-slate-400">Official NTA Formula</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Current Topper</p>
              <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-zinc-100 truncate pt-1">
                {topper?.displayName || candidateName}
              </p>
              <p className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                {topper?.marks !== undefined ? \`\${topper.marks} / \${topper.maxMarks} Mks\` : \`\${evaluationData.totalMarksScored} / \${evaluationData.totalMaxMarks}\`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-100 dark:border-zinc-800">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Gap to Rank #1</p>
              <p className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-zinc-100 pt-1">
                {scoreDiff === 0 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 text-xl font-bold">ðŸ‘‘ You are #1</span>
                ) : (
                  <span>-\${scoreDiff} <span className="text-xs text-slate-400 font-normal">Mks</span></span>
                )}
              </p>
              <p className="text-[10px] text-slate-400">{scoreDiff === 0 ? 'Topper of Paper' : 'Behind Current Leader'}</p>
            </div>
          </div>

          {/* Top 3 Performers Mini-Bar */}
          {leaderboardData?.entries && leaderboardData.entries.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top 3 Candidates on this Paper:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {leaderboardData.entries.slice(0, 3).map((entry, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 dark:bg-zinc-900/50 border border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold">{idx === 0 ? 'ðŸ‘‘ #1' : (idx === 1 ? 'ðŸ¥ˆ #2' : 'ðŸ¥‰ #3')}</span>
                      <span className="font-semibold text-slate-800 dark:text-zinc-200 truncate">{entry.displayName}</span>
                    </div>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                      {entry.marks} Mks ({entry.percentile}%ile)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }`;

if (html.includes(rankPredictorEndMarker)) {
  html = html.replace(rankPredictorEndMarker, `${rankPredictorEndMarker}\n\n${liveLeaderboardResultsCardCode}`);
  console.log('âœ… Added LiveLeaderboardResultsCard component');
} else {
  console.warn('âš ï¸  Could not find rankPredictorEndMarker');
}

// ==============================================================================
// 3. ADD Live Leaderboard Link to MainNavbar
// ==============================================================================
const navbarDropdownMarker = `                      <button
                        type="button"
                        onClick={() => { setActiveCategory('jee-mains'); navigateTo('home', '#/tests/jee-mains'); }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/70 text-left transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                            <span>JEE Mains</span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                              10 Tests
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400">PTM 01â€“10 chapterwise mocks</p>
                        </div>
                        <span className="text-slate-400">â†’</span>
                      </button>`;

const navbarLeaderboardButton = `

                      <div className="my-1 border-t border-slate-100 dark:border-zinc-800/80" />
                      <button
                        type="button"
                        onClick={() => { setActiveDropdown(null); navigateTo('leaderboard', '#/leaderboard'); }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-left text-amber-700 dark:text-amber-300 font-bold transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">ðŸ †</span>
                          <div>
                            <div className="font-bold flex items-center gap-1.5">
                              <span>Live Leaderboard</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-500 text-white">Toppers</span>
                            </div>
                            <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80 font-normal">Official 1st-attempt ranks & percentiles</p>
                          </div>
                        </div>
                        <span className="text-amber-600 dark:text-amber-400">â†’</span>
                      </button>`;

if (html.includes(navbarDropdownMarker)) {
  html = html.replace(navbarDropdownMarker, `${navbarDropdownMarker}${navbarLeaderboardButton}`);
  console.log('âœ… Added Live Leaderboard link to MainNavbar dropdown');
} else {
  console.warn('âš ï¸  Could not find navbarDropdownMarker');
}

// Mobile drawer leaderboard link
const mobileDrawerMarker = `                      <button
                        type="button"
                        onClick={() => { setActiveCategory('jee-mains'); navigateTo('home', '#/tests/jee-mains'); }}
                        className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-between"
                      >
                        <span>JEE Mains (PTM 01â€“10)</span>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">10 Tests</span>
                      </button>`;

const mobileDrawerLeaderboardButton = `
                      <button
                        type="button"
                        onClick={() => { setMobileMenuOpen(false); navigateTo('leaderboard', '#/leaderboard'); }}
                        className="w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5">
                          <span>ðŸ †</span>
                          <span>Live Leaderboard & Toppers</span>
                        </span>
                        <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-extrabold">Live</span>
                      </button>`;

if (html.includes(mobileDrawerMarker)) {
  html = html.replace(mobileDrawerMarker, `${mobileDrawerMarker}${mobileDrawerLeaderboardButton}`);
  console.log('âœ… Added Live Leaderboard link to Mobile Drawer');
} else {
  console.warn('âš ï¸  Could not find mobileDrawerMarker');
}

// Write intermediate progress
fs.writeFileSync(indexPath, html, 'utf8');
console.log('Intermediate file saved successfully.');
