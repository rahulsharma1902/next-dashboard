// components/admin-dashboard/brand/BrandView.jsx
'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, Text, Group, Badge, Rating } from '@mantine/core';
import { IconMail, IconPhone, IconMapPin, IconMessage } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import DataTable from '../../../components/DataTable/DataTable';
import useAuthStore from '../../../store/useAuthStore';
import { axiosWrapper } from '../../../utils/api';
import { BRAND_API } from '../../../utils/apiUrl';

export default function BrandsPage() {
  const router = useRouter();
  
  const fetchBrands = useCallback(async (params) => {
    const token = useAuthStore.getState().token;
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosWrapper(
      'get',
      `${BRAND_API.GET_ALL_BRANDS}?${queryString}`,
      {},
      token,
    );
    return response.data;
  }, []);

  const handleDelete = async (brand) => {
    modals.openConfirmModal({
      title: 'Delete Brand',
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{brand.name}</strong>? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          const token = useAuthStore.getState().token;
          const URL = BRAND_API.DELETE_BRAND.replace(':id', brand._id);
          
          await axiosWrapper(
            'delete',
            URL,
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
            message: err.response?.data?.message || 'Failed to delete brand',
            color: 'red',
          });
        }
      },
    });
  };

  const handleAdd = () => {
    router.push('/admin/brands/add');
  };

  const handleEdit = (brand) => {
    router.push(`/admin/brands/edit/${brand._id}`);
  };

  const handleView = (brand) => {
    router.push(`/admin/brands/${brand._id}`);
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
      key: 'rating',
      header: 'Rating',
      accessor: 'averageRating',
      sortField: 'averageRating',
      render: (item) => {
        const avgRating = item.averageRating ? parseFloat(item.averageRating) : 0;
        return (
          <Group gap="xs">
            <Rating value={parseFloat(avgRating)} readOnly size="sm" />
            <Text size="sm" fw={500}>
              {avgRating.toFixed(1)}
            </Text>
          </Group>
        );
      }
    },
    {
      key: 'reviews',
      header: 'Reviews',
      accessor: 'totalReviews',
      sortField: 'totalReviews',
      render: (item) => (
        <Group gap={6}>
          <IconMessage size={14} opacity={0.6} />
          <Text size="sm" fw={500}>
            {item.totalReviews || 0}
          </Text>
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
    },
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
      onAdd={handleAdd}
      onEdit={handleEdit}
      onView={handleView}
      onDelete={handleDelete}
    />
  );
}