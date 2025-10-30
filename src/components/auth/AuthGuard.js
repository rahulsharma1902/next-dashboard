'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Center, Loader, Text, Stack } from '@mantine/core';
import useAuthStore from '../../store/useAuthStore';

export default function AuthGuard({ children, allowedRoles = [] }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuth, hasAnyRole, checkExpiry, user } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Check if token is expired
      const isValid = checkExpiry();
      
      if (!isValid || !isAuth()) {
        // Not authenticated, redirect to login
        router.push(`/login?redirect=${pathname}`);
        return;
      }

      // Check role-based access
      if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
        // User doesn't have required role
        router.push('/unauthorized');
        return;
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [isAuth, hasAnyRole, allowedRoles, checkExpiry, router, pathname]);

  if (isChecking) {
    return (
      <Center h="100vh">
        <Stack align="center" gap="md">
          <Loader size="xl" />
          <Text size="lg" fw={500}>Verifying authentication...</Text>
        </Stack>
      </Center>
    );
  }

  return <>{children}</>;
}