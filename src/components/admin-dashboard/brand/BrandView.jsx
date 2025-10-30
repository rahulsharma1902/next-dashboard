// pages/brands.jsx
'use client';

import { useCallback } from 'react';
import { Avatar, Text, Group, Badge } from '@mantine/core';
import { IconMail, IconPhone, IconMapPin } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import DataTable from '../../../components/DataTable/DataTable';
import useAuthStore from '../../../store/useAuthStore';
import { axiosWrapper } from '../../../utils/api';
import { BRAND_API } from '../../../utils/apiUrl';

export default function BrandsPage() {
  const fetchBrands = useCallback(async (params) => {
    const token = useAuthStore.getState().token;
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosWrapper(
      'get',
      // BRAND_API.GET_ALL_BRANDS,
      `${BRAND_API.GET_ALL_BRANDS}?${queryString}`,
      {},
      token,
    );
    return response.data;
  }, []);

  const handleDelete = async (brand) => {
    try {
      const token = useAuthStore.getState().token;
      await axiosWrapper(
        'delete',
        `${BRAND_API.GET_ALL_BRANDS}/${brand._id}`,
        {},
        token
      );
      notifications.show({
        title: 'Success',
        message: 'Brand deleted successfully',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete brand',
        color: 'red',
      });
    }
  };

  const columns = [
    {
      key: 'brand',
      header: 'Brand',
      accessor: 'name',
      sortField: 'name',
      render: (item) => (
        <Group gap="sm">
          <Avatar 
            src={item.logoUrl} 
            radius="xl" 
            size="md"
            alt={item.name}
          >
            {item.name?.charAt(0)?.toUpperCase() || '?'}
          </Avatar>
          <div>
            <Text fw={500} size="sm">{item.name || 'Unnamed Brand'}</Text>
            <Text size="xs" c="dimmed">
              {item.description ? `${item.description.substring(0, 30)}...` : 'No description'}
            </Text>
          </div>
        </Group>
      )
    },
    {
      key: 'email',
      header: 'Email',
      accessor: 'email',
      render: (item) => (
        <Group gap={6}>
          <IconMail size={14} opacity={0.6} />
          <Text size="sm">{item.email || '-'}</Text>
        </Group>
      )
    },
    {
      key: 'phone',
      header: 'Phone',
      accessor: 'phoneNumber',
      render: (item) => (
        <Group gap={6}>
          <IconPhone size={14} opacity={0.6} />
          <Text size="sm">{item.phoneNumber || '-'}</Text>
        </Group>
      )
    },
    {
      key: 'postcode',
      header: 'Postcode',
      accessor: 'postcode',
      render: (item) => (
        <Group gap={6}>
          <IconMapPin size={14} opacity={0.6} />
          <Text size="sm">{item.postcode || '-'}</Text>
        </Group>
      )
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      render: (item) => (
        <Badge 
          color={item.status === 'ACTIVE' ? 'green' : item.status === 'INACTIVE' ? 'gray' : 'blue'} 
          variant="light"
          size="sm"
        >
          {item.status || 'UNKNOWN'}
        </Badge>
      )
    },
  ];

  const filters = [
    {
      key: 'name',
      label: 'Brand Name',
      type: 'text',
      placeholder: 'Search by brand name...',
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      placeholder: 'Search by email...',
      icon: <IconMail size={16} />
    },
    {
      key: 'phoneNumber',
      label: 'Phone',
      type: 'text',
      placeholder: 'Search by phone...',
      icon: <IconPhone size={16} />
    },
    {
      key: 'postcode',
      label: 'Postcode',
      type: 'text',
      placeholder: 'Search by postcode...',
      icon: <IconMapPin size={16} />
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
      ]
    }
  ];

  const actions = {
    view: true,
    edit: true,
    delete: true,
  };

  return (
    <DataTable
      title="Brands Management"
      fetchFunction={fetchBrands}
      columns={columns}
      filters={filters}
      actions={actions}
      onAdd={() => console.log('Add brand')}
      onEdit={(brand) => console.log('Edit brand:', brand)}
      onView={(brand) => console.log('View brand:', brand)}
      onDelete={handleDelete}
    />
  );
}