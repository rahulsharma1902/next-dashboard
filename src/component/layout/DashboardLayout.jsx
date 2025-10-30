'use client';

import { useState } from 'react';
import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children }) {
  const [opened, { toggle }] = useDisclosure();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: collapsed ? 80 : 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Topbar 
          burger={<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          collapsed={collapsed}
        />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Sidebar collapsed={collapsed} />
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}