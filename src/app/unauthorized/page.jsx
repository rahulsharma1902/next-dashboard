'use client';

import { Container, Title, Text, Button, Group, Paper, Stack } from '@mantine/core';
import { IconShieldX, IconHome, IconArrowLeft } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <Container size={600} my={100}>
      <Paper p={40} radius="md" withBorder shadow="lg">
        <Stack align="center" gap="xl">
          <IconShieldX size={80} stroke={1.5} color="var(--mantine-color-red-6)" />
          
          <Stack align="center" gap="xs">
            <Title order={1} ta="center">Access Denied</Title>
            <Text c="dimmed" size="lg" ta="center">
              You don't have permission to access this page
            </Text>
          </Stack>

          <Text size="sm" c="dimmed" ta="center" maw={400}>
            This page requires admin privileges. If you believe this is an error, 
            please contact your system administrator or try logging in with an account 
            that has the appropriate permissions.
          </Text>

          <Group>
            <Button 
              leftSection={<IconArrowLeft size={18} />}
              variant="default"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
            <Button 
              leftSection={<IconHome size={18} />}
              onClick={() => router.push('/login')}
            >
              Back to Login
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}