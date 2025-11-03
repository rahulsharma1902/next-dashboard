// components/admin-dashboard/brand/BrandDetail.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LoadingOverlay } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  IconBuildingStore,
  IconMail,
  IconPhone,
  IconMapPin,
  IconWorld,
  IconStar,
  IconMessage,
  IconFileText,
  IconCalendar,
} from '@tabler/icons-react';
import DynamicView from '../../../components/DynamicView/DynamicView';
import useAuthStore from '../../../store/useAuthStore';
import { axiosWrapper } from '../../../utils/api';
import { BRAND_API } from '../../../utils/apiUrl';
import { showErrorNotification } from '../../../utils/notificationHelper';

export default function BrandDetail() {
  const router = useRouter();
  const params = useParams();
  const brandId = params.id;

  const [loading, setLoading] = useState(true);
  const [brandData, setBrandData] = useState(null);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const url = BRAND_API.GET_BRAND.replace(':id', brandId);
        const response = await axiosWrapper('get', url, {}, token);
        setBrandData(response.data);
      } catch (error) {
        console.error('Error fetching brand:', error);
        showErrorNotification(error, 'Failed to fetch brand details');
        router.push('/admin/brands');
      } finally {
        setLoading(false);
      }
    };

    if (brandId) fetchBrand();
  }, [brandId, token, router]);

  const handleEdit = (brand) => {
    router.push(`/admin/brands/edit/${brand._id}`);
  };

  const handleDelete = (brand) => {
    modals.openConfirmModal({
      title: 'Delete Brand',
      children: `Are you sure you want to delete ${brand.name}? This action cannot be undone.`,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          const url = BRAND_API.DELETE_BRAND.replace(':id', brand._id);
          await axiosWrapper('delete', url, {}, token);
          
          notifications.show({
            title: 'Success',
            message: 'Brand deleted successfully',
            color: 'green',
          });
          
          router.push('/admin/brands');
        } catch (error) {
          showErrorNotification(error, 'Failed to delete brand');
        }
      },
    });
  };

  const handleBack = () => {
    router.push('/admin/brands');
  };

  // Define fields for brand view
  const brandFields = [
    {
      name: 'logoUrl',
      label: 'Brand Logo',
      type: 'avatar',
      section: 'Brand Identity',
      span: 12,
      size: 150,
      radius: 'xl',
    },
    {
      name: 'name',
      label: 'Brand Name',
      type: 'text',
      section: 'Brand Identity',
      span: 12,
      icon: <IconBuildingStore size={16} />,
      render: (value) => (
        <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>{value}</span>
      ),
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      section: 'Brand Identity',
      span: 12,
      icon: <IconFileText size={16} />,
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      section: 'Contact Information',
      span: 6,
    },
    {
      name: 'phoneNumber',
      label: 'Phone Number',
      type: 'phone',
      section: 'Contact Information',
      span: 6,
    },
    {
      name: 'postcode',
      label: 'Postcode',
      type: 'text',
      section: 'Contact Information',
      span: 6,
      icon: <IconMapPin size={16} />,
    },
    {
      name: 'websiteUrl',
      label: 'Website',
      type: 'url',
      section: 'Contact Information',
      span: 6,
    },
    {
      name: 'averageRating',
      label: 'Average Rating',
      type: 'rating',
      section: 'Statistics',
      span: 6,
      size: 'lg',
    },
    {
      name: 'totalReviews',
      label: 'Total Reviews',
      type: 'number',
      section: 'Statistics',
      span: 6,
      icon: <IconMessage size={16} />,
      render: (value) => (
        <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#228be6' }}>
          {value || 0}
        </span>
      ),
    },
    {
      name: 'status',
      label: 'Status',
      type: 'badge',
      section: 'Status',
      span: 12,
      getColor: (value) => {
        if (value === 'ACTIVE') return 'green';
        if (value === 'INACTIVE') return 'gray';
        if (value === 'PENDING') return 'blue';
        return 'gray';
      },
    },
  ];

  if (loading) {
    return <LoadingOverlay visible={true} />;
  }

  if (!brandData) {
    return null;
  }

  return (
    <DynamicView
      title={`Brand Details: ${brandData.name}`}
      data={brandData}
      fields={brandFields}
      loading={loading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
    />
  );
}