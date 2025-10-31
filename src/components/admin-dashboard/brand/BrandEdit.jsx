// components/admin-dashboard/brand/EditBrand.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { LoadingOverlay } from '@mantine/core';
import {
  IconBuildingStore,
  IconMail,
  IconPhone,
  IconMapPin,
  IconFileText,
  IconWorld,
  IconUpload,
} from '@tabler/icons-react';
import DynamicForm from '../../../components/DynamicForm/DynamicForm';
import useAuthStore from '../../../store/useAuthStore';
import { axiosWrapper } from '../../../utils/api';
import { BRAND_API } from '../../../utils/apiUrl';
import { showErrorNotification } from '../../../utils/notificationHelper';

export default function EditBrand() {
  const router = useRouter();
  const params = useParams();
  const brandId = params.id;
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [brandData, setBrandData] = useState(null);
  const token = useAuthStore((state) => state.token);

  // Fetch brand data
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const url = BRAND_API.GET_BRAND.replace(':id', brandId);
        const response = await axiosWrapper(
          'get',
          `${url}`,
          {},
          token
        );
        setBrandData(response.data);
      } catch (error) {
        showErrorNotification(error, 'Failed to to fetch brand details.');

        router.push('/admin/brands');
      } finally {
        setFetchLoading(false);
      }
    };

    if (brandId) {
      fetchBrand();
    }
  }, [brandId, token, router]);

  // Define form fields (same as AddBrand)
  const brandFields = [
    {
      name: 'name',
      label: 'Brand Name',
      type: 'text',
      placeholder: 'Enter brand name',
      required: true,
      icon: <IconBuildingStore size={16} />,
      span: 6,
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'brand@example.com',
      required: true,
      icon: <IconMail size={16} />,
      span: 6,
      validate: (value) => {
        if (value && !/^\S+@\S+$/.test(value)) {
          return 'Invalid email format';
        }
        return null;
      },
    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'text',
      placeholder: '+1234567890',
      required: true,
      icon: <IconPhone size={16} />,
      span: 6,
    },
    {
      name: 'postcode',
      label: 'Postcode',
      type: 'text',
      placeholder: 'Enter postcode',
      required: true,
      icon: <IconMapPin size={16} />,
      span: 6,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Enter brand description',
      required: true,
      icon: <IconFileText size={16} />,
      minRows: 4,
      maxRows: 8,
      span: 12,
    },
    {
      name: 'websiteUrl',
      label: 'Website URL',
      type: 'url',
      placeholder: 'https://example.com',
      required: true,
      icon: <IconWorld size={16} />,
      span: 12,
      validate: (value) => {
        if (value && !/^https?:\/\/.+/.test(value)) {
          return 'Invalid URL format (must start with http:// or https://)';
        }
        return null;
      },
    },
    {
      name: 'logoUrl',
      label: 'Brand Logo',
      type: 'file',
      placeholder: 'Upload brand logo',
      required: false,
      accept: 'image/*',
      icon: <IconUpload size={16} />,
      previewSize: 100,
      previewRadius: 'xl',
      span: 12,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      placeholder: 'Select brand status',
      required: true,
      options: [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
        { value: 'PENDING', label: 'Pending' },
      ],
      span: 6,
    },
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      Object.keys(values).forEach((key) => {
        if (values[key] !== null && values[key] !== undefined && values[key] !== '') {
          if (key === 'logoUrl' && values[key] instanceof File) {
            formData.append('logoUrl', values[key]);
          } else {
            formData.append(key, values[key]);
          }
        }
      });
      const url = BRAND_API.UPDATE_BRAND.replace(':id', brandId);

      await axiosWrapper(
        'put',
        `${url}`,
        formData,
        token,
        true,
      );

      notifications.show({
        title: 'Success',
        message: 'Brand updated successfully',
        color: 'green',
        icon: <IconBuildingStore size={18} />,
      });

      router.push('/admin/brands');
    } catch (error) {
        showErrorNotification(error, 'Failed to create brand');
      
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/brands');
  };

  if (fetchLoading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <DynamicForm
      title="Edit Brand"
      fields={brandFields}
      initialValues={brandData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={loading}
      isEdit={true}
    />
  );
}