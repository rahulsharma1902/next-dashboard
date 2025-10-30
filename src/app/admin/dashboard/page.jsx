'use client';

import {
  Grid,
  Card,
  Text,
  Group,
  RingProgress,
  SimpleGrid,
  Paper,
  Title,
  Box,
  Progress,
  Badge,
  Stack,
} from '@mantine/core';
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconUsers,
  IconShoppingCart,
  IconCoin,
  IconActivity,
} from '@tabler/icons-react';

const stats = [
  {
    title: 'Total Users',
    value: '12,543',
    diff: 12,
    icon: IconUsers,
    color: 'blue',
  },
  {
    title: 'Total Sales',
    value: '$45,231',
    diff: 8,
    icon: IconShoppingCart,
    color: 'teal',
  },
  {
    title: 'Revenue',
    value: '$89,431',
    diff: -3,
    icon: IconCoin,
    color: 'yellow',
  },
  {
    title: 'Active Now',
    value: '1,234',
    diff: 18,
    icon: IconActivity,
    color: 'grape',
  },
];

const recentActivity = [
  { user: 'John Doe', action: 'Created new account', time: '2 min ago', status: 'success' },
  { user: 'Jane Smith', action: 'Completed purchase', time: '5 min ago', status: 'success' },
  { user: 'Bob Johnson', action: 'Failed payment', time: '10 min ago', status: 'error' },
  { user: 'Alice Brown', action: 'Updated profile', time: '15 min ago', status: 'info' },
  { user: 'Charlie Wilson', action: 'Left review', time: '20 min ago', status: 'success' },
];

export default function DashboardPage() {
  return (
    <Box>
      <Title order={2} mb="lg">
        Dashboard Overview
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="lg">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;
          
          return (
            <Card key={stat.title} padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Box>
                  <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                    {stat.title}
                  </Text>
                  <Text fw={700} size="xl" mt="xs">
                    {stat.value}
                  </Text>
                </Box>
                <Icon size={36} stroke={1.5} color={`var(--mantine-color-${stat.color}-6)`} />
              </Group>
              <Group mt="md" gap="xs">
                <Text c={stat.diff > 0 ? 'teal' : 'red'} fw={700} size="sm">
                  {stat.diff > 0 ? '+' : ''}{stat.diff}%
                </Text>
                <DiffIcon size={16} stroke={2} color={stat.diff > 0 ? 'teal' : 'red'} />
                <Text c="dimmed" size="sm">
                  vs last month
                </Text>
              </Group>
            </Card>
          );
        })}
      </SimpleGrid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Performance Overview
            </Title>
            <Stack gap="md">
              <Box>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>Website Traffic</Text>
                  <Text size="sm" c="dimmed">78%</Text>
                </Group>
                <Progress value={78} color="blue" />
              </Box>
              <Box>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>Conversion Rate</Text>
                  <Text size="sm" c="dimmed">65%</Text>
                </Group>
                <Progress value={65} color="teal" />
              </Box>
              <Box>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>Customer Satisfaction</Text>
                  <Text size="sm" c="dimmed">92%</Text>
                </Group>
                <Progress value={92} color="green" />
              </Box>
              <Box>
                <Group justify="space-between" mb="xs">
                  <Text size="sm" fw={500}>Server Load</Text>
                  <Text size="sm" c="dimmed">45%</Text>
                </Group>
                <Progress value={45} color="yellow" />
              </Box>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Goals Progress
            </Title>
            <Group justify="center" mb="md">
              <RingProgress
                size={180}
                thickness={16}
                sections={[
                  { value: 40, color: 'blue', tooltip: 'Sales - 40%' },
                  { value: 25, color: 'teal', tooltip: 'Marketing - 25%' },
                  { value: 15, color: 'yellow', tooltip: 'Development - 15%' },
                ]}
                label={
                  <Text ta="center" size="lg" fw={700}>
                    80%
                  </Text>
                }
              />
            </Group>
            <Stack gap="xs">
              <Group justify="space-between">
                <Group gap="xs">
                  <Box w={12} h={12} bg="blue" style={{ borderRadius: '50%' }} />
                  <Text size="sm">Sales</Text>
                </Group>
                <Text size="sm" fw={500}>40%</Text>
              </Group>
              <Group justify="space-between">
                <Group gap="xs">
                  <Box w={12} h={12} bg="teal" style={{ borderRadius: '50%' }} />
                  <Text size="sm">Marketing</Text>
                </Group>
                <Text size="sm" fw={500}>25%</Text>
              </Group>
              <Group justify="space-between">
                <Group gap="xs">
                  <Box w={12} h={12} bg="yellow" style={{ borderRadius: '50%' }} />
                  <Text size="sm">Development</Text>
                </Group>
                <Text size="sm" fw={500}>15%</Text>
              </Group>
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
          <Card padding="lg" radius="md" withBorder>
            <Title order={4} mb="md">
              Recent Activity
            </Title>
            <Stack gap="md">
              {recentActivity.map((activity, index) => (
                <Paper key={index} p="md" withBorder>
                  <Group justify="space-between">
                    <Box>
                      <Text fw={500}>{activity.user}</Text>
                      <Text size="sm" c="dimmed">{activity.action}</Text>
                    </Box>
                    <Group>
                      <Badge
                        color={
                          activity.status === 'success'
                            ? 'green'
                            : activity.status === 'error'
                            ? 'red'
                            : 'blue'
                        }
                        variant="light"
                      >
                        {activity.status}
                      </Badge>
                      <Text size="xs" c="dimmed">{activity.time}</Text>
                    </Group>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
}