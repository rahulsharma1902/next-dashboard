'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Paper,
  Title,
  Container,
  Text,
  Box,
  Group,
  Anchor,
  Stack,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconLock, IconMail } from '@tabler/icons-react';
import useAuthStore from '../../../store/useAuthStore';
import { axiosWrapper } from '../../../utils/api';
import { API_URL } from '../../../utils/apiUrl';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const isAuth = useAuthStore((state) => state.isAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuth()) {
      const redirect = searchParams.get('redirect') || '/admin/dashboard';
      router.push(redirect);
    }
  }, [isAuth, router, searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      notifications.show({ 
        title: 'Validation Error', 
        message: 'Please enter both email and password', 
        color: 'red' 
      });
      return;
    }

    setLoading(true);
    
    try {
      const res = await axiosWrapper('post', API_URL.LOGIN_USER, { 
        email, 
        password 
      });

      // Check if user has admin role
      if (res.data.user.role !== 'ADMIN' && res.data.user.role !== 'SUPER_ADMIN') {
        notifications.show({ 
          title: 'Access Denied', 
          message: 'You do not have permission to access the admin panel', 
          color: 'red' 
        });
        return;
      }

      // Set expiry time based on remember me
      const expiry = remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      setAuth(res.data.user, res.data.token, expiry);

      notifications.show({ 
        title: 'Success', 
        message: `Welcome back, ${res.data.user.name}!`, 
        color: 'green' 
      });

      // Redirect to original destination or dashboard
      const redirect = searchParams.get('redirect') || '/admin/dashboard';
      router.push(redirect);
      
    } catch (err) {
      notifications.show({ 
        title: 'Login Failed', 
        message: err?.message || 'Invalid credentials. Please try again.', 
        color: 'red' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={460} my={80}>
      <Box mb="xl">
        <Title ta="center" order={1}>Welcome Back</Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Sign in to access your admin dashboard
        </Text>
      </Box>

      <Paper withBorder shadow="lg" p={40} radius="md">
        <form onSubmit={handleLogin}>
          <Stack gap="md">
            <TextInput
              label="Email Address"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              leftSection={<IconMail size={16} />}
              required
              disabled={loading}
              size="md"
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              leftSection={<IconLock size={16} />}
              required
              disabled={loading}
              size="md"
            />

            <Group justify="space-between">
              <Checkbox
                label="Remember me"
                checked={remember}
                onChange={(e) => setRemember(e.currentTarget.checked)}
                disabled={loading}
              />
              <Anchor size="sm" href="/forgot-password">
                Forgot password?
              </Anchor>
            </Group>

            <Button 
              type="submit"
              fullWidth 
              size="md"
              loading={loading}
              loaderProps={{ type: 'dots' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </Stack>
        </form>

        <Text c="dimmed" size="sm" ta="center" mt="xl">
          Don't have an account?{' '}
          <Anchor size="sm" href="/register">
            Create account
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}