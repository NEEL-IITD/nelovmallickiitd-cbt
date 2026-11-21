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
// 1. UPDATE AdminDashboardView SIGNATURE & STATE
// ==============================================================================
const adminViewSignatureOld = `function AdminDashboardView({ currentUser, setView, testConfigs, setTestConfigs }) {`;
const adminViewSignatureNew = `function AdminDashboardView({ currentUser, setView, testConfigs, setTestConfigs, detailedConfigs: propDetailedConfigs, setDetailedConfigs: propSetDetailedConfigs }) {
      const [adminLeaderboardTestId, setAdminLeaderboardTestId] = useState('jee-advanced-pta-04');
      const [adminLeaderboardData, setAdminLeaderboardData] = useState(null);
      const [adminLeaderboardLoading, setAdminLeaderboardLoading] = useState(false);
      const [scheduleModal, setScheduleModal] = useState(null);
      const [localDetailedConfigs, setLocalDetailedConfigs] = useState({});

      const detailedConfigs = propDetailedConfigs || localDetailedConfigs;
      const setDetailedConfigs = propSetDetailedConfigs || setLocalDetailedConfigs;`;

if (html.includes(adminViewSignatureOld)) {
  html = html.replace(adminViewSignatureOld, adminViewSignatureNew);
  console.log('✅ Updated AdminDashboardView signature & state');
}

// In AdminDashboardView loadData: add getTestConfigsDetails
const loadDataCfgMarker = `          if (window.studentStorage?.getTestConfigs) {
            const cfg = await window.studentStorage.getTestConfigs();
            if (cfg && Object.keys(cfg).length > 0) {
              setTestConfigs(cfg);
            }
          }`;

const loadDataCfgWithDetails = `          if (window.studentStorage?.getTestConfigs) {
            const cfg = await window.studentStorage.getTestConfigs();
            if (cfg && Object.keys(cfg).length > 0) {
              setTestConfigs(cfg);
            }
          }

          if (window.studentStorage?.getTestConfigsDetails) {
            const d = await window.studentStorage.getTestConfigsDetails();
            const map = {};
            (d || []).forEach(item => { map[item.testId] = item; });
            setDetailedConfigs(map);
          }`;

if (html.includes(loadDataCfgMarker)) {
  html = html.replace(loadDataCfgMarker, loadDataCfgWithDetails);
  console.log('✅ Added getTestConfigsDetails call to loadData in AdminDashboardView');
}

