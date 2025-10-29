'use client';

import axios from 'axios';
import toast from 'react-hot-toast';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});


const safeToast = {
  success: (msg) => typeof window !== 'undefined' && toast.success(msg),
  error: (msg) => typeof window !== 'undefined' && toast.error(msg),
  dismiss: () => typeof window !== 'undefined' && toast.dismiss(),
};


apiClient.interceptors.response.use(
  (response) => {
    const { config, data } = response;
    const method = (config.method || '').toLowerCase();

    if (['post', 'put', 'patch', 'delete'].includes(method)) {
      const message = data?.message || data?.desc;
      if (message) {
        safeToast.dismiss();
        safeToast.success(message || 'Operation successful');
      }
    }

    return response;
  },
  (error) => {
    safeToast.dismiss();

    const status = error?.response?.status;
    const statusText = error?.response?.statusText;
    const errorData = error?.response?.data || {};
    const message =
      errorData.message ||
      errorData.desc ||
      error.message ||
      'An unexpected error occurred.';

    if (status === 401 || statusText === 'Unauthorized') {
      localStorage.clear();
      safeToast.error('Session expired. Please login again.');
      return Promise.reject(error);
    }

    if (message === 'Validation failed') {
      const validationMsg =
        errorData?.validation?.body?.message || 'Validation error occurred.';
      safeToast.error(validationMsg);
      return Promise.reject(error);
    }

    safeToast.error(message);
    return Promise.reject(error);
  }
);

export async function axiosWrapper(method, url, data, token, isFormData = false) {
  const config = {
    method,
    url,
    headers: {
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (data) {
    config.data = data;
  }

  try {
    const response = await apiClient.request(config);
    return response.data;
  } catch (error) {
    const errResponse = error?.response?.data || {
      message: error?.message || 'Unknown error',
    };
    throw errResponse;
  }
}

export default apiClient;
