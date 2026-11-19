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
  const { user, isAuthenticated, logOut, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#/' },
    { name: 'JEE Advanced (PTA 01–10)', href: '#/tests/jee-advanced' },
    { name: 'JEE Mains (PTA 01–10)', href: '#/tests/jee-mains' },
    { name: 'Live Tests', href: '#/test/jee-advanced/pta-04' },
    { name: 'My Progress', href: '#/progress', protected: true },
    { name: 'Revision Notebook', href: '#/notebook', protected: true },
    { name: 'Rank Insights', href: '#ranks' },
    { name: 'FAQs', href: '#faq' },
  ];

  const handleLinkClick = (link: typeof navLinks[0]) => {
    setMobileMenuOpen(false);
    if (link.protected && !isAuthenticated) {
      openAuthModal('login', link.href, 'Sign in or create a free account to access your personal study tools.');
      return;
    }
    if (onNavigate) {
      onNavigate(link.href);
    } else {
      window.location.hash = link.href;
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
    <header className="sticky top-0 z-50 w-full">
      <div className="h-[2.5px] w-full bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500" />

      <nav className="w-full backdrop-blur-md bg-white/90 dark:bg-[#0a0a0c]/90 border-b border-slate-200/80 dark:border-zinc-800/80 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#/" onClick={() => onNavigate?.('#/')} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              NM
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-zinc-950 dark:text-zinc-50 flex items-center gap-1">
                NelovMallick<span className="text-indigo-600 dark:text-indigo-400">IITD</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-zinc-400 -mt-1">
                JEE Mains & Advanced · 100% Free CBT
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-5">
            {navLinks.map((link, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLinkClick(link)}
                className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400 transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right Controls: Theme + Auth State */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="hidden md:inline-flex px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              100% Free
            </span>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800/60 transition-colors"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Auth Buttons / Profile Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/30 text-slate-900 dark:text-zinc-100 hover:border-indigo-400 transition-all text-xs font-bold"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                    {getInitials(user.name)}
                  </div>
                  <span className="hidden sm:inline max-w-[110px] truncate">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-400">▼</span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#121318] p-2 shadow-2xl z-50 text-xs space-y-1">
                    <div className="p-2.5 border-b border-slate-100 dark:border-zinc-800/80">
                      <p className="font-extrabold text-slate-900 dark:text-zinc-100 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                        {user.targetExam || 'JEE Advanced'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setUserDropdownOpen(false); onNavigate?.('#/progress') || (window.location.hash = '#/progress'); }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 font-semibold text-left transition-colors"
                    >
                      <span>📊</span> My Progress
                    </button>

                    <button
                      type="button"
                      onClick={() => { setUserDropdownOpen(false); onNavigate?.('#/notebook') || (window.location.hash = '#/notebook'); }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 font-semibold text-left transition-colors"
                    >
                      <span>⭐</span> Revision Notebook
                    </button>

                    {user.role === 'admin' && (
                      <button
                        type="button"
                        onClick={() => { setUserDropdownOpen(false); onNavigate?.('#/admin') || (window.location.hash = '#/admin'); }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-left transition-colors"
                      >
                        <span>🛡️</span> Admin Panel
                      </button>
                    )}

                    <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-1">
                      <button
                        type="button"
                        onClick={() => { setUserDropdownOpen(false); logOut(); window.location.hash = '#/'; }}
                        className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-left transition-colors"
                      >
                        <span>🚪</span> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="px-3.5 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md shadow-indigo-600/25 transition-all hover:scale-105 active:scale-95"
                >
                  Sign Up Free
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0c0d12] p-4 space-y-3 animate-in slide-in-from-top-2">
            <div className="space-y-1">
              {navLinks.map((link, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLinkClick(link)}
                  className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-xs">
                    <p className="font-bold text-slate-900 dark:text-zinc-100">{user.name}</p>
                    <p className="text-[11px] text-slate-500">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <button
                      type="button"
                      onClick={() => { setMobileMenuOpen(false); onNavigate?.('#/admin') || (window.location.hash = '#/admin'); }}
                      className="w-full py-2.5 px-3 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-xs text-left flex items-center gap-2"
                    >
                      <span>🛡️</span> Admin Dashboard
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setMobileMenuOpen(false); logOut(); window.location.hash = '#/'; }}
                    className="w-full py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-bold text-xs"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                    className="py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-200 font-bold text-xs"
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMobileMenuOpen(false); openAuthModal('signup'); }}
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