// Add Admin Schedule Handlers & Leaderboard Effect right before handleToggleStatus
const handleToggleStatusMarker = `      const handleToggleStatus = (test) => {`;
const adminScheduleHandlers = `      // Fetch Admin Leaderboard Data on Tab / Test Change
      useEffect(() => {
        if (adminTab === 'leaderboards' && window.studentStorage?.getTestLeaderboard) {
          setAdminLeaderboardLoading(true);
          window.studentStorage.getTestLeaderboard(adminLeaderboardTestId)
            .then(res => {
              setAdminLeaderboardData(res);
              setAdminLeaderboardLoading(false);
            })
            .catch(() => setAdminLeaderboardLoading(false));
        }
      }, [adminTab, adminLeaderboardTestId]);

      const handleOpenScheduleModal = (test) => {
        const cur = detailedConfigs[test.testId] || {};
        let startsAt = '';
        let endsAt = '';
        if (cur.startsAt) {
          try { startsAt = new Date(cur.startsAt).toISOString().slice(0, 16); } catch (e) {}
        }
        if (cur.endsAt) {
          try { endsAt = new Date(cur.endsAt).toISOString().slice(0, 16); } catch (e) {}
        }
        setScheduleModal({
          isOpen: true,
          testId: test.testId,
          code: test.code,
          title: test.title,
          isScheduled: cur.isScheduledWindow || false,
          startsAt,
          endsAt,
          windowLabel: cur.windowLabel || 'Sunday All-India Live Mock',
          lockLeaderboard: cur.lockLeaderboardUntilEnd ?? true,
          allowPractice: cur.allowPracticeAfterEnd ?? true
        });
      };

      const handlePresetNextSunday = () => {
        const now = new Date();
        const nextSunday = new Date();
        const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
        nextSunday.setDate(now.getDate() + daysUntilSunday);
        const year = nextSunday.getFullYear();
        const month = String(nextSunday.getMonth() + 1).padStart(2, '0');
        const day = String(nextSunday.getDate()).padStart(2, '0');
        setScheduleModal(prev => prev ? ({
          ...prev,
          isScheduled: true,
          startsAt: \`\${year}-\${month}-\${day}T09:00\`,
          endsAt: \`\${year}-\${month}-\${day}T14:00\`,
          windowLabel: 'Sunday All-India Live Mock'
        }) : null);
      };

      const handleSaveSchedule = async () => {
        if (!scheduleModal) return;
        const startsAtIso = scheduleModal.startsAt ? new Date(scheduleModal.startsAt).toISOString() : null;
        const endsAtIso = scheduleModal.endsAt ? new Date(scheduleModal.endsAt).toISOString() : null;
        const ok = await window.studentStorage.updateTestSchedule(scheduleModal.testId, {
          is_scheduled_window: scheduleModal.isScheduled,
          starts_at: startsAtIso,
          ends_at: endsAtIso,
          window_label: scheduleModal.windowLabel,
          lock_leaderboard_until_end: scheduleModal.lockLeaderboard,
          allow_practice_after_end: scheduleModal.allowPractice
        });
        if (ok) {
          setDetailedConfigs(prev => ({
            ...prev,
            [scheduleModal.testId]: {
              ...(prev[scheduleModal.testId] || {}),
              testId: scheduleModal.testId,
              code: scheduleModal.code,
              title: scheduleModal.title,
              isScheduledWindow: scheduleModal.isScheduled,
              startsAt: startsAtIso,
              endsAt: endsAtIso,
              windowLabel: scheduleModal.windowLabel,
              lockLeaderboardUntilEnd: scheduleModal.lockLeaderboard,
              allowPracticeAfterEnd: scheduleModal.allowPractice
            }
          }));
          setScheduleModal(null);
        }
      };

      const handleClearSchedule = async (testId) => {
        const ok = await window.studentStorage.updateTestSchedule(testId, {
          is_scheduled_window: false,
          starts_at: null,
          ends_at: null,
          window_label: null
        });
        if (ok) {
          setDetailedConfigs(prev => ({
            ...prev,
            [testId]: {
              ...(prev[testId] || {}),
              isScheduledWindow: false,
              startsAt: null,
              endsAt: null,
              windowLabel: null
            }
          }));
          setScheduleModal(null);
        }
      };

      const handleExportLeaderboardCSV = () => {
        if (!adminLeaderboardData || !adminLeaderboardData.entries || adminLeaderboardData.entries.length === 0) {
          alert('No leaderboard entries to export for this test.');
          return;
        }
        const headers = ['Rank', 'Student Name', 'Marks Scored', 'Max Marks', 'Percentile', 'Accuracy (%)', 'Time Taken (Seconds)', 'Attempted in Live Window', 'Submitted At'];
        const rows = adminLeaderboardData.entries.map(e => [
          e.rank,
          \`"\${(e.displayName || 'Student').replace(/"/g, '""')}"\`,
          e.marks,
          e.maxMarks,
          e.percentile,
          e.accuracy,
          e.timeTakenSeconds || 0,
          e.attemptedInLiveWindow ? 'Yes' : 'No',
          e.submittedAt
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', \`leaderboard_\${adminLeaderboardTestId}_\${Date.now()}.csv\`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      const handleToggleStatus = (test) => {`;

