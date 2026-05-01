import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, hasSupabaseKeys } from '../lib/supabase';

interface AuthState {
  user: { id: string; email: string; isMock: boolean } | null;
  login: (email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password?: string) => Promise<boolean>;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      initAuth: () => {
        if (hasSupabaseKeys && supabase) {
          // Check active session immediately
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
              set({ user: { id: session.user.id, email: session.user.email || '', isMock: false } });
            }
          });

          // Listen for OAuth redirects and auth changes
          supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              set({ user: { id: session.user.id, email: session.user.email || '', isMock: false } });
            } else {
              set({ user: null });
            }
          });
        }
      },

      login: async (email, password) => {
        if (hasSupabaseKeys && supabase) {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password: password || '' });
          if (error) {
            alert(error.message);
            return false;
          }
          if (data.user) {
            set({ user: { id: data.user.id, email: data.user.email || '', isMock: false } });
            return true;
          }
          return false;
        } else {
          // Mock login for LocalStorage fallback
          set({ user: { id: 'mock-user-123', email, isMock: true } });
          return true;
        }
      },

      loginWithGoogle: async () => {
        if (hasSupabaseKeys && supabase) {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin
            }
          });
          if (error) {
            alert(error.message);
            return false;
          }
          // Supabase will redirect away, so we don't return anything meaningful yet
          return true;
        } else {
          // Mock Google login for LocalStorage fallback
          set({ user: { id: 'mock-google-123', email: 'agent.google@omnifi.network', isMock: true } });
          return true;
        }
      },

      register: async (email, password) => {
        if (hasSupabaseKeys && supabase) {
          const { data, error } = await supabase.auth.signUp({ email, password: password || '' });
          if (error) {
            alert(error.message);
            return false;
          }
          if (data.user) {
            set({ user: { id: data.user.id, email: data.user.email || '', isMock: false } });
            return true;
          }
          return false;
        } else {
          // Mock register
          set({ user: { id: 'mock-user-123', email, isMock: true } });
          return true;
        }
      },

      logout: async () => {
        if (hasSupabaseKeys && supabase) {
          await supabase.auth.signOut();
        }
        set({ user: null });
      }
    }),
    {
      name: 'omnifi-auth-storage',
    }
  )
);
