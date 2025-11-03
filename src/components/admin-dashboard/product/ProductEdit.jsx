// components/admin-dashboard/product/EditProduct.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { LoadingOverlay } from '@mantine/core';
import {
  IconPackage,
  IconTag,
  IconBuildingStore,
  IconCurrencyDollar,
  IconPackageExport,
  IconStar,
  IconUpload,
  IconCheckbox,
} from '@tabler/icons-react';
import DynamicForm from '../../../components/DynamicForm/DynamicForm';
import useAuthStore from '../../../store/useAuthStore';
import { axiosWrapper } from '../../../utils/api';
import { PRODUCT_API, BRAND_API } from '../../../utils/apiUrl';
import { showErrorNotification } from '../../../utils/notificationHelper';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const token = useAuthStore((state) => state.token);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const url = PRODUCT_API.GET_PRODUCT.replace(':id', productId);
        const response = await axiosWrapper(
          'get',
          `${url}`,
          {},
          token
        );
        
        // Transform the data to match form field names
        const transformedData = {
          ...response.data,
          // Ensure brandId is properly set
          brandId: response.data.brandId?._id || response.data.brandId,
        };
        
        setProductData(transformedData);
      } catch (error) {
        showErrorNotification(error, 'Failed to fetch product details.');
        router.push('/admin/products');
      } finally {
        setFetchLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, token, router]);

  // Function to fetch brands with search for the select dropdown
  const fetchBrands = useCallback(async (searchQuery = '') => {
    try {
      const params = new URLSearchParams();
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      params.append('limit', '20');
      
      const response = await axiosWrapper(
        'get',
        `${BRAND_API.GET_ALL_BRANDS}?${params.toString()}`,
        {},
        token
      );
      
      if (response.data && response.data.data) {
        return response.data.data.map(brand => ({
          value: brand._id,
          label: brand.name
        }));
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch brands:', err);
      return [];
    }
  }, [token]);

  // Define form fields for Product (same as AddProduct)
  const productFields = [
    {
      name: 'name',
      label: 'Product Name',
      type: 'text',
      placeholder: 'Enter product name',
      required: true,
      icon: <IconPackage size={16} />,
      span: 6,
    },
    {
      name: 'handle',
      label: 'Product Handle',
      type: 'text',
      placeholder: 'product-handle',
      required: true,
      icon: <IconTag size={16} />,
      span: 6,
      description: 'Unique URL-friendly identifier (e.g., "nike-air-max-90")',
      validate: (value) => {
        if (value && !/^[a-z0-9-]+$/.test(value)) {
          return 'Handle can only contain lowercase letters, numbers, and hyphens';
        }
        return null;
      },
    },
    {
      name: 'brandId',
      label: 'Brand',
      type: 'select',
      placeholder: 'Search and select brand...',
      required: true,
      icon: <IconBuildingStore size={16} />,
      span: 6,
      searchable: true,
      clearable: false,
      filterFunction: fetchBrands,
      loadOnMount: true,
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      placeholder: '0.00',
      required: true,
      icon: <IconCurrencyDollar size={16} />,
      span: 6,
      min: 0,
      step: 0.01,
      decimalScale: 2,
      validate: (value) => {
        if (value < 0) {
          return 'Price cannot be negative';
        }
        return null;
      },
    },
    {
      name: 'stockQuantity',
      label: 'Stock Quantity',
      type: 'number',
      placeholder: '0',
      required: true,
      icon: <IconPackageExport size={16} />,
      span: 6,
      min: 0,
      validate: (value) => {
        if (value < 0) {
          return 'Stock quantity cannot be negative';
        }
        return null;
      },
    },
    {
      name: 'image',
      label: 'Product Image',
      type: 'file',
      placeholder: 'Upload product image',
      required: false,
      accept: 'image/*',
      icon: <IconUpload size={16} />,
      previewSize: 120,
      previewRadius: 'md',
      span: 12,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select product status',
      required: true,
      icon: <IconCheckbox size={16} />,
      span: 6,
      options: [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
      ],
    },
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      Object.keys(values).forEach((key) => {
        if (values[key] !== null && values[key] !== undefined && values[key] !== '') {
          if (key === 'image' && values[key] instanceof File) {
            formData.append('image', values[key]);
          } else {
            formData.append(key, values[key]);
          }
        }
      });
      const url = PRODUCT_API.UPDATE_PRODUCT.replace(':id', productId);
      await axiosWrapper(
        'put',
        `${url}`,
        formData,
        token,
        true,
      );

      notifications.show({
        title: 'Success',
        message: 'Product updated successfully',
        color: 'green',
        icon: <IconPackage size={18} />,
      });

      router.push('/admin/products');
    } catch (error) {
      showErrorNotification(error, 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  if (fetchLoading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <DynamicForm
      title="Edit Product"
      fields={productFields}
      initialValues={productData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={loading}
      isEdit={true}
    />
  );
}