if (html.includes(handleToggleStatusMarker)) {
  html = html.replace(handleToggleStatusMarker, adminScheduleHandlers);
  console.log('✅ Added admin schedule handlers and leaderboard effect');
}

// Add 'leaderboards' to adminTabs
const adminTabTestsEntry = `{ id: 'tests', label: 'Manage Tests (PTM & PTA)', icon: '⚙️' },`;
const adminTabWithLeaderboard = `{ id: 'tests', label: 'Manage Tests (PTM & PTA)', icon: '⚙️' },
                { id: 'leaderboards', label: 'Live Leaderboards', icon: '🏆' },`;

if (html.includes(adminTabTestsEntry)) {
  html = html.replace(adminTabTestsEntry, adminTabWithLeaderboard);
  console.log('✅ Added Live Leaderboards tab to Admin tab bar');
}

// In Manage Tests (JEE Advanced and JEE Mains rows), add Schedule badge & Schedule Window button
// Let's replace the test row right side in jeeAdvancedTestsList
const jeeAdvRowToggle = `<div className="flex items-center gap-3">
                            <span className={\`px-2.5 py-1 rounded-full text-xs font-bold \${isLive ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'}\`}>
                              {isLive ? 'Live Now' : 'Coming Soon'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(test)}
                              className={\`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 \${isLive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-zinc-700'}\`}
                            >
                              <span className={\`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 \${isLive ? 'translate-x-5' : 'translate-x-0'}\`} />
                            </button>
                          </div>`;

const jeeAdvRowWithSchedule = `<div className="flex items-center gap-2.5 flex-wrap justify-end">
                            {detailedConfigs[test.testId]?.isScheduledWindow && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                📅 Scheduled
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleOpenScheduleModal(test)}
                              className="px-2.5 py-1 rounded-xl text-xs font-bold border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors"
                            >
                              📅 Schedule
                            </button>
                            <span className={\`px-2.5 py-1 rounded-full text-xs font-bold \${isLive ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'}\`}>
                              {isLive ? 'Live Now' : 'Coming Soon'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(test)}
                              className={\`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 \${isLive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-zinc-700'}\`}
                            >
                              <span className={\`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 \${isLive ? 'translate-x-5' : 'translate-x-0'}\`} />
                            </button>
                          </div>`;

if (html.includes(jeeAdvRowToggle)) {
  html = html.replaceAll(jeeAdvRowToggle, jeeAdvRowWithSchedule);
  console.log('✅ Added Schedule Window buttons to Manage Tests list rows');
}

// Add Tab 5: Live Leaderboards View in AdminDashboardView (after adminTab === 'reports')
const reportsTabEndMarker = `                  </div>
                )}
              </div>
            )}`;

