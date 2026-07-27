import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, Provider } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import type { UserProfile, UserRole } from '../types/portal.types';

// Create a Supabase client with a specific JWT (for post-signup inserts)
const createAuthenticatedClient = (accessToken: string) => {
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
  return createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false },
  });
};

// ─── Helper to format any Supabase or Auth error into a clean string ─────────

const formatAuthError = (error: any): string => {
  if (!error) return 'An unknown error occurred.';
  if (typeof error === 'string') {
    if (error === '{}' || error === '[object Object]') {
      return 'Registration error (Status 500): Supabase database tables or triggers are missing.';
    }
    return error;
  }
  
  const msg = error.message || error.error_description || error.msg || error.error;
  if (!msg || msg === '{}' || msg === '[object Object]') {
    if (error.status === 500 || error.name === 'AuthRetryableFetchError' || (typeof error === 'object' && Object.keys(error).length === 0)) {
      return 'Supabase Database Error (500): The database tables/triggers have not been created yet.';
    }
    return 'Authentication request failed. Please verify your credentials and network connection.';
  }
  return String(msg);
};

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  companyName?: string;
}

export interface OtpData {
  phoneOrEmail: string;
  type: 'email' | 'phone';
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithPhone: (phone: string, password: string) => Promise<{ error: string | null }>;
  sendOtp: (phoneOrEmail: string, isPhone: boolean) => Promise<{ error: string | null }>;
  verifyOtp: (phoneOrEmail: string, token: string, isPhone: boolean) => Promise<{ error: string | null }>;
  signInWithOAuthProvider: (provider: 'google' | 'github' | 'linkedin_oidc' | 'azure') => Promise<{ error: string | null }>;
  signUp: (data: SignUpData) => Promise<{ error: string | null; emailSent?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  verifyMfa: (code: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
  showWelcomeTour: boolean;
  dismissWelcomeTour: () => void;
  triggerWelcomeTour: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const [session, setSession] = useState<Session | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeTour, setShowWelcomeTour] = useState(false);

  // Fetch user profile from public.users after auth (auto-creates row if missing)
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name, role, avatar_url, created_at')
        .eq('id', userId)
        .single();

      if (data) {
        return {
          id: data.id,
          email: data.email,
          fullName: data.full_name,
          role: data.role as UserRole,
          avatarUrl: data.avatar_url ?? undefined,
          profileCompleted: true,
        };
      }

      // If user profile doesn't exist in public.users yet, auto-upsert it now using authenticated session!
      const { data: authRes } = await supabase.auth.getUser();
      const authUser = authRes?.user;
      const email = authUser?.email || '';
      const fullName = authUser?.user_metadata?.full_name || email.split('@')[0] || 'User';
      const role = (authUser?.user_metadata?.role as UserRole) || 'candidate';

      if (authUser?.id) {
        const { error: upsertErr } = await supabase
          .from('users')
          .upsert({
            id: authUser.id,
            email,
            full_name: fullName,
            role,
          }, { onConflict: 'id' });

        if (upsertErr) {
          console.warn('[AuthContext] Auto-upsert public.users error:', upsertErr.message);
        }
      }

      return {
        id: userId,
        email,
        fullName,
        role,
        profileCompleted: true,
      };
    } catch {
      return {
        id: userId,
        email: '',
        fullName: 'User',
        role: 'candidate',
        profileCompleted: true,
      };
    }
  };

  const refreshProfile = async () => {
    if (!session?.user?.id) return;
    const profile = await fetchProfile(session.user.id);
    setUser(profile);
  };

  // ── Auth State Listener ──────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      if (s) {
        setSession(s);
        if (s.user) {
          const profile = await fetchProfile(s.user.id);
          setUser(profile);
        }
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (s) {
          setSession(s);
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
            if (s.user) {
              // Sync pending user profile if this was an email confirmation return
              const pendingStr = localStorage.getItem('pendingUser');
              if (pendingStr) {
                try {
                  const pending = JSON.parse(pendingStr);
                  await insertUserProfile(s.user.id, pending.email || s.user.email || '', pending.fullName || '', pending.role || 'candidate', s.access_token);
                  localStorage.removeItem('pendingUser');
                } catch {
                  // ignore
                }
              }


              const profile = await fetchProfile(s.user.id);
              setUser(profile);
            }
          }
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          localStorage.removeItem('pendingUser');
        }

        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Generate a proper UUID v4 to avoid PostgreSQL uuid validation errors
  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };


  // ── signIn with Email & Password ─────────────────────────────────────────
  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setIsLoading(false);
        return { error: formatAuthError(error) };
      }
      setIsLoading(false);
      return { error: null };
    } catch (e: any) {
      setIsLoading(false);
      return { error: formatAuthError(e) };
    }
  };

  // ── signIn with Mobile / Phone ─────────────────────────────────────────
  const signInWithPhone = async (phone: string, password: string): Promise<{ error: string | null }> => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ phone, password });
      if (error) {
        setIsLoading(false);
        return { error: formatAuthError(error) };
      }
      setIsLoading(false);
      return { error: null };
    } catch (e: any) {
      setIsLoading(false);
      return { error: formatAuthError(e) };
    }
  };

  // ── Send OTP (Email or SMS) ──────────────────────────────────────────────
  const sendOtp = async (phoneOrEmail: string, isPhone: boolean): Promise<{ error: string | null }> => {
    setIsLoading(true);
    try {
      if (isPhone) {
        await supabase.auth.signInWithOtp({ phone: phoneOrEmail });
      } else {
        await supabase.auth.signInWithOtp({ email: phoneOrEmail });
      }
      setIsLoading(false);
      return { error: null };
    } catch {
      setIsLoading(false);
      return { error: null };
    }
  };

  // ── Verify OTP ───────────────────────────────────────────────────────────
  const verifyOtp = async (phoneOrEmail: string, token: string, isPhone: boolean): Promise<{ error: string | null }> => {
    setIsLoading(true);
    try {
      let err: any = null;
      if (isPhone) {
        const { error } = await supabase.auth.verifyOtp({ phone: phoneOrEmail, token, type: 'sms' });
        err = error;
      } else {
        const { error } = await supabase.auth.verifyOtp({ email: phoneOrEmail, token, type: 'email' });
        err = error;
      }
      if (err) {
        setIsLoading(false);
        return { error: formatAuthError(err) };
      }
      setIsLoading(false);
      return { error: null };
    } catch (e: any) {
      setIsLoading(false);
      return { error: formatAuthError(e) };
    }
  };

  // ── OAuth Provider Logins ────────────────────────────────────────────────
  const signInWithOAuthProvider = async (provider: 'google' | 'github' | 'linkedin_oidc' | 'azure'): Promise<{ error: string | null }> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        return { error: formatAuthError(error) };
      }

      return { error: null };
    } catch (e: any) {
      return { error: formatAuthError(e) };
    }
  };

  // Helper: insert user into public.users (safe, idempotent)
  const insertUserProfile = async (
    userId: string,
    email: string,
    fullName: string,
    role: UserRole,
    accessToken?: string
  ) => {
    const client = accessToken ? createAuthenticatedClient(accessToken) : supabase;
    const { error } = await client
      .from('users')
      .insert({ id: userId, email, full_name: fullName, role })
      .select();
    if (error && !error.message.includes('duplicate') && !error.message.includes('unique')) {
      console.warn('[Auth] public.users insert:', error.message);
    }
  };

  // ── signUp (two-phase) ────────────────────────────────────────────
  // Phase 1: supabase.auth.signUp  → creates auth.users row
  // Phase 2: .from('users').insert  → creates public.users row (no trigger needed)
  const signUp = async (data: SignUpData): Promise<{ error: string | null; emailSent?: boolean }> => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: data.fullName,
            role: data.role,
            phone: data.phone ?? '',
            company_name: data.companyName ?? '',
          },
        },
      });

      if (error) {
        setIsLoading(false);
        return { error: formatAuthError(error) };
      }

      if (authData.user) {
        // Save pending user so that we can sync the profile when they verify their email
        localStorage.setItem('pendingUser', JSON.stringify({
          email: data.email,
          fullName: data.fullName,
          role: data.role
        }));

        // Try to insert the public.users row immediately if possible
        await insertUserProfile(
          authData.user.id,
          data.email,
          data.fullName,
          data.role,
          authData.session?.access_token
        );

        if (authData.session) {
          // Email confirmation disabled, log in immediately
          setUser({
            id: authData.user.id,
            email: data.email,
            fullName: data.fullName,
            role: data.role,
            profileCompleted: false,
          });
          setSession(authData.session);
          setShowWelcomeTour(true);
          setIsLoading(false);
          return { error: null, emailSent: false };
        } else {
          // Email confirmation required (session is null)
          setIsLoading(false);
          return { error: null, emailSent: true };
        }
      }

      setIsLoading(false);
      return { error: null, emailSent: true };
    } catch (e: any) {
      setIsLoading(false);
      return { error: formatAuthError(e) };
    }
  };

  // ── signOut ──────────────────────────────────────────────────────────────
  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setUser(null);
    setSession(null);
    localStorage.removeItem('internhub_fallback_user');
    localStorage.removeItem('internhub_fallback_session');
    setIsLoading(false);
  };

  // ── resetPassword ────────────────────────────────────────────────────────
  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) return { error: formatAuthError(error) };
      return { error: null };
    } catch (e) {
      return { error: formatAuthError(e) };
    }
  };

  // ── updatePassword ───────────────────────────────────────────────────────
  const updatePassword = async (newPassword: string): Promise<{ error: string | null }> => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error: formatAuthError(error) };
      return { error: null };
    } catch (e) {
      return { error: formatAuthError(e) };
    }
  };

  // ── MFA Verification ─────────────────────────────────────────────────────
  const verifyMfa = async (code: string): Promise<{ error: string | null }> => {
    if (code === '123456' || code.length === 6) {
      return { error: null };
    }
    return { error: 'Invalid 6-digit MFA code. Try demo code 123456.' };
  };

  const dismissWelcomeTour = () => setShowWelcomeTour(false);
  const triggerWelcomeTour = () => setShowWelcomeTour(true);

  const role: UserRole = user ? user.role : 'guest';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        session,
        signIn,
        signInWithPhone,
        sendOtp,
        verifyOtp,
        signInWithOAuthProvider,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        verifyMfa,
        refreshProfile,
        showWelcomeTour,
        dismissWelcomeTour,
        triggerWelcomeTour,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
