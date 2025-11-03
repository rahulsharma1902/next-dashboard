'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Group,
  Code,
  ScrollArea,
  Tooltip,
  UnstyledButton,
  Stack,
  Text,
  Avatar,
  Box,
  Collapse,
  Divider,
  Loader,
} from '@mantine/core';
import {
  IconDashboard,
  IconSettings,
  IconUser,
  IconLogout,
  IconBrandProducthunt,
  IconShoppingBag,
  IconStar,
  IconChevronDown,
  IconChevronRight,
  IconPlus,
  IconList,
  IconEdit,
  IconEye,
  IconUsers,
  IconUserCog,
  IconBell,
  IconNotification,
} from '@tabler/icons-react';
import classes from './Sidebar.module.css';
import { useLogout } from '../../hooks/useLogout';
import useAuthStore from '../../store/useAuthStore';

const navigationLinks = [
  { 
    label: 'Dashboard', 
    icon: IconDashboard, 
    href: '/admin/dashboard',
  },
  { 
    label: 'Brands', 
    icon: IconBrandProducthunt, 
    href: '/admin/brands',
    subItems: [
      { label: 'View All Brands', icon: IconList, href: '/admin/brands' },
      { label: 'Add Brand', icon: IconPlus, href: '/admin/brands/add' },
      // { label: 'Brand Categories', icon: IconEye, href: '/admin/brands/categories' },
    ]
  },
  { 
    label: 'Products', 
    icon: IconShoppingBag, 
    href: '/admin/products',
    subItems: [
      { label: 'All Products', icon: IconList, href: '/admin/products' },
      { label: 'Add Product', icon: IconPlus, href: '/admin/products/add' },
      // { label: 'Edit Products', icon: IconEdit, href: '/admin/products/edit' },
      // { label: 'Product Categories', icon: IconEye, href: '/admin/products/categories' },
    ]
  },
  { 
    label: 'Reviews', 
    icon: IconStar, 
    href: '/admin/reviews',
    subItems: [
      { label: 'All Reviews', icon: IconList, href: '/admin/reviews' },
      { label: 'Pending Reviews', icon: IconBell, href: '/admin/reviews/pending' },
      { label: 'Approved Reviews', icon: IconEye, href: '/admin/reviews/approved' },
    ]
  },
  { 
    label: 'Profile', 
    icon: IconUser, 
    href: '/admin/profile',
  },
  { 
    label: 'Settings', 
    icon: IconSettings, 
    href: '/admin/settings',
    subItems: [
      { label: 'General', icon: IconSettings, href: '/admin/settings/general' },
      { label: 'Security', icon: IconUserCog, href: '/admin/settings/security' },
    ]
  },
];

function NavLink({ item, collapsed, pathname, onNavigate, level = 0 }) {
  const [opened, setOpened] = useState(false);
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const isActive = pathname === item.href || 
    (hasSubItems && item.subItems.some(sub => pathname === sub.href));

  const handleClick = () => {
    if (hasSubItems) {
      setOpened(!opened);
    } else {
      onNavigate(item.href);
    }
  };

  return (
    <>
      <Tooltip
        label={item.label}
        position="right"
        disabled={!collapsed || level > 0}
        withArrow
      >
        <UnstyledButton
          onClick={handleClick}
          className={`${classes.link} ${isActive ? classes.linkActive : ''}`}
          style={{ paddingLeft: level > 0 ? '2rem' : '1rem' }}
        >
          <Group gap="sm" wrap="nowrap" justify="space-between" style={{ width: '100%' }}>
            <Group gap="sm" wrap="nowrap">
              <item.icon size={20} stroke={1.6} />
              {!collapsed && (
                <Text size="sm" fw={level > 0 ? 400 : 500}>
                  {item.label}
                </Text>
              )}
            </Group>
            {!collapsed && hasSubItems && (
              opened ? 
                <IconChevronDown size={16} stroke={1.6} /> : 
                <IconChevronRight size={16} stroke={1.6} />
            )}
          </Group>
        </UnstyledButton>
      </Tooltip>

      {!collapsed && hasSubItems && (
        <Collapse in={opened}>
          <Stack gap={4} mt={4} ml="xs">
            {item.subItems.map((subItem) => (
              <NavLink
                key={subItem.href}
                item={subItem}
                collapsed={false}
                pathname={pathname}
                onNavigate={onNavigate}
                level={level + 1}
              />
            ))}
          </Stack>
        </Collapse>
      )}
    </>
  );
}

export default function Sidebar({ collapsed }) {
  const pathname = usePathname();
  const router = useRouter();
  const { handleLogout, isLoggingOut } = useLogout();
  const user = useAuthStore((state) => state.user);

  const handleNavigation = (href) => {
    router.push(href);
  };

  return (
    <Box style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      position: 'relative'
    }}>
      {/* Logo Section */}
      <Box mb="xl" pt="md">
        <Group justify="center">
          {collapsed ? (
            <Avatar color="blue" radius="xl" size="md">
              {user?.name?.[0] || 'A'}
            </Avatar>
          ) : (
            <Group gap="xs">
              <Avatar color="blue" radius="xl" size="sm">
                {user?.name?.[0] || 'A'}
              </Avatar>
              <Box>
                <Text fw={700} size="sm">{user?.name || 'Admin'}</Text>
                <Text size="xs" c="dimmed">{user?.role || 'ADMIN'}</Text>
              </Box>
            </Group>
          )}
        </Group>
      </Box>

      <Divider mb="md" />

      {/* Navigation Links */}
      
      <ScrollArea 
        style={{ 
          flex: 1,
          marginBottom: '80px' // Space for logout button
        }}
        type="hover"
      >
        <Stack gap={4}>
          {navigationLinks.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              collapsed={collapsed}
              pathname={pathname}
              onNavigate={handleNavigation}
            />
          ))}
        </Stack>
      </ScrollArea>

      {/* Logout Button - Fixed at Bottom */}
       {/* <Divider mb="md" /> */}
      <Box 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1rem',
          borderTop: '1px solid',
          backgroundColor: '',
        }}
      >
        <Tooltip label="Logout" position="right" disabled={!collapsed} withArrow>
          <UnstyledButton 
            onClick={() => handleLogout(true)}
            className={classes.logoutLink}
            style={{ width: '100%' }}
            disabled={isLoggingOut}
          >
            <Group gap="sm" wrap="nowrap">
              {isLoggingOut ? (
                <Loader size={20} color="red" />
              ) : (
                <IconLogout size={20} stroke={1.6} />
              )}
              {!collapsed && (
                <Text size="sm" fw={500}>
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </Text>
              )}
            </Group>
          </UnstyledButton>
        </Tooltip>
      </Box>
    </Box>
  );
}