const adminLeaderboardTabContent = `                  </div>
                )}
              </div>
            )}

            {/* TAB: LIVE LEADERBOARDS INSPECTION & CSV EXPORT */}
            {adminTab === 'leaderboards' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="p-5 rounded-3xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-black text-lg text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                      <span>🏆 Live CBT Leaderboards &amp; All-India Rankings</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                        Admin Inspector
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                      Real-time 1st-attempt official rankings, marks, percentiles, accuracy, and pacing for any paper. Accessible even while test windows are locked.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleExportLeaderboardCSV}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                    >
                      <span>📥</span> Export Leaderboard CSV
                    </button>
                  </div>
                </div>

                {/* Test Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  {[...jeeAdvancedTestsList, ...jeeMainsTestsList].map((t) => (
                    <button
                      key={t.testId}
                      onClick={() => setAdminLeaderboardTestId(t.testId)}
                      className={\`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border \${
                        adminLeaderboardTestId === t.testId
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white dark:bg-[#121318] text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800'
                      }\`}
                    >
                      {t.code}
                    </button>
                  ))}
                </div>

                {/* Leaderboard Table */}
                <div className="rounded-3xl bg-white dark:bg-[#121318] border border-slate-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-zinc-100">
                        Leaderboard: {adminLeaderboardTestId} ({adminLeaderboardData?.totalParticipants || 0} Participants)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Highest Marks: {adminLeaderboardData?.highestMarks || 0} · Average: {adminLeaderboardData?.averageMarks || 0}
                      </p>
                    </div>
                    {adminLeaderboardData?.locked && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                        🔒 Window Locked for Students
                      </span>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 text-slate-500 uppercase font-bold text-[10px]">
                        <tr>
                          <th className="p-3">Rank</th>
                          <th className="p-3">Student Name</th>
                          <th className="p-3 text-center">Marks Scored</th>
                          <th className="p-3 text-center">Percentile</th>
                          <th className="p-3 text-center">Accuracy</th>
                          <th className="p-3 text-right">Time Taken</th>
                          <th className="p-3 text-right">Submitted At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                        {adminLeaderboardLoading ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-400">Loading rankings...</td>
                          </tr>
                        ) : (adminLeaderboardData?.entries || []).length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-8 text-center text-slate-400 italic">No attempt entries recorded for this paper yet.</td>
                          </tr>
                        ) : (
                          (adminLeaderboardData?.entries || []).map((row) => (
                            <tr key={row.rank + row.displayName} className="hover:bg-slate-50 dark:hover:bg-zinc-900/40">
                              <td className="p-3 font-mono font-bold">#{row.rank}</td>
                              <td className="p-3 font-semibold text-slate-900 dark:text-zinc-100">
                                {row.displayName}
                                {row.attemptedInLiveWindow && (
                                  <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] bg-emerald-100 text-emerald-700 font-bold uppercase">
                                    Live Window
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center font-mono font-bold">{row.marks} / {row.maxMarks}</td>
                              <td className="p-3 text-center font-mono font-bold text-emerald-600">{row.percentile}%ile</td>
                              <td className="p-3 text-center font-mono">{row.accuracy}%</td>
                              <td className="p-3 text-right font-mono text-slate-500">{row.timeTakenSeconds ? \`\${Math.round(row.timeTakenSeconds / 60)}m\` : '—'}</td>
                              <td className="p-3 text-right text-slate-400 text-[11px]">{new Date(row.submittedAt).toLocaleString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}`;

if (html.includes(reportsTabEndMarker)) {
  html = html.replace(reportsTabEndMarker, adminLeaderboardTabContent);
  console.log('✅ Added Live Leaderboards inspection tab to AdminDashboardView');
}

