'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      expireAt: null,
      isAuthenticated: false,

      // Set authentication data
      setAuth: (user, token, expiry = 24 * 60 * 60 * 1000) => {
        const expireAt = new Date().getTime() + expiry;
        set({ 
          user, 
          token, 
          expireAt,
          isAuthenticated: true 
        });
      },

      // Logout functionality
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          expireAt: null,
          isAuthenticated: false 
        });
        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }
      },

      // Check if token is expired
      checkExpiry: () => {
        const state = get();
        const now = new Date().getTime();
        
        if (state.expireAt && now > state.expireAt) {
          state.logout();
          return false;
        }
        return true;
      },

      // Check if user has specific role
      hasRole: (role) => {
        const state = get();
        return state.user?.role === role;
      },

      // Check if user has any of the roles
      hasAnyRole: (roles) => {
        const state = get();
        return roles.includes(state.user?.role);
      },

      // Get current user
      getUser: () => get().user,

      // Get token
      getToken: () => get().token,

      // Check if authenticated
      isAuth: () => {
        const state = get();
        return state.isAuthenticated && state.checkExpiry();
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => (typeof window !== 'undefined' ? localStorage : undefined),
    }
  )
);

export default useAuthStore;