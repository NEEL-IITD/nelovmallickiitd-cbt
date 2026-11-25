// ==============================================================================
// NelovMallickIITD CBT Platform - AuthContext & Route Guards
// Supports Supabase Auth, Google OAuth, ProtectedRoute, and AdminRoute
// Mentored by Nelov Mallick (IIT Delhi) · 100% Free Forever
// ==============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, authService, LogInParams, SignUpParams, TargetExam } from '../services/authService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { cloudSyncService } from '../services/cloudSyncService';

export interface AuthModalState {
  isOpen: boolean;
  mode: 'login' | 'signup' | 'forgot' | 'recovery';
  redirectUrl?: string;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isCloudConnected: boolean;
  logIn: (params: LogInParams) => Promise<User>;
  signUp: (params: SignUpParams) => Promise<User>;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  logOut: () => Promise<void>;
  updateProfile: (updates: { name?: string; targetExam?: TargetExam; dailyQuestionGoal?: number; avatarUrl?: string | null }) => Promise<User>;
  continueAsGuest: () => Promise<void>;
  acceptTerms: (version?: string, parentalConsent?: boolean) => Promise<User | null>;
  deleteMyAccount: () => Promise<void>;
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot' | 'recovery', redirectUrl?: string, message?: string) => void;
  closeAuthModal: () => void;
  authModalState: AuthModalState;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalState, setAuthModalState] = useState<AuthModalState>({
    isOpen: false,
    mode: 'login',
  });

  // Handle initial auth & listen for Supabase auth state changes
  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      // 1. If Supabase is active, check current session
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            const isPhone = Boolean(session.user.email?.endsWith('@phone.nelovportal.local'));
            let role: 'student' | 'admin' = 'student';
            let fullName = session.user.user_metadata?.full_name || (isPhone ? 'Student Aspirant' : session.user.email?.split('@')[0]) || 'Student';
            let targetExam = session.user.user_metadata?.target_exam || 'JEE Advanced';
            let contactNumber = session.user.user_metadata?.contact_number || null;
            let authMethod = isPhone ? 'phone' : (session.user.app_metadata?.provider === 'google' ? 'google' : 'gmail');
            let displayEmail = isPhone ? null : (session.user.email || null);

            const now = new Date().toISOString();
            const localConsent = typeof window !== 'undefined' ? localStorage.getItem(`consent_v2026_11_${session.user.id}`) : null;
            let acceptedTermsAt = session.user.user_metadata?.accepted_terms_at || localConsent || now;
            let acceptedTermsVersion = session.user.user_metadata?.accepted_terms_version || '2026-11';
            let parentalConsentConfirmed = session.user.user_metadata?.parental_consent_confirmed !== undefined ? Boolean(session.user.user_metadata?.parental_consent_confirmed) : true;

            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

              if (profile) {
                if (profile.role === 'admin') role = 'admin';
                if (profile.full_name) fullName = profile.full_name;
                if (profile.contact_number) contactNumber = profile.contact_number;
                if (profile.auth_method) authMethod = profile.auth_method;
                if (profile.target_exam) {
                  targetExam = (profile.target_exam === 'Both' && session.user.user_metadata?.preferred_exam)
                    ? session.user.user_metadata.preferred_exam
                    : profile.target_exam;
                }
                if (profile.accepted_terms_at) acceptedTermsAt = profile.accepted_terms_at;
                if (profile.accepted_terms_version) acceptedTermsVersion = profile.accepted_terms_version;
                if (profile.parental_consent_confirmed !== undefined && profile.parental_consent_confirmed !== null) {
                  parentalConsentConfirmed = Boolean(profile.parental_consent_confirmed);
                }
                if (profile.email && !profile.email.endsWith('@phone.nelovportal.local')) {
                  displayEmail = profile.email;
                }
              }

              // Silently ensure consent is recorded in local storage
              if (typeof window !== 'undefined') {
                try {
                  localStorage.setItem(`consent_v2026_11_${session.user.id}`, acceptedTermsAt);
                } catch (e) {}
              }

              // Self-healing: ensure profile row exists without escalating role from client email
              const targetRole = role;
              if (targetRole === 'admin') role = 'admin';

              if (!profile) {
                Promise.resolve(supabase.from('profiles').upsert({
                  id: session.user.id,
                  full_name: fullName,
                  email: displayEmail,
                  contact_number: contactNumber,
                  auth_method: authMethod === 'email' ? 'gmail' : authMethod,
                  target_exam: targetExam === 'JEE 2027' ? 'Both' : targetExam,
                  role: 'student',
                  accepted_terms_at: acceptedTermsAt,
                  accepted_terms_version: acceptedTermsVersion,
                  parental_consent_confirmed: parentalConsentConfirmed,
                  last_login_at: new Date().toISOString()
                }, { onConflict: 'id', ignoreDuplicates: true })).catch(() => {});
              } else if (!profile.accepted_terms_at) {
                Promise.resolve(supabase.from('profiles').update({
                  accepted_terms_at: acceptedTermsAt,
                  accepted_terms_version: acceptedTermsVersion,
                  parental_consent_confirmed: parentalConsentConfirmed
                }).eq('id', session.user.id)).catch(() => {});
              }
            } catch (err) {
              console.warn('Profile fetch/sync error:', err);
            }

            const currentUser: User = {
              id: session.user.id,
              name: fullName,
              email: displayEmail,
              contactNumber,
              authMethod: authMethod as any,
              targetExam,
              dailyQuestionGoal: Number(session.user.user_metadata?.daily_question_goal || 30),
              role,
              acceptedTermsAt,
              acceptedTermsVersion,
              parentalConsentConfirmed,
              createdAt: session.user.created_at || new Date().toISOString()
            };

            setUser(currentUser);
            localStorage.setItem('nelov_active_session', JSON.stringify(currentUser));
            cloudSyncService.hydrateAndMigrateOnLogin(currentUser).catch(() => {});

            // Check if there was an OAuth redirect destination
            const savedRedirect = sessionStorage.getItem('nelov_auth_redirect');
            if (savedRedirect) {
              sessionStorage.removeItem('nelov_auth_redirect');
              if (window.location.hash !== savedRedirect) {
                window.location.hash = savedRedirect;
              }
            }

            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Error fetching Supabase session:', e);
        }
      }

      // 2. Fall back to local storage session
      if (mounted) {
        const localUser = authService.getCurrentUser();
        setUser(localUser);
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscribe to Supabase auth events (e.g., OAuth sign in callback)
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        const isPasswordRecovery = event === 'PASSWORD_RECOVERY';
        if ((isPasswordRecovery || event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') && session?.user) {
          const isPhone = Boolean(session.user.email?.endsWith('@phone.nelovportal.local'));
          let role: 'student' | 'admin' = 'student';
          let fullName = session.user.user_metadata?.full_name || (isPhone ? 'Student Aspirant' : session.user.email?.split('@')[0]) || 'Student';
          let targetExam = session.user.user_metadata?.target_exam || 'JEE Advanced';
          let contactNumber = session.user.user_metadata?.contact_number || null;
          let authMethod = isPhone ? 'phone' : (session.user.app_metadata?.provider === 'google' ? 'google' : 'gmail');
          let displayEmail = isPhone ? null : (session.user.email || null);

          const now = new Date().toISOString();
          const localConsent = typeof window !== 'undefined' ? localStorage.getItem(`consent_v2026_11_${session.user.id}`) : null;
          let acceptedTermsAt = session.user.user_metadata?.accepted_terms_at || localConsent || now;
          let acceptedTermsVersion = session.user.user_metadata?.accepted_terms_version || '2026-11';
          let parentalConsentConfirmed = session.user.user_metadata?.parental_consent_confirmed !== undefined ? Boolean(session.user.user_metadata?.parental_consent_confirmed) : true;

          try {
            if (supabase) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

              if (profile) {
                if (profile.role === 'admin') role = 'admin';
                if (profile.full_name) fullName = profile.full_name;
                if (profile.contact_number) contactNumber = profile.contact_number;
                if (profile.auth_method) authMethod = profile.auth_method;
                if (profile.target_exam) {
                  targetExam = (profile.target_exam === 'Both' && session.user.user_metadata?.preferred_exam)
                    ? session.user.user_metadata.preferred_exam
                    : profile.target_exam;
                }
                if (profile.accepted_terms_at) acceptedTermsAt = profile.accepted_terms_at;
                if (profile.accepted_terms_version) acceptedTermsVersion = profile.accepted_terms_version;
                if (profile.parental_consent_confirmed !== undefined && profile.parental_consent_confirmed !== null) {
                  parentalConsentConfirmed = Boolean(profile.parental_consent_confirmed);
                }
                if (profile.email && !profile.email.endsWith('@phone.nelovportal.local')) {
                  displayEmail = profile.email;
                }
              }

              // Silently ensure consent is recorded in local storage
              if (typeof window !== 'undefined') {
                try {
                  localStorage.setItem(`consent_v2026_11_${session.user.id}`, acceptedTermsAt);
                } catch (e) {}
              }

              const targetRole = role;
              if (targetRole === 'admin') role = 'admin';

              if (!profile) {
                Promise.resolve(supabase.from('profiles').upsert({
                  id: session.user.id,
                  full_name: fullName,
                  email: displayEmail,
                  contact_number: contactNumber,
                  auth_method: authMethod === 'email' ? 'gmail' : authMethod,
                  target_exam: targetExam === 'JEE 2027' ? 'Both' : targetExam,
                  role: 'student',
                  accepted_terms_at: acceptedTermsAt,
                  accepted_terms_version: acceptedTermsVersion,
                  parental_consent_confirmed: parentalConsentConfirmed,
                  last_login_at: new Date().toISOString()
                }, { onConflict: 'id', ignoreDuplicates: true })).catch(() => {});
              } else if (!profile.accepted_terms_at) {
                Promise.resolve(supabase.from('profiles').update({
                  accepted_terms_at: acceptedTermsAt,
                  accepted_terms_version: acceptedTermsVersion,
                  parental_consent_confirmed: parentalConsentConfirmed
                }).eq('id', session.user.id)).catch(() => {});
              }
            }
          } catch (err) {
            console.warn('Profile fetch/sync error on auth state change:', err);
          }

          const loggedInUser: User = {
            id: session.user.id,
            name: fullName,
            email: displayEmail,
            contactNumber,
            authMethod: authMethod as any,
            targetExam,
            dailyQuestionGoal: Number(session.user.user_metadata?.daily_question_goal || 30),
            avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null,
            role,
            acceptedTermsAt,
            acceptedTermsVersion,
            parentalConsentConfirmed,
            createdAt: session.user.created_at || new Date().toISOString()
          };

          setUser(loggedInUser);
          localStorage.setItem('nelov_active_session', JSON.stringify(loggedInUser));
          cloudSyncService.hydrateAndMigrateOnLogin(loggedInUser).catch(() => {});

          if (isPasswordRecovery) {
            window.location.hash = '#/login?recovery=1';
            return;
          }

          const savedRedirect = sessionStorage.getItem('nelov_auth_redirect');
          if (savedRedirect) {
            sessionStorage.removeItem('nelov_auth_redirect');
            window.location.hash = savedRedirect;
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('nelov_active_session');
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  const logIn = async (params: LogInParams): Promise<User> => {
    const loggedUser = await authService.logIn(params);
    setUser(loggedUser);
    return loggedUser;
  };

  const signUp = async (params: SignUpParams): Promise<User> => {
    const newUser = await authService.signUp(params);
    setUser(newUser);
    return newUser;
  };

  const signInWithGoogle = async (redirectTo?: string): Promise<void> => {
    await authService.signInWithGoogle(redirectTo);
  };

  const logOut = async (): Promise<void> => {
    await authService.logOut();
    setUser(null);
  };

  const acceptTerms = async (version = '2026-11', parentalConsent = false): Promise<User | null> => {
    const current = user || authService.getCurrentUser();
    if (!current) {
      console.warn('acceptTerms called with no active user session');
      return null;
    }

    const now = new Date().toISOString();
    const consentKey = `consent_v2026_11_${current.id}`;

    // Step C: Immediate Local State & Cache (Guaranteed unblock)
    try {
      localStorage.setItem(consentKey, now);
      const updatedUser: User = {
        ...current,
        acceptedTermsAt: now,
        acceptedTermsVersion: version,
        parentalConsentConfirmed: parentalConsent
      };
      localStorage.setItem('nelov_active_session', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (e) {
      console.warn('LocalStorage error saving consent:', e);
    }

    // Step A: Save to Supabase Auth metadata (always works even without custom DB columns)
    if (isSupabaseConfigured && supabase) {
      try {
        console.log('[AuthContext] Saving legal consent to Supabase Auth metadata...');
        await supabase.auth.updateUser({
          data: {
            accepted_terms_at: now,
            accepted_terms_version: version,
            parental_consent_confirmed: parentalConsent
          }
        });
      } catch (metaErr) {
        console.warn('[AuthContext] Supabase Auth metadata consent update warning:', metaErr);
      }

      // Step B: Resilient upsert into public.profiles
      try {
        console.log('[AuthContext] Syncing legal consent to public.profiles...');
        await supabase
          .from('profiles')
          .upsert({
            id: current.id,
            email: current.email,
            full_name: current.name || 'Student Aspirant',
            contact_number: current.contactNumber,
            auth_method: current.authMethod,
            target_exam: current.targetExam || 'JEE Advanced',
            role: current.role || 'student',
            accepted_terms_at: now,
            accepted_terms_version: version,
            parental_consent_confirmed: parentalConsent,
            last_login_at: now
          }, { onConflict: 'id' });
      } catch (profileErr) {
        console.warn('[AuthContext] public.profiles upsert warning (non-fatal):', profileErr);
      }
    }

    // Also call authService.acceptTerms for full local/service sync
    try {
      await authService.acceptTerms(version, parentalConsent);
    } catch (e) {}

    const finalUser: User = {
      ...current,
      acceptedTermsAt: now,
      acceptedTermsVersion: version,
      parentalConsentConfirmed: parentalConsent
    };
    setUser(finalUser);
    return finalUser;
  };

  const deleteMyAccount = async (): Promise<void> => {
    await authService.deleteMyAccount();
    setUser(null);
  };

  const updateProfile = async (updates: {
    name?: string;
    targetExam?: TargetExam;
    dailyQuestionGoal?: number;
    avatarUrl?: string | null;
  }): Promise<User> => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  const continueAsGuest = async (): Promise<void> => {
    await authService.continueAsGuest();
    setUser(null);
  };

  const openAuthModal = (
    mode: 'login' | 'signup' | 'forgot' | 'recovery' = 'login',
    redirectUrl?: string,
    message?: string
  ) => {
    setAuthModalState({
      isOpen: true,
      mode,
      redirectUrl,
      message,
    });
  };

  const closeAuthModal = () => {
    setAuthModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const verifiedAdmin = !isLoading && Boolean(user && user.role === 'admin') &&
    (!authService.isCloudConnected() || /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(String(user?.id || '')));

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: verifiedAdmin,
        isLoading,
        isCloudConnected: authService.isCloudConnected(),
        logIn,
        signUp,
        signInWithGoogle,
        logOut,
        updateProfile,
        continueAsGuest,
        acceptTerms,
        deleteMyAccount,
        openAuthModal,
        closeAuthModal,
        authModalState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * ProtectedRoute wrapper: Renders children if authenticated,
 * otherwise prompts login or redirects cleanly.
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectUrl?: string;
  fallbackMessage?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectUrl = '#/test/jee-advanced/pta-04',
  fallbackMessage = 'Sign in or create a free account to attempt live PTA tests, view detailed solutions, and track your JEE rank.',
}) => {
  const { isAuthenticated, isLoading, openAuthModal } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openAuthModal('login', redirectUrl, fallbackMessage);
    }
  }, [isLoading, isAuthenticated, redirectUrl, fallbackMessage, openAuthModal]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#080B14]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-2xl text-indigo-600">
          🔒
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-zinc-50">
          Free Account Required
        </h2>
        <p className="max-w-md text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
          {fallbackMessage}
        </p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => openAuthModal('login', redirectUrl, fallbackMessage)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/30 hover:bg-indigo-700 transition-all"
          >
            Log In
          </button>
          <button
            onClick={() => openAuthModal('signup', redirectUrl, fallbackMessage)}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 font-bold text-xs hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Sign Up Free
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * AdminRoute wrapper: Strictly verifies both authentication and profile.role === 'admin'.
 * Non-admins see a clean 403 Forbidden screen.
 */
interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      window.location.hash = '#/';
    }
  }, [isLoading, isAuthenticated, isAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#080B14]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <>{children}</>;
};