// Add Schedule Window Modal Dialog to AdminDashboardView right before {confirmModal && (
const confirmModalMarker = `{/* Warning Confirmation Modal */}\n          {confirmModal && (`;
const scheduleModalDialogCode = `{/* Scheduled Mock Window Modal */}
          {scheduleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-6 sm:p-8 shadow-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xl flex items-center justify-center">
                      📅
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-zinc-50 text-base">
                        Schedule Mock Window: {scheduleModal.code}
                      </h4>
                      <p className="text-xs text-slate-500">{scheduleModal.title}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setScheduleModal(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 hover:text-slate-600 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>

                {/* 1-Click Preset */}
                <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 flex items-center justify-between gap-3">
                  <div className="text-xs text-indigo-950 dark:text-indigo-200">
                    <p className="font-bold">⚡ Fast Preset: Next Sunday (9 AM – 2 PM IST)</p>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400">All-India standard 5-hour mock window</p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePresetNextSunday}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all shrink-0"
                  >
                    Apply Next Sunday
                  </button>
                </div>

                {/* Window Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800">
                  <div>
                    <p className="font-bold text-xs text-slate-800 dark:text-zinc-200">Enable Scheduled Mock Window</p>
                    <p className="text-[11px] text-slate-500">Locks attempt submissions until starts_at</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={scheduleModal.isScheduled}
                    onChange={(e) => setScheduleModal({ ...scheduleModal, isScheduled: e.target.checked })}
                    className="w-5 h-5 rounded text-indigo-600 cursor-pointer"
                  />
                </div>

                {/* Date & Time Pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-zinc-300">Starts At (Date &amp; Time)</label>
                    <input
                      type="datetime-local"
                      value={scheduleModal.startsAt}
                      onChange={(e) => setScheduleModal({ ...scheduleModal, startsAt: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-zinc-300">Ends At (Date &amp; Time)</label>
                    <input
                      type="datetime-local"
                      value={scheduleModal.endsAt}
                      onChange={(e) => setScheduleModal({ ...scheduleModal, endsAt: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Window Label */}
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-700 dark:text-zinc-300">Window Label / Banner Text</label>
                  <input
                    type="text"
                    value={scheduleModal.windowLabel}
                    onChange={(e) => setScheduleModal({ ...scheduleModal, windowLabel: e.target.value })}
                    placeholder="e.g. Sunday All-India Live Mock"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 text-xs"
                  />
                </div>

                {/* Rules Toggles */}
                <div className="space-y-2 text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scheduleModal.lockLeaderboard}
                      onChange={(e) => setScheduleModal({ ...scheduleModal, lockLeaderboard: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                    <span>Lock Leaderboard Until Window Closes (prevents peeking at ranks)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={scheduleModal.allowPractice}
                      onChange={(e) => setScheduleModal({ ...scheduleModal, allowPractice: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                    <span>Allow Practice Attempts After Window Ends</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-zinc-800 pt-3">
                  <button
                    type="button"
                    onClick={() => handleClearSchedule(scheduleModal.testId)}
                    className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors"
                  >
                    Clear Schedule
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setScheduleModal(null)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-semibold hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSchedule}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all"
                    >
                      Save Schedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warning Confirmation Modal */}\n          {confirmModal && (`;

if (html.includes(confirmModalMarker)) {
  html = html.replace(confirmModalMarker, scheduleModalDialogCode);
  console.log('✅ Added Schedule Window Modal dialog to AdminDashboardView');
}

// ==============================================================================
// 4. UPDATE NelovMallickApp STATES, ROUTING & HOMEPAGE TEST CARDS
// ==============================================================================
// Add detailedConfigs and toppersSummaries states to NelovMallickApp
const appTestConfigsState = `const [testConfigs, setTestConfigs] = useState({
        'jee-advanced-pta-04': 'live',
        'jee-advanced-pta-05': 'live',
        'jee-advanced-pta-06': 'live'
      });`;

const appTestConfigsWithDetailed = `const [testConfigs, setTestConfigs] = useState({
        'jee-advanced-pta-04': 'live',
        'jee-advanced-pta-05': 'live',
        'jee-advanced-pta-06': 'live'
      });
      const [activeLeaderboardTestId, setActiveLeaderboardTestId] = useState('jee-advanced-pta-04');
      const [detailedConfigs, setDetailedConfigs] = useState({});
      const [toppersSummaries, setToppersSummaries] = useState([]);`;

if (html.includes(appTestConfigsState)) {
  html = html.replace(appTestConfigsState, appTestConfigsWithDetailed);
  console.log('✅ Added activeLeaderboardTestId, detailedConfigs & toppersSummaries states to NelovMallickApp');
}

// In NelovMallickApp useEffect, also fetch getTestConfigsDetails & getTestToppersSummary
const appLoadConfigsMarker = `        if (window.studentStorage?.getTestConfigs) {
          window.studentStorage.getTestConfigs().then(cfg => {
            if (cfg) setTestConfigs(cfg);
          });
        }`;

const appLoadConfigsEnhanced = `        if (window.studentStorage?.getTestConfigs) {
          window.studentStorage.getTestConfigs().then(cfg => {
            if (cfg) setTestConfigs(cfg);
          });
        }
        if (window.studentStorage?.getTestConfigsDetails) {
          window.studentStorage.getTestConfigsDetails().then(d => {
            const map = {};
            (d || []).forEach(item => { map[item.testId] = item; });
            setDetailedConfigs(map);
          });
        }
        if (window.studentStorage?.getTestToppersSummary) {
          window.studentStorage.getTestToppersSummary().then(s => setToppersSummaries(s || []));
        }`;

