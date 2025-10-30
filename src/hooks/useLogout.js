'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import useAuthStore from '../store/useAuthStore';

export const useLogout = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (showConfirmation = true) => {
    if (showConfirmation) {
      modals.openConfirmModal({
        title: 'Confirm Logout',
        children: 'Are you sure you want to logout? Any unsaved changes will be lost.',
        labels: { confirm: 'Logout', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onConfirm: async () => {
          await performLogout();
        },
      });
    } else {
      await performLogout();
    }
  };

  const performLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Optional: Call logout API if you have one
      // await axiosWrapper('post', API_URL.LOGOUT);
      
      // Clear auth state
      logout();
      
      // Show success notification
      notifications.show({
        title: 'Logged Out',
        message: 'You have been successfully logged out.',
        color: 'blue',
      });
      
      // Redirect to login
      router.push('/login');
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to logout. Please try again.',
        color: 'red',
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    handleLogout,
    isLoggingOut,
  };
};