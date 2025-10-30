// pages/products.jsx
'use client';

import { useCallback } from 'react';
import { Avatar, Text, Group, Badge } from '@mantine/core';
import { IconCategory, IconCurrencyDollar, IconPackage, IconStar } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import DataTable from '../../../components/DataTable/DataTable';
import useAuthStore from '../../../store/useAuthStore';
import { axiosWrapper } from '../../../utils/api';
import { PRODUCT_API } from '../../../utils/apiUrl';

export default function ProductsPage() {
  const fetchProducts = useCallback(async (params) => {
    const token = useAuthStore.getState().token;
    const queryString = new URLSearchParams(params).toString();

    const response = await axiosWrapper(
      'get',
      `${PRODUCT_API.GET_ALL_PRODUCTS}?${queryString}`,
      {},
      token,
    );
    return response.data;
  }, []);

  const handleDelete = async (product) => {
    try {
      const token = useAuthStore.getState().token;
      await axiosWrapper(
        'delete',
        `${PRODUCT_API.GET_ALL_PRODUCTS}/${product._id}`,
        {},
        token
      );
      notifications.show({
        title: 'Success',
        message: 'Product deleted successfully',
        color: 'green',
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete product',
        color: 'red',
      });
    }
  };

  const handleAddProduct = () => {
    // Navigate to add product page or open modal
    console.log('Add new product');
    notifications.show({
      title: 'Info',
      message: 'Navigate to add product form',
      color: 'blue',
    });
  };

  const handleEditProduct = (product) => {
    // Navigate to edit product page or open modal
    console.log('Edit product:', product);
    notifications.show({
      title: 'Info',
      message: `Editing product: ${product.name}`,
      color: 'yellow',
    });
  };

  const handleViewProduct = (product) => {
    // Navigate to product details page
    console.log('View product:', product);
    notifications.show({
      title: 'Info',
      message: `Viewing product: ${product.name}`,
      color: 'blue',
    });
  };

  const columns = [
    {
      key: 'product',
      header: 'Product',
      accessor: 'name',
      sortField: 'name',
      render: (item) => (
        <Group gap="sm">
          <Avatar 
            src={item.images?.[0]} 
            radius="sm" 
            size="md"
            alt={item.name}
          >
            {item.name?.charAt(0)?.toUpperCase() || 'P'}
          </Avatar>
          <div>
            <Text fw={500} size="sm">{item.name}</Text>
            <Text size="xs" c="dimmed">SKU: {item.sku || 'N/A'}</Text>
          </div>
        </Group>
      )
    },
    {
      key: 'category',
      header: 'Category',
      accessor: 'category',
      sortField: 'category',
      render: (item) => (
        <Group gap={6}>
          <IconCategory size={14} opacity={0.6} />
          <Text size="sm">{item.category || '-'}</Text>
        </Group>
      )
    },
    {
      key: 'price',
      header: 'Price',
      accessor: 'price',
      sortField: 'price',
      render: (item) => (
        <Group gap={6}>
          <IconCurrencyDollar size={14} opacity={0.6} />
          <Text size="sm">${item.price?.toFixed(2) || '0.00'}</Text>
        </Group>
      )
    },
    {
      key: 'stock',
      header: 'Stock',
      accessor: 'stock',
      sortField: 'stock',
      render: (item) => (
        <Group gap={6}>
          <IconPackage size={14} opacity={0.6} />
          <Badge 
            color={item.stock > 20 ? 'green' : item.stock > 5 ? 'yellow' : 'red'} 
            variant="light"
            size="sm"
          >
            {item.stock || 0} in stock
          </Badge>
        </Group>
      )
    },
    {
      key: 'rating',
      header: 'Rating',
      accessor: 'rating',
      sortField: 'rating',
      render: (item) => (
        <Group gap={6}>
          <IconStar size={14} opacity={0.6} />
          <Text size="sm">{item.rating ? `${item.rating}/5` : 'No ratings'}</Text>
        </Group>
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
            item.status === 'DRAFT' ? 'yellow' : 
            item.status === 'ARCHIVED' ? 'gray' : 'blue'
          } 
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
      label: 'Product Name',
      type: 'text',
      placeholder: 'Search by product name...',
    },
    {
      key: 'sku',
      label: 'SKU',
      type: 'text',
      placeholder: 'Search by SKU...',
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { value: '', label: 'All Categories' },
        { value: 'electronics', label: 'Electronics' },
        { value: 'clothing', label: 'Clothing' },
        { value: 'home', label: 'Home & Garden' },
        { value: 'sports', label: 'Sports' },
        { value: 'books', label: 'Books' },
        { value: 'beauty', label: 'Beauty' },
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: '', label: 'All Statuses' },
        { value: 'ACTIVE', label: 'Active' },
        { value: 'DRAFT', label: 'Draft' },
        { value: 'ARCHIVED', label: 'Archived' },
      ]
    },
    {
      key: 'minPrice',
      label: 'Min Price',
      type: 'text',
      placeholder: 'Minimum price...',
    },
    {
      key: 'maxPrice',
      label: 'Max Price',
      type: 'text',
      placeholder: 'Maximum price...',
    }
  ];

  const actions = {
    view: true,
    edit: true,
    delete: true,
  };

  const customExport = (data) => {
    // Custom CSV export for products
    const headers = ['Name', 'SKU', 'Category', 'Price', 'Stock', 'Rating', 'Status'];
    const csvContent = [
      headers.join(','),
      ...data.map(product => [
        `"${(product.name || '').replace(/"/g, '""')}"`,
        `"${(product.sku || '').replace(/"/g, '""')}"`,
        `"${(product.category || '').replace(/"/g, '""')}"`,
        product.price || 0,
        product.stock || 0,
        product.rating || 0,
        `"${(product.status || '').replace(/"/g, '""')}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    notifications.show({
      title: 'Success',
      message: `Exported ${data.length} products with custom format`,
      color: 'green',
    });
  };

  return (
    <DataTable
      title="Products Management"
      fetchFunction={fetchProducts}
      columns={columns}
      filters={filters}
      actions={actions}
      onAdd={handleAddProduct}
      onEdit={handleEditProduct}
      onView={handleViewProduct}
      onDelete={handleDelete}
      onExport={customExport}
      defaultLimit={25}
    />
  );
}