if (html.includes(appLoadConfigsMarker)) {
  html = html.replace(appLoadConfigsMarker, appLoadConfigsEnhanced);
  console.log('✅ Enhanced test config loader in NelovMallickApp');
}

// In handleHashRoute: handle #/leaderboard
const handleHashRouteMarker = `if (hash === '#/notebook' || hash === '#notebook') {`;
const leaderboardHashRoute = `if (hash === '#/leaderboard' || hash === '#leaderboard' || hash.startsWith('#/leaderboard/') || hash.startsWith('#leaderboard/')) {
          const parts = hash.split('/');
          if (parts.length > 2 && parts[2]) {
            setActiveLeaderboardTestId(parts[2]);
          }
          setView('leaderboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        if (hash === '#/notebook' || hash === '#notebook') {`;

if (html.includes(handleHashRouteMarker)) {
  html = html.replace(handleHashRouteMarker, leaderboardHashRoute);
  console.log('✅ Added #/leaderboard route to handleHashRoute');
}

// In handleSelectTest: add scheduled window start-time protection
const handleSelectTestCheckStatus = `        const configuredStatus = testConfigs[canonicalId] || (meta ? meta.status : 'live');
        if (configuredStatus === 'coming_soon') {`;

const handleSelectTestWithScheduleGuard = `        // Check Scheduled Mock Window start-time guard
        const sched = detailedConfigs[canonicalId];
        if (sched && sched.isScheduledWindow && sched.startsAt) {
          const startTime = new Date(sched.startsAt).getTime();
          const isAdmin = user.email && ['mallicknelov@gmail.com', 'nelovmallick@gmail.com'].includes(user.email.toLowerCase()) || user.role === 'admin';
          if (startTime > Date.now() && !isAdmin) {
            setNoticeModal({
              title: '⏰ Scheduled All-India Mock Window',
              message: \`This official mock test window opens on \${formatIST(sched.startsAt)}. Submissions will be unlocked for all candidates as soon as the test begins.\`,
              activeCategory: meta ? meta.examCategory : 'jee-advanced',
              isScheduled: true,
              startsAt: sched.startsAt
            });
            return;
          }
        }

        const configuredStatus = testConfigs[canonicalId] || (meta ? meta.status : 'live');
        if (configuredStatus === 'coming_soon') {`;

if (html.includes(handleSelectTestCheckStatus)) {
  html = html.replace(handleSelectTestCheckStatus, handleSelectTestWithScheduleGuard);
  console.log('✅ Added scheduled window start-time guard to handleSelectTest');
}

// In handleSubmitExam: record timeTakenSeconds
const handleSubmitExamMarker = `          completedAt: new Date().toISOString(),`;
const handleSubmitExamWithTime = `          timeTakenSeconds: 180 * 60 - timeLeft,
          completedAt: new Date().toISOString(),`;

if (html.includes(handleSubmitExamMarker)) {
  html = html.replace(handleSubmitExamMarker, handleSubmitExamWithTime);
  console.log('✅ Added timeTakenSeconds to handleSubmitExam in index.html');
}

