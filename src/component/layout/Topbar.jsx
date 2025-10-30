'use client';

import {
  Group,
  ActionIcon,
  useMantineColorScheme,
  TextInput,
  Menu,
  Avatar,
  Text,
  Indicator,
  Box,
  Loader,
} from '@mantine/core';
import {
  IconSun,
  IconMoon,
  IconSearch,
  IconBell,
  IconMenu2,
  IconSettings,
  IconLogout,
  IconUser,
  IconShield,
} from '@tabler/icons-react';
import { useLogout } from '../../hooks/useLogout';
import useAuthStore from '../../store/useAuthStore';

export default function Topbar({ burger, onToggleCollapse, collapsed }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { handleLogout, isLoggingOut } = useLogout();
  const user = useAuthStore((state) => state.user);

  return (
    <Box px="md" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <Group justify="space-between" style={{ flex: 1 }}>
        <Group>
          {burger}
          <ActionIcon
            variant="default"
            onClick={onToggleCollapse}
            size="lg"
            visibleFrom="sm"
          >
            <IconMenu2 size={18} />
          </ActionIcon>
        </Group>

        <Group gap="xs">
          <TextInput
            placeholder="Search..."
            leftSection={<IconSearch size={16} />}
            style={{ width: 300 }}
            visibleFrom="sm"
          />

          <ActionIcon
            variant="default"
            onClick={() => toggleColorScheme()}
            size="lg"
          >
            {colorScheme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
          </ActionIcon>

          <Indicator inline processing color="red" offset={7}>
            <ActionIcon variant="default" size="lg">
              <IconBell size={18} />
            </ActionIcon>
          </Indicator>

          <Menu shadow="md" width={220} position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="default" size="lg" style={{ width: 'auto', padding: '0 8px' }}>
                <Group gap="sm">
                  <Avatar size="sm" radius="xl" color="blue">
                    {user?.name?.[0] || 'A'}
                  </Avatar>
                  <Box visibleFrom="sm">
                    <Text size="sm" fw={500} lineClamp={1}>
                      {user?.name || 'Admin User'}
                    </Text>
                  </Box>
                </Group>
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>
                <Text size="sm" fw={500}>
                  {user?.name || 'Admin User'}
                </Text>
                <Text size="xs" c="dimmed">
                  {user?.email || 'admin@example.com'}
                </Text>
              </Menu.Label>
              
              <Menu.Divider />
              
              <Menu.Item 
                leftSection={<IconShield size={16} />}
                rightSection={
                  <Text size="xs" c="blue" fw={600}>
                    {user?.role || 'ADMIN'}
                  </Text>
                }
              >
                Role
              </Menu.Item>
              
              <Menu.Item leftSection={<IconUser size={16} />}>
                Profile
              </Menu.Item>
              
              <Menu.Item leftSection={<IconSettings size={16} />}>
                Settings
              </Menu.Item>
              
              <Menu.Divider />
              
              <Menu.Item
                color="red"
                leftSection={
                  isLoggingOut ? (
                    <Loader size={16} color="red" />
                  ) : (
                    <IconLogout size={16} />
                  )
                }
                onClick={() => handleLogout(true)}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Box>
  );
}