// components/admin-dashboard/brand/AddBrand.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
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

export default function AddBrand() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((state) => state.token);

  // Define form fields for Brand
  const brandFields = [
    {
      name: 'name',
      label: 'Brand Name',
      type: 'text',
      placeholder: 'Enter brand name',
      required: false,
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
      defaultValue: 'ACTIVE',
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
      // Create FormData for file upload
      const formData = new FormData();

      // Append all form values
      Object.keys(values).forEach((key) => {
        if (values[key] !== null && values[key] !== undefined && values[key] !== '') {
          if (key === 'logoUrl' && values[key] instanceof File) {
            formData.append('logoUrl', values[key]);  // Changed to logoUrl
          } else {
            formData.append(key, values[key]);
          }
        }
      });

      const response = await axiosWrapper(
        'post',
        BRAND_API.ADD_BRAND,
        formData,
        token,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      notifications.show({
        title: 'Success',
        message: 'Brand created successfully',
        color: 'green',
        icon: <IconBuildingStore size={18} />,
      });

      router.push('/admin/brands');
    } catch (error) {
        showErrorNotification(error, 'Failed to create brand');
    //   notifications.show({
    //     title: 'Error',
    //     message: error.response?.data?.message || error.desc || 'Failed to create brand',
    //     color: 'red',
    //   });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/brands');
  };

  return (
    <DynamicForm
      title="Add New Brand"
      fields={brandFields}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={loading}
      isEdit={false}
    />
  );
}