// In Homepage: Add Live Toppers announcement strip above 10 Tests Grid
const testsGridMarker = `{/* 10 Tests Grid (Numbered PTA 01 -> PTA 10) */}`;
const testsGridWithToppersStrip = `{/* LIVE ALL-INDIA LEADERBOARDS & TOPPERS SHOWCASE STRIP */}
                <div className="max-w-6xl mx-auto p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-indigo-600/10 to-amber-500/15 border-2 border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white text-xl flex items-center justify-center font-black shadow-md shadow-amber-500/30">
                      🏆
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900 dark:text-zinc-50">
                          Supabase Live All-India CBT Leaderboard
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-500 text-white">
                          Live &amp; Verified
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400">
                        1st-attempt official rankings, exact marks, and official NTA percentiles mentored by Nelov Mallick (IIT Delhi).
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setView('leaderboard');
                      window.location.hash = '#/leaderboard';
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md shadow-amber-500/30 transition-all flex items-center gap-1.5 shrink-0 hover:scale-105"
                  >
                    <span>View All Toppers &amp; Standings</span>
                    <span>→</span>
                  </button>
                </div>

                {/* 10 Tests Grid (Numbered PTA 01 -> PTA 10) */}`;

if (html.includes(testsGridMarker)) {
  html = html.replace(testsGridMarker, testsGridWithToppersStrip);
  console.log('✅ Added Live Toppers showcase strip above tests grid');
}

// In Homepage test cards: replace static badge with MockWindowBadge & add Topper mini-strip + Leaderboard CTA
const testCardBadgeOld = `{isLive ? (
                              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                Live Now · Free
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                                Coming Soon
                              </span>
                            )}`;

const testCardBadgeNew = `<MockWindowBadge
                              isScheduled={detailedConfigs[t.id]?.isScheduledWindow}
                              startsAt={detailedConfigs[t.id]?.startsAt}
                              endsAt={detailedConfigs[t.id]?.endsAt}
                              windowLabel={detailedConfigs[t.id]?.windowLabel}
                              isLive={isLive}
                              allowPractice={detailedConfigs[t.id]?.allowPracticeAfterEnd ?? true}
                            />`;

if (html.includes(testCardBadgeOld)) {
  html = html.replace(testCardBadgeOld, testCardBadgeNew);
  console.log('✅ Updated test card badges to MockWindowBadge');
}

// In Homepage test cards: Add Topper mini-strip and View Leaderboard button
const testCardCtaOld = `{/* Card CTA */}
                        <div className="pt-6">
                          {isLive ? (
                            <button
                              type="button"
                              onClick={() => handleSelectTest(t.id)}
                              className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
                            >
                              <span>Attempt Test Free</span>
                              <span>→</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSelectTest(t.id)}
                              className="w-full py-3 rounded-xl font-semibold text-xs border border-slate-200 dark:border-zinc-700 text-slate-400 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                              Coming Soon · Upload Slot
                            </button>
                          )}
                        </div>`;

const testCardCtaNew = `{/* Toppers Mini-Strip */}
                          {(() => {
                            const summary = toppersSummaries.find(s => s.testId === t.id);
                            if (!summary || !summary.topper_name || summary.is_locked) return null;
                            return (
                              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="text-amber-500 shrink-0">🏆</span>
                                  <span className="font-bold text-slate-800 dark:text-zinc-200 truncate">
                                    Topper: {summary.topper_name}
                                  </span>
                                </div>
                                <span className="font-mono font-extrabold text-amber-600 dark:text-amber-400 shrink-0">
                                  {summary.topper_marks}/{summary.max_marks} ({summary.topper_percentile}%ile)
                                </span>
                              </div>
                            );
                          })()}

                        {/* Card CTA */}
                        <div className="pt-6 space-y-2">
                          {isLive ? (
                            <button
                              type="button"
                              onClick={() => handleSelectTest(t.id)}
                              className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
                            >
                              <span>Attempt Test Free</span>
                              <span>→</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSelectTest(t.id)}
                              className="w-full py-3 rounded-xl font-semibold text-xs border border-slate-200 dark:border-zinc-700 text-slate-400 dark:text-zinc-500 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                              Coming Soon · Upload Slot
                            </button>
                          )}

                          {isLive && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveLeaderboardTestId(t.id);
                                setView('leaderboard');
                                window.location.hash = \`#/leaderboard/\${t.id}\`;
                              }}
                              className="w-full py-2 rounded-xl font-bold text-xs border border-amber-300 dark:border-amber-700/60 bg-amber-50/60 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/40 transition-colors flex items-center justify-center gap-1.5"
                            >
                              <span>🏆 View Leaderboard &amp; Toppers</span>
                            </button>
                          )}
                        </div>`;

