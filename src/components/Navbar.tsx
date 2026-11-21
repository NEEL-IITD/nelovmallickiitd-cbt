import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  onNavigate?: (hash: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDark,
  toggleTheme,
  onNavigate,
}) => {
  const { user, isAuthenticated, isAdmin, logOut, openAuthModal } = useAuth();
  
  // Navigation State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSectionOpen, setMobileSectionOpen] = useState<string | null>('tests');
  
  const navContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Dropdown hover helpers with slight grace timeout
  const handleMouseEnter = (dropdownName: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const handleDropdownToggle = (dropdownName: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  const navigateTo = (hash: string, requiresAuth = false, authMsg?: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);

    if (requiresAuth && !isAuthenticated) {
      openAuthModal('login', hash, authMsg || 'Sign in or create a free account to access your personal study tools.');
      return;
    }

    if (onNavigate) {
      onNavigate(hash);
    } else {
      window.location.hash = hash;
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full" ref={navContainerRef}>
      {/* Top accent bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500" />

      {/* Main Single-Row Navigation Bar */}
      <nav className="w-full backdrop-blur-md bg-white/95 dark:bg-[#0a0a0c]/95 border-b border-slate-200/80 dark:border-zinc-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* 1. Brand Logo */}
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('#/');
            }}
            className="flex items-center gap-2.5 group shrink-0 select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              NM
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-1 leading-none">
                Nelov <span className="text-indigo-600 dark:text-indigo-400">Mallick</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-400 mt-1 leading-none">
                JEE Mains &amp; Advanced · Free CBT
              </span>
            </div>
          </a>

          {/* 2. Desktop Navigation: 5 Clean Consolidated Links */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-xs xl:text-sm font-semibold text-slate-700 dark:text-zinc-300">
            
            {/* DROPDOWN 1: Mock Tests */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('tests')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => handleDropdownToggle('tests')}
                aria-expanded={activeDropdown === 'tests'}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeDropdown === 'tests'
                    ? 'bg-slate-100 dark:bg-zinc-800/80 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <span>Mock Tests</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  3 Live
                </span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'tests' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'tests' && (
                <div className="absolute left-0 mt-1.5 w-72 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#111218] p-2 shadow-2xl z-50 text-xs animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                    JEE Computer-Based Tests
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo('#tests')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/70 text-left transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <span>JEE Advanced</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          3 Live
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">PTA 01–10 authentic mock series</p>
                    </div>
                    <span className="text-slate-400">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('#tests')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/70 text-left transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <span>JEE Mains</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          20 Tests
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">PTM 01–20 full mock series</p>
                    </div>
                    <span className="text-slate-400">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('#/schedule')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <span>🗓️ 2027 PTM Schedule</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          20 Tests
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">3D Interactive Jan 2027 Calendar</p>
                    </div>
                    <span className="text-indigo-500">→</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-zinc-800/80" />
                  <button
                    type="button"
                    onClick={() => navigateTo('#/leaderboard')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/30 text-left transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <span>🏆 Live Leaderboard</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                          Toppers
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">1st-attempt official ranks &amp; percentiles</p>
                    </div>
                    <span className="text-amber-500">→</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-zinc-800/80" />
                  <div className="px-3 py-1.5 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                    Quick Launch Live Tests
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo('#/test/jee-advanced/pta-04')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left text-slate-700 dark:text-zinc-300 font-semibold"
                  >
                    <span>PTA 04 Full Mock (57 Qs)</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">180 Mks</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('#/test/jee-advanced/pta-05')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left text-slate-700 dark:text-zinc-300 font-semibold"
                  >
                    <span>PTA 05 Full Mock (54 Qs)</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">180 Mks</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('#/test/jee-advanced/pta-06')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-left text-emerald-700 dark:text-emerald-300 font-bold"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>PTA 06 Full Mock</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500 text-white font-extrabold">New</span>
                    </span>
                    <span className="text-[10px]">180 Mks →</span>
                  </button>
                </div>
              )}
            </div>

            {/* DIRECT LINK 2: Lectures */}
            <button
              type="button"
              onClick={() => navigateTo('#/lectures')}
              className="px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-red-600 dark:hover:text-red-400 whitespace-nowrap"
            >
              <span>Lectures</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                New
              </span>
            </button>

            {/* DROPDOWN 3: Resources Vault */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('resources')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => handleDropdownToggle('resources')}
                aria-expanded={activeDropdown === 'resources'}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeDropdown === 'resources'
                    ? 'bg-slate-100 dark:bg-zinc-800/80 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <span>Resources</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  83 Ch
                </span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'resources' && (
                <div className="absolute left-0 mt-1.5 w-72 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#111218] p-2 shadow-2xl z-50 text-xs animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                    Chapter Vaults &amp; Formula Books
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo('#/resources')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/70 text-left transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-zinc-100">All Study Resources</div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">Complete formula books &amp; syllabus sheets</p>
                    </div>
                    <span className="text-slate-400">→</span>
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-zinc-800/80" />

                  <button
                    type="button"
                    onClick={() => navigateTo('#/resources/physics')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">⚛️</span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-zinc-100">Physics Vault</div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400">Mechanics, Electrodynamics &amp; Modern</p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      28 Ch
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('#/resources/chemistry')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">🧪</span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-zinc-100">Chemistry Vault</div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400">Physical, Organic &amp; Inorganic</p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                      29 Ch
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('#/resources/mathematics')}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-950/40 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">📐</span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-zinc-100">Mathematics Vault</div>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400">Calculus, Algebra, Vectors &amp; Conics</p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300">
                      26 Ch
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* DROPDOWN 4: Dashboard / My Study */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('dashboard')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => handleDropdownToggle('dashboard')}
                aria-expanded={activeDropdown === 'dashboard'}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeDropdown === 'dashboard'
                    ? 'bg-slate-100 dark:bg-zinc-800/80 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <span>Dashboard</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'dashboard' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'dashboard' && (
                <div className="absolute left-0 mt-1.5 w-64 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#111218] p-2 shadow-2xl z-50 text-xs animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                    Personal Study Tools
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo('#/progress', true, 'Sign in or create a free account to view your My Progress diagnostic scorecard.')}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/70 text-left transition-colors"
                  >
                    <span className="text-base">📊</span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-zinc-100">My Progress</div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">Scorecard &amp; accuracy diagnostics</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('#/notebook', true, 'Sign in or create a free account to access your personal Revision Notebook.')}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/70 text-left transition-colors"
                  >
                    <span className="text-base">⭐</span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-zinc-100">Revision Notebook</div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">Bookmarked questions &amp; derivations</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('#ranks')}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/70 text-left transition-colors"
                  >
                    <span className="text-base">🏆</span>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-zinc-100">Rank Insights</div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400">Percentile curve &amp; cutoff models</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* DROPDOWN 5: More */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter('more')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => handleDropdownToggle('more')}
                aria-expanded={activeDropdown === 'more'}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeDropdown === 'more'
                    ? 'bg-slate-100 dark:bg-zinc-800/80 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-zinc-800/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <span>More</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'more' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'more' && (
                <div className="absolute left-0 mt-1.5 w-60 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#111218] p-2 shadow-2xl z-50 text-xs animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-2 text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
                    Mentorship &amp; Community
                  </div>

                  <button
                    type="button"
                    onClick={() => navigateTo('#mentorship')}
                    className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/70 text-left text-slate-700 dark:text-zinc-300 font-semibold transition-colors"
                  >
                    <span>👨‍🏫</span> Mentorship by Nelov Mallick
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('#faq')}
                    className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/70 text-left text-slate-700 dark:text-zinc-300 font-semibold transition-colors"
                  >
                    <span>❓</span> FAQs
                  </button>

                  <div className="my-1 border-t border-slate-100 dark:border-zinc-800/80" />

                  <a
                    href="https://www.youtube.com/@nelovmallickiitd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-left text-slate-700 dark:text-zinc-300 font-semibold transition-colors"
                  >
                    <span className="text-red-500">▶</span> YouTube Channel
                  </a>

                  <a
                    href="https://www.instagram.com/nelovmallickiitd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-950/30 text-left text-slate-700 dark:text-zinc-300 font-semibold transition-colors"
                  >
                    <span className="text-pink-500">📸</span> Instagram Updates
                  </a>
                </div>
              )}
            </div>

          </div>

          {/* 3. Right Controls: Theme + Auth (Always Single Row, Clean Spacing) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/70 transition-colors shrink-0"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="text-sm select-none">{isDark ? '☀️' : '🌙'}</span>
            </button>

            {/* Authenticated User Menu or Log In / Sign Up Buttons */}
            {isAuthenticated && user ? (
              <div
                className="relative shrink-0"
                onMouseEnter={() => handleMouseEnter('user')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => handleDropdownToggle('user')}
                  aria-expanded={activeDropdown === 'user'}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/30 text-slate-900 dark:text-zinc-100 hover:border-indigo-400 transition-all text-xs font-bold whitespace-nowrap"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                    {getInitials(user.name)}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <svg
                    className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${activeDropdown === 'user' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeDropdown === 'user' && (
                  <div className="absolute right-0 mt-1.5 w-56 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-2 shadow-2xl z-50 text-xs space-y-1 animate-in fade-in slide-in-from-top-1">
                    <div className="p-2.5 border-b border-slate-100 dark:border-zinc-800/80">
                      <p className="font-extrabold text-slate-900 dark:text-zinc-100 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                        {user.email || (user.contactNumber ? `📞 ${user.contactNumber}` : 'Student Aspirant')}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                          {user.targetExam || 'JEE Advanced'}
                        </span>
                        {(user.role === 'admin' || isAdmin) && (
                          <span className="inline-block px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[9px] font-bold">
                            🛡️ Admin
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigateTo('#/progress')}
                      className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 font-semibold text-left transition-colors"
                    >
                      <span>📊</span> My Progress
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('#/notebook')}
                      className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 font-semibold text-left transition-colors"
                    >
                      <span>⭐</span> Revision Notebook
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateTo('#/account')}
                      className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 font-semibold text-left transition-colors"
                    >
                      <span>👤</span> Account &amp; Privacy
                    </button>

                    {(user.role === 'admin' || isAdmin) && (
                      <button
                        type="button"
                        onClick={() => navigateTo('#/admin')}
                        className="w-full flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-left transition-colors"
                      >
                        <span>🛡️</span> Admin Panel
                      </button>
                    )}

                    <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDropdown(null);
                          logOut();
                          window.location.hash = '#/';
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-left transition-colors"
                      >
                        <span>🚪</span> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-colors whitespace-nowrap"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="px-3.5 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
                >
                  Sign Up Free
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-colors shrink-0"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>

        {/* 4. Responsive Mobile Drawer (< 1024px / lg) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-zinc-800 bg-white/98 dark:bg-[#0c0d12]/98 backdrop-blur-xl p-4 space-y-3 max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2">
            
            {/* Accordion 1: Mock Tests */}
            <div className="border border-slate-200/80 dark:border-zinc-800 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileSectionOpen(mobileSectionOpen === 'tests' ? null : 'tests')}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-900/60 text-xs font-bold text-slate-800 dark:text-zinc-200"
              >
                <span className="flex items-center gap-2">
                  <span>📝</span> Mock Tests
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold">3 Live</span>
                </span>
                <span>{mobileSectionOpen === 'tests' ? '▲' : '▼'}</span>
              </button>
              {mobileSectionOpen === 'tests' && (
                <div className="p-2 space-y-1 bg-white dark:bg-[#111218]">
                  <button
                    type="button"
                    onClick={() => navigateTo('#tests')}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-between"
                  >
                    <span>JEE Advanced (PTA 01–10)</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">3 Live</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('#tests')}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center justify-between"
                  >
                    <span>JEE Mains (PTM 01–20)</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">20 Tests</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('#/schedule')}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 flex items-center justify-between"
                  >
                    <span>🗓️ 2027 PTM Schedule</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">20 Tests →</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('#/leaderboard')}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <span>🏆</span>
                      <span>Live Leaderboard</span>
                    </span>
                    <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-extrabold">Toppers →</span>
                  </button>
                  <div className="pt-1 border-t border-slate-100 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => navigateTo('#/test/jee-advanced/pta-04')}
                      className="w-full text-left py-1.5 px-3 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                    >
                      ▶ Start PTA 04 Full Mock (180 Mks)
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('#/test/jee-advanced/pta-05')}
                      className="w-full text-left py-1.5 px-3 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                    >
                      ▶ Start PTA 05 Full Mock (180 Mks)
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('#/test/jee-advanced/pta-06')}
                      className="w-full text-left py-1.5 px-3 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    >
                      ▶ Start PTA 06 Full Mock (New)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct: Video Lectures */}
            <button
              type="button"
              onClick={() => navigateTo('#/lectures')}
              className="w-full text-left p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-[#111218] text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-zinc-800"
            >
              <span className="flex items-center gap-2">
                <span>▶</span> Video Lectures &amp; Masterclasses
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                New
              </span>
            </button>

            {/* Accordion 2: Chapter Vaults & Resources */}
            <div className="border border-slate-200/80 dark:border-zinc-800 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileSectionOpen(mobileSectionOpen === 'resources' ? null : 'resources')}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-900/60 text-xs font-bold text-slate-800 dark:text-zinc-200"
              >
                <span className="flex items-center gap-2">
                  <span>📚</span> Study Resources &amp; Vaults
                </span>
                <span>{mobileSectionOpen === 'resources' ? '▲' : '▼'}</span>
              </button>
              {mobileSectionOpen === 'resources' && (
                <div className="p-2 space-y-1 bg-white dark:bg-[#111218]">
                  <button
                    type="button"
                    onClick={() => navigateTo('#/resources')}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                  >
                    All Formula Books &amp; Study Resources
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('#/resources/physics')}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-between"
                  >
                    <span>⚛️ Physics Vault</span>
                    <span className="text-[10px] font-bold">28 Ch</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('#/resources/chemistry')}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-between"
                  >
                    <span>🧪 Chemistry Vault</span>
                    <span className="text-[10px] font-bold">29 Ch</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('#/resources/mathematics')}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/40 flex items-center justify-between"
                  >
                    <span>📐 Mathematics Vault</span>
                    <span className="text-[10px] font-bold">26 Ch</span>
                  </button>
                </div>
              )}
            </div>

            {/* Accordion 3: Student Study Tools */}
            <div className="border border-slate-200/80 dark:border-zinc-800 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileSectionOpen(mobileSectionOpen === 'study' ? null : 'study')}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-900/60 text-xs font-bold text-slate-800 dark:text-zinc-200"
              >
                <span className="flex items-center gap-2">
                  <span>🎯</span> My Study Tools
                </span>
                <span>{mobileSectionOpen === 'study' ? '▲' : '▼'}</span>
              </button>
              {mobileSectionOpen === 'study' && (
                <div className="p-2 space-y-1 bg-white dark:bg-[#111218]">
                  <button
                    type="button"
                    onClick={() => navigateTo('#/progress', true, 'Sign in or create a free account to track your test history.')}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <span>📊</span> My Progress &amp; Diagnostics
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('#/notebook', true, 'Sign in or create a free account to view your bookmarked questions.')}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <span>⭐</span> Revision Notebook
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('#ranks')}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                  >
                    <span>🏆</span> Rank Insights
                  </button>
                </div>
              )}
            </div>

            {/* Accordion 4: Mentorship & FAQs */}
            <div className="border border-slate-200/80 dark:border-zinc-800 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setMobileSectionOpen(mobileSectionOpen === 'more' ? null : 'more')}
                className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-900/60 text-xs font-bold text-slate-800 dark:text-zinc-200"
              >
                <span className="flex items-center gap-2">
                  <span>💡</span> Mentorship &amp; FAQs
                </span>
                <span>{mobileSectionOpen === 'more' ? '▲' : '▼'}</span>
              </button>
              {mobileSectionOpen === 'more' && (
                <div className="p-2 space-y-1 bg-white dark:bg-[#111218]">
                  <button
                    type="button"
                    onClick={() => navigateTo('#mentorship')}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                  >
                    👨‍🏫 Mentorship by Nelov Mallick
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateTo('#faq')}
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                  >
                    ❓ FAQs
                  </button>
                  <a
                    href="https://www.youtube.com/@nelovmallickiitd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2"
                  >
                    <span>▶</span> YouTube Lectures Channel
                  </a>
                  <a
                    href="https://www.instagram.com/nelovmallickiitd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/30 flex items-center gap-2"
                  >
                    <span>📸</span> Instagram Updates
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Auth Actions */}
            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-xs">
                    <p className="font-bold text-slate-900 dark:text-zinc-100">{user.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {user.email || (user.contactNumber ? `📞 ${user.contactNumber}` : 'Student Aspirant')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateTo('#/account')}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-xs text-left flex items-center gap-2"
                  >
                    <span>👤</span> Account &amp; Privacy
                  </button>
                  {(user.role === 'admin' || isAdmin) && (
                    <button
                      type="button"
                      onClick={() => navigateTo('#/admin')}
                      className="w-full py-2.5 px-3 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs text-left flex items-center gap-2"
                    >
                      <span>🛡️</span> Admin Dashboard
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logOut();
                      window.location.hash = '#/';
                    }}
                    className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-bold text-xs"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 font-bold text-xs"
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('signup');
                    }}
                    className="py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs shadow-md"
                  >
                    Sign Up Free
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </nav>
    </header>
  );
};
