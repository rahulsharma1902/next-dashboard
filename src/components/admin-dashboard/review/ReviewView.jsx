// components/admin-dashboard/review/ReviewsPage.jsx
'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, Text, Group, Badge, Rating, Stack } from '@mantine/core';
import { 
  IconMessage, 
  IconUser, 
  IconMail, 
  IconPhone,
  IconShoppingCart,
  IconStar,
  IconBuildingStore,
  IconPackage,
  IconX,
  IconStarFilled,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import DataTable from '../../../components/DataTable/DataTable';
import useAuthStore from '../../../store/useAuthStore';
import { axiosWrapper } from '../../../utils/api';
import { REVIEW_API, PRODUCT_API, BRAND_API } from '../../../utils/apiUrl';

export default function ReviewsPage() {
  const router = useRouter();
  
  const fetchReviews = useCallback(async (params) => {
    const token = useAuthStore.getState().token;
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosWrapper(
      'get',
      `${REVIEW_API.GET_ALL_REVIEWS}?${queryString}`,
      {},
      token,
    );
    return response.data;
  }, []);

  const handleDelete = async (review) => {
    modals.openConfirmModal({
      title: 'Delete Review',
      children: (
        <Text size="sm">
          Are you sure you want to delete the review by <strong>{review.name}</strong>? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          const token = useAuthStore.getState().token;
          const URL = REVIEW_API.DELETE_REVIEW.replace(':id', review._id);
          
          await axiosWrapper(
            'delete',
            URL,
            {},
            token
          );
          notifications.show({
            title: 'Success',
            message: 'Review deleted successfully',
            color: 'green',
          });
       
        } catch (err) {
          notifications.show({
            title: 'Error',
            message: err.response?.data?.message || 'Failed to delete review',
            color: 'red',
          });
        }
      },
    });
  };

  const handleEdit = (review) => {
    router.push(`/admin/reviews/edit/${review._id}`);
  };

  const handleView = (review) => {
    router.push(`/admin/reviews/${review._id}`);
  };

  const handleStatusChange = async (review, newStatus) => {
    try {
      const token = useAuthStore.getState().token;
      const URL = REVIEW_API.STATUS_REVIEW.replace(':id', review._id);
      
      await axiosWrapper(
        'put',
        URL,
        { status: newStatus },
        token
      );
      
      notifications.show({
        title: 'Success',
        message: `Review ${newStatus.toLowerCase()} successfully`,
        color: 'green',
      });
      
      // Refresh the table
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err.response?.data?.message || 'Failed to update review status',
        color: 'red',
      });
    }
  };

  const columns = [
    {
      key: 'review',
      header: 'Review',
      accessor: 'reviewTitle',
      sortField: 'reviewTitle',
      render: (item) => (
        <Group gap="sm" align="flex-start">
          <Avatar 
            radius="xl" 
            size="md"
            color={item.reviewType === 'Product' ? 'blue' : 'green'}
          >
            {item.reviewType === 'Product' ? 'P' : 'B'}
          </Avatar>
          <div style={{ flex: 1 }}>
            <Text fw={500} size="sm" lineClamp={1}>
              {item.reviewTitle || 'No Title'}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={2}>
              {item.reviewBody || 'No review content'}
            </Text>
            <Group gap="xs" mt={4}>
              <Badge 
                size="xs" 
                color={item.reviewType === 'Product' ? 'blue' : 'green'}
                variant="light"
              >
                {item.reviewType}
              </Badge>
              {item.reviewType === 'Product' && item.productId && (
                <Badge size="xs" variant="outline">
                  Product
                </Badge>
              )}
              {item.reviewType === 'Brand' && item.brandId && (
                <Badge size="xs" variant="outline">
                  Brand
                </Badge>
              )}
            </Group>
          </div>
        </Group>
      )
    },
    {
      key: 'reviewer',
      header: 'Reviewer',
      accessor: 'name',
      sortField: 'name',
      render: (item) => (
        <Stack gap={2}>
          <Group gap={6}>
            <IconUser size={14} opacity={0.6} />
            <Text size="sm" fw={500}>{item.name}</Text>
          </Group>
          <Group gap={6}>
            <IconMail size={12} opacity={0.6} />
            <Text size="xs" c="dimmed">{item.email}</Text>
          </Group>
          {item.phoneNumber && (
            <Group gap={6}>
              <IconPhone size={12} opacity={0.6} />
              <Text size="xs" c="dimmed">{item.phoneNumber}</Text>
            </Group>
          )}
        </Stack>
      )
    },
    {
      key: 'ratings',
      header: 'Ratings',
      accessor: 'product_store_rating',
      sortField: 'product_store_rating',
      render: (item) => (
        <Stack gap={4}>
          <Group gap={4}>
            <Text size="xs" c="dimmed">Overall:</Text>
            <Rating value={item.product_store_rating} readOnly size="xs" />
            <Text size="xs" fw={500}>({item.product_store_rating})</Text>
          </Group>
          <Group gap={4}>
            <Text size="xs" c="dimmed">Seller:</Text>
            <Rating value={item.seller_rating} readOnly size="xs" />
          </Group>
          <Group gap={4}>
            <Text size="xs" c="dimmed">Quality:</Text>
            <Rating value={item.product_quality_rating} readOnly size="xs" />
          </Group>
          <Group gap={4}>
            <Text size="xs" c="dimmed">Price:</Text>
            <Rating value={item.product_price_rating} readOnly size="xs" />
          </Group>
          {item.issue_handling_rating && (
            <Group gap={4}>
              <Text size="xs" c="dimmed">Issue Handling:</Text>
              <Rating value={item.issue_handling_rating} readOnly size="xs" />
            </Group>
          )}
        </Stack>
      )
    },
    {
      key: 'target',
      header: 'Target',
      accessor: 'reviewType',
      render: (item) => (
        <Stack gap={4}>
          {item.reviewType === 'Product' && item.productId ? (
            <Group gap={6}>
              <IconPackage size={14} opacity={0.6} />
              <Text size="sm">Product</Text>
            </Group>
          ) : item.reviewType === 'Brand' && item.brandId ? (
            <Group gap={6}>
              <IconBuildingStore size={14} opacity={0.6} />
              <Text size="sm">Brand</Text>
            </Group>
          ) : (
            <Text size="sm" c="dimmed">Unknown</Text>
          )}
          {item.orderId && (
            <Group gap={6}>
              <IconShoppingCart size={12} opacity={0.6} />
              <Text size="xs" c="dimmed">Order: {item.orderId}</Text>
            </Group>
          )}
        </Stack>
      )
    },
    {
      key: 'status',
      header: 'Status',
      accessor: 'status',
      sortField: 'status',
      render: (item) => (
        <Badge 
          color={
            item.status === 'ACTIVE' ? 'green' : 
            item.status === 'INACTIVE' ? 'gray' : 'blue'
          } 
          variant="light"
          size="sm"
        >
          {item.status || 'UNKNOWN'}
        </Badge>
      )
    },
    {
      key: 'date',
      header: 'Date',
      accessor: 'createdAt',
      sortField: 'createdAt',
      render: (item) => (
        <Stack gap={2}>
          <Text size="sm" fw={500}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <Text size="xs" c="dimmed">
            {new Date(item.createdAt).toLocaleTimeString()}
          </Text>
        </Stack>
      )
    },
  ];

  const filters = [
    {
      key: 'reviewTitle',
      label: 'Review Title',
      type: 'text',
      placeholder: 'Search by review title...',
      icon: <IconMessage size={16} />
    },
    {
      key: 'name',
      label: 'Reviewer Name',
      type: 'text',
      placeholder: 'Search by reviewer name...',
      icon: <IconUser size={16} />
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      placeholder: 'Search by email...',
      icon: <IconMail size={16} />
    },
    {
      key: 'reviewType',
      label: 'Review Type',
      type: 'select',
      options: [
        { value: '', label: 'All Types' },
        { value: 'Product', label: 'Product Review' },
        { value: 'Brand', label: 'Brand Review' },
      ]
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
    {
      key: 'minRating',
      label: 'Min Rating',
      type: 'select',
      options: [
        { value: '', label: 'Any Rating' },
        { value: '1', label: '1+ Stars' },
        { value: '2', label: '2+ Stars' },
        { value: '3', label: '3+ Stars' },
        { value: '4', label: '4+ Stars' },
        { value: '5', label: '5 Stars' },
      ]
    },
  ];

  const actions = {
    view: true,
    edit: true,
    delete: true,
    custom: [
      {
        tooltip: 'Activate Review',
        color: 'green',
        icon: <IconStarFilled size={16} />,
        onClick: (review) => handleStatusChange(review, 'ACTIVE'),
        showCondition: (review) => review.status === 'INACTIVE' // Only show when INACTIVE
      },
      {
        tooltip: 'Deactivate Review',
        color: 'orange',
        icon: <IconX size={16} />,
        onClick: (review) => handleStatusChange(review, 'INACTIVE'),
        showCondition: (review) => review.status === 'ACTIVE' // Only show when ACTIVE
      }
    ]
  };

  const customExport = (data) => {
    const headers = [
      'Review Title', 
      'Review Body', 
      'Reviewer Name', 
      'Email', 
      'Review Type', 
      'Status',
      'Overall Rating',
      'Seller Rating',
      'Quality Rating',
      'Price Rating',
      'Issue Handling Rating',
      'Order ID',
      'Date'
    ];
    
    const csvContent = [
      headers.join(','),
      ...data.map(review => [
        `"${(review.reviewTitle || '').replace(/"/g, '""')}"`,
        `"${(review.reviewBody || '').replace(/"/g, '""')}"`,
        `"${(review.name || '').replace(/"/g, '""')}"`,
        `"${(review.email || '').replace(/"/g, '""')}"`,
        `"${(review.reviewType || '').replace(/"/g, '""')}"`,
        `"${(review.status || '').replace(/"/g, '""')}"`,
        review.product_store_rating || 0,
        review.seller_rating || 0,
        review.product_quality_rating || 0,
        review.product_price_rating || 0,
        review.issue_handling_rating || '',
        `"${(review.orderId || '').replace(/"/g, '""')}"`,
        `"${new Date(review.createdAt).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reviews_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    notifications.show({
      title: 'Success',
      message: `Exported ${data.length} reviews`,
      color: 'green',
    });
  };

  return (
    <DataTable
      title="Reviews Management"
      fetchFunction={fetchReviews}
      columns={columns}
      filters={filters}
      actions={actions}
      onEdit={handleEdit}
      onView={handleView}
      onDelete={handleDelete}
      onExport={customExport}
      defaultLimit={25}
      addEnabled={false} // Since reviews are typically submitted by users, not admins
    />
  );
}