if (html.includes(testCardCtaOld)) {
  html = html.replace(testCardCtaOld, testCardCtaNew);
  console.log('✅ Added Topper mini-strip and View Leaderboard button to test cards');
}

// In NelovMallickApp view rendering: add Leaderboard View
const viewAccountMarker = `      if (view === 'account') {
        return (
          <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-50 font-sans transition-colors duration-200">
            <MainNavbar
              currentUser={currentUser}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              isDark={isDark}
              setIsDark={setIsDark}
              openAuth={openAuth}
              handleLogOut={handleLogOut}
              setView={setView}
              view={view}
              userDropdownOpen={userDropdownOpen}
              setUserDropdownOpen={setUserDropdownOpen}
            />
            <AccountPrivacyView
              currentUser={currentUser}
              setView={setView}
              openAuth={openAuth}
              onLogOut={handleLogOut}
            />
            <PlatformFooter onOpenAuth={openAuth} />
            <AuthModalDialog
              isOpen={authModal.isOpen}
              mode={authModal.mode}
              redirectUrl={authModal.redirectUrl}
              message={authModal.message}
              onClose={closeAuth}
              onAuthSuccess={handleAuthSuccess}
            />
            <StorageNoticeBanner />
          </div>
        );
      }`;

const viewLeaderboardWithAccount = `${viewAccountMarker}

      if (view === 'leaderboard') {
        return (
          <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] text-slate-900 dark:text-zinc-50 font-sans transition-colors duration-200">
            <MainNavbar
              currentUser={currentUser}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              isDark={isDark}
              setIsDark={setIsDark}
              openAuth={openAuth}
              handleLogOut={handleLogOut}
              setView={setView}
              view={view}
              userDropdownOpen={userDropdownOpen}
              setUserDropdownOpen={setUserDropdownOpen}
            />
            <LeaderboardView
              currentUser={currentUser}
              setView={setView}
              openAuth={openAuth}
              initialTestId={activeLeaderboardTestId || 'jee-advanced-pta-04'}
              handleSelectTest={handleSelectTest}
              testConfigs={testConfigs}
              detailedConfigs={detailedConfigs}
            />
            <PlatformFooter onOpenAuth={openAuth} />
            <AuthModalDialog
              isOpen={authModal.isOpen}
              mode={authModal.mode}
              redirectUrl={authModal.redirectUrl}
              message={authModal.message}
              onClose={closeAuth}
              onAuthSuccess={handleAuthSuccess}
            />
            <StorageNoticeBanner />
          </div>
        );
      }`;

if (html.includes(viewAccountMarker)) {
  html = html.replace(viewAccountMarker, viewLeaderboardWithAccount);
  console.log('✅ Added view === leaderboard routing block');
}

// In view === 'admin', pass detailedConfigs & setDetailedConfigs
const adminCallOld = `<AdminDashboardView
              currentUser={currentUser}
              setView={setView}
              testConfigs={testConfigs}
              setTestConfigs={setTestConfigs}
            />`;

const adminCallNew = `<AdminDashboardView
              currentUser={currentUser}
              setView={setView}
              testConfigs={testConfigs}
              setTestConfigs={setTestConfigs}
              detailedConfigs={detailedConfigs}
              setDetailedConfigs={setDetailedConfigs}
            />`;

if (html.includes(adminCallOld)) {
  html = html.replace(adminCallOld, adminCallNew);
  console.log('✅ Passed detailedConfigs to AdminDashboardView in NelovMallickApp');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✅ Successfully patched index.html with all Leaderboard & Scheduled Windows features!');
