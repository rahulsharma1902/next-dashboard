// components/admin-dashboard/review/EditReview.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { LoadingOverlay } from '@mantine/core';
import {
  IconStar,
  IconMail,
  IconUser,
  IconBuildingStore,
  IconShoppingCart,
  IconPhone,
  IconTextCaption,
  IconFileText,
  IconCheckbox,
} from '@tabler/icons-react';
import DynamicForm from '../../../components/DynamicForm/DynamicForm';
import useAuthStore from '../../../store/useAuthStore';
import { axiosWrapper } from '../../../utils/api';
import { REVIEW_API, BRAND_API, PRODUCT_API } from '../../../utils/apiUrl';
import { showErrorNotification } from '../../../utils/notificationHelper';

export default function EditReview() {
  const router = useRouter();
  const params = useParams();
  const reviewId = params.id;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [reviewData, setReviewData] = useState(null);
  const token = useAuthStore((state) => state.token);

  /** ---------------------------
   * Async Fetchers for Select Boxes
   * --------------------------- */
  const fetchBrands = useCallback(async (searchQuery = '') => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      params.append('limit', '20');

      const response = await axiosWrapper(
        'get',
        `${BRAND_API.GET_ALL_BRANDS}?${params.toString()}`,
        {},
        token
      );

      if (response?.data?.data) {
        return response.data.data.map((brand) => ({
          value: brand._id,
          label: brand.name,
        }));
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch brands:', err);
      return [];
    }
  }, [token]);

  const fetchProducts = useCallback(async (searchQuery = '') => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      params.append('limit', '20');

      const response = await axiosWrapper(
        'get',
        `${PRODUCT_API.GET_ALL_PRODUCTS}?${params.toString()}`,
        {},
        token
      );

      if (response?.data?.data) {
        return response.data.data.map((product) => ({
          value: product._id,
          label: product.name,
        }));
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch products:', err);
      return [];
    }
  }, [token]);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const url = REVIEW_API.GET_REVIEW.replace(':id', reviewId);
        const response = await axiosWrapper('get', url, {}, token);
        
        // Process the data to match form expectations
        const data = response.data;
        
        // Convert nested objects to IDs if they exist
        if (data.productId && typeof data.productId === 'object') {
          data.productId = data.productId._id;
        }
        if (data.brandId && typeof data.brandId === 'object') {
          data.brandId = data.brandId._id;
        }

        // Ensure boolean values for checkboxes
        data.privacy_policy = Boolean(data.privacy_policy);
        data.term_and_condition = Boolean(data.term_and_condition);

        setReviewData(data);
      } catch (error) {
        console.error('Error fetching review:', error);
        showErrorNotification(error, 'Failed to fetch review details');
        router.push('/admin/reviews');
      } finally {
        setFetchLoading(false);
      }
    };

    if (reviewId) fetchReview();
  }, [reviewId, token, router]);

  const reviewFields = [
    {
      name: 'reviewTitle',
      label: 'Review Title',
      type: 'text',
      placeholder: 'Enter review title',
      required: true,
      icon: <IconTextCaption size={16} />,
      span: 12,
    },
    {
      name: 'reviewBody',
      label: 'Review Body',
      type: 'textarea',
      placeholder: 'Write your review here...',
      required: true,
      minRows: 4,
      maxRows: 10,
      icon: <IconFileText size={16} />,
      span: 12,
    },
    {
      name: 'reviewType',
      label: 'Review Type',
      type: 'select',
      required: true,
      placeholder: 'Select review type',
      options: [
        { value: 'Product', label: 'Product' },
        { value: 'Brand', label: 'Brand' },
      ],
      icon: <IconBuildingStore size={16} />,
      span: 12,
    },
    {
      name: 'productId',
      label: 'Product',
      type: 'select',
      placeholder: 'Search and select product...',
      required: false,
      searchable: true,
      clearable: true,
      filterFunction: fetchProducts,
      loadOnMount: false,
      icon: <IconShoppingCart size={16} />,
      span: 12,
      dependsOn: 'reviewType',
      showWhen: (values) => values.reviewType === 'Product',
    },
    {
      name: 'brandId',
      label: 'Brand',
      type: 'select',
      placeholder: 'Search and select brand...',
      required: false,
      searchable: true,
      clearable: true,
      filterFunction: fetchBrands,
      loadOnMount: false,
      icon: <IconBuildingStore size={16} />,
      span: 12,
      dependsOn: 'reviewType',
      showWhen: (values) => values.reviewType === 'Brand',
    },
    {
      name: 'product_store_rating',
      label: 'Store Rating (0-5)',
      type: 'number',
      required: true,
      icon: <IconStar size={16} />,
      min: 0,
      max: 5,
      step: 0.5,
      span: 6,
    },
    {
      name: 'seller_rating',
      label: 'Seller Rating (0-5)',
      type: 'number',
      required: true,
      icon: <IconStar size={16} />,
      min: 0,
      max: 5,
      step: 0.5,
      span: 6,
    },
    {
      name: 'product_quality_rating',
      label: 'Quality Rating (0-5)',
      type: 'number',
      required: true,
      icon: <IconStar size={16} />,
      min: 0,
      max: 5,
      step: 0.5,
      span: 6,
    },
    {
      name: 'product_price_rating',
      label: 'Price Rating (0-5)',
      type: 'number',
      required: true,
      icon: <IconStar size={16} />,
      min: 0,
      max: 5,
      step: 0.5,
      span: 6,
    },
    {
      name: 'issue_handling_rating',
      label: 'Issue Handling Rating (0-5)',
      type: 'number',
      required: false,
      icon: <IconStar size={16} />,
      min: 0,
      max: 5,
      step: 0.5,
      span: 6,
    },
    {
      name: 'name',
      label: 'Reviewer Name',
      type: 'text',
      required: true,
      placeholder: 'Enter name',
      icon: <IconUser size={16} />,
      span: 6,
    },
    {
      name: 'email',
      label: 'Reviewer Email',
      type: 'email',
      required: true,
      placeholder: 'example@email.com',
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
      required: false,
      placeholder: '+1234567890',
      icon: <IconPhone size={16} />,
      span: 6,
    },
    {
      name: 'orderId',
      label: 'Order ID',
      type: 'text',
      required: false,
      placeholder: 'Optional',
      icon: <IconShoppingCart size={16} />,
      span: 12,
    },
    {
      name: 'privacy_policy',
      label: 'Accepted Privacy Policy',
      type: 'checkbox',
      required: true,
      span: 6,
      icon: <IconCheckbox size={16} />,
    },
    {
      name: 'term_and_condition',
      label: 'Accepted Terms & Conditions',
      type: 'checkbox',
      required: true,
      span: 6,
      icon: <IconCheckbox size={16} />,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      placeholder: 'Select status',
      options: [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
      ],
      span: 6,
    },
  ];

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      // Create a clean copy of values
      const submitData = { ...values };

      // Validation: Ensure either productId or brandId is provided based on reviewType
      if (submitData.reviewType === 'Product') {
        if (!submitData.productId) {
          notifications.show({
            title: 'Validation Error',
            message: 'Please select a product for product review',
            color: 'red',
          });
          return;
        }
        delete submitData.brandId;
      } else if (submitData.reviewType === 'Brand') {
        if (!submitData.brandId) {
          notifications.show({
            title: 'Validation Error',
            message: 'Please select a brand for brand review',
            color: 'red',
          });
          return;
        }
        delete submitData.productId;
      }

      // Convert string values to proper types if needed
      const numericFields = [
        'product_store_rating',
        'seller_rating',
        'product_quality_rating',
        'product_price_rating',
        'issue_handling_rating'
      ];

      numericFields.forEach(field => {
        if (submitData[field] !== undefined && submitData[field] !== null && submitData[field] !== '') {
          submitData[field] = parseFloat(submitData[field]);
        }
      });

      // Convert checkboxes to boolean
      submitData.privacy_policy = Boolean(submitData.privacy_policy);
      submitData.term_and_condition = Boolean(submitData.term_and_condition);

      console.log('Updating review data:', submitData);

      const url = REVIEW_API.UPDATE_REVIEW.replace(':id', reviewId);
      await axiosWrapper('put', url, submitData, token);

      notifications.show({
        title: 'Success',
        message: 'Review updated successfully',
        color: 'green',
        icon: <IconStar size={18} />,
      });

      router.push('/admin/reviews');
    } catch (error) {
      console.error('Error updating review:', error);
      showErrorNotification(error, 'Failed to update review');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/reviews');
  };

  if (fetchLoading) {
    return <LoadingOverlay visible={true} />;
  }

  return (
    <DynamicForm
      title="Edit Review"
      fields={reviewFields}
      initialValues={reviewData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      loading={loading}
      isEdit={true}
    />
  );
}