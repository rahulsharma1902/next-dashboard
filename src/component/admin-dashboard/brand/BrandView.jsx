'use client';

import {
  Grid,
  Card,
  Text,
  Group,
  SimpleGrid,
  Title,
  Box,
  Badge,
  Button,
  Table,
  Avatar,
  ActionIcon,
  Menu,
} from '@mantine/core';
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconUsers,
  IconShoppingCart,
  IconCoin,
  IconActivity,
  IconDots,
  IconEye,
  IconEdit,
  IconTrash,
  IconPlus,
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

const brandsData = [
  { 
    id: 1, 
    name: 'Nike', 
    logo: 'N',
    products: 145, 
    revenue: '$125,450', 
    status: 'active',
    growth: '+12%'
  },
  { 
    id: 2, 
    name: 'Adidas', 
    logo: 'A',
    products: 132, 
    revenue: '$98,230', 
    status: 'active',
    growth: '+8%'
  },
  { 
    id: 3, 
    name: 'Puma', 
    logo: 'P',
    products: 89, 
    revenue: '$76,540', 
    status: 'active',
    growth: '+15%'
  },
  { 
    id: 4, 
    name: 'Reebok', 
    logo: 'R',
    products: 67, 
    revenue: '$45,890', 
    status: 'inactive',
    growth: '-3%'
  },
  { 
    id: 5, 
    name: 'Under Armour', 
    logo: 'UA',
    products: 54, 
    revenue: '$38,720', 
    status: 'active',
    growth: '+6%'
  },
];

export default function BrandsOverviewPage() {
  const rows = brandsData.map((brand) => (
    <Table.Tr key={brand.id}>
      <Table.Td>
        <Group gap="sm">
          <Avatar color="blue" radius="xl">{brand.logo}</Avatar>
          <Text fw={500}>{brand.name}</Text>
        </Group>
      </Table.Td>
      <Table.Td>{brand.products}</Table.Td>
      <Table.Td>{brand.revenue}</Table.Td>
      <Table.Td>
        <Badge 
          color={brand.status === 'active' ? 'green' : 'gray'} 
          variant="light"
        >
          {brand.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text 
          c={brand.growth.startsWith('+') ? 'teal' : 'red'} 
          fw={600}
        >
          {brand.growth}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-end">
          <ActionIcon variant="light" color="blue">
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon variant="light" color="yellow">
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon variant="light" color="red">
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Box>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Brands Overview</Title>
        <Button leftSection={<IconPlus size={18} />} variant="filled">
          Add New Brand
        </Button>
      </Group>

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
                <DiffIcon size={16} stroke={2} />
                <Text c="dimmed" size="sm">
                  vs last month
                </Text>
              </Group>
            </Card>
          );
        })}
      </SimpleGrid>

      <Card padding="lg" radius="md" withBorder>
        <Title order={4} mb="md">All Brands</Title>
        <Table.ScrollContainer minWidth={800}>
          <Table highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Brand Name</Table.Th>
                <Table.Th>Products</Table.Th>
                <Table.Th>Revenue</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Growth</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>
    </Box>
  );
}