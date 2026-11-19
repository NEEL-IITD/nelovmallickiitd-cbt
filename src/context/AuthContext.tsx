import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, authService, LogInParams, SignUpParams } from '../services/authService';

export interface AuthModalState {
  isOpen: boolean;
  mode: 'login' | 'signup' | 'forgot';
  redirectUrl?: string;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logIn: (params: LogInParams) => Promise<User>;
  signUp: (params: SignUpParams) => Promise<User>;
  logOut: () => void;
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot', redirectUrl?: string, message?: string) => void;
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

  useEffect(() => {
    // Check for existing active session on mount
    const active = authService.getCurrentUser();
    setUser(active);
    setIsLoading(false);
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

  const logOut = () => {
    authService.logOut();
    setUser(null);
  };

  const openAuthModal = (
    mode: 'login' | 'signup' | 'forgot' = 'login',
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logIn,
        signUp,
        logOut,
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0c]">
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
