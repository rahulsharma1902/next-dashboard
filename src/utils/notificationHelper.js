// utils/notificationHelper.js
import { notifications } from '@mantine/notifications';

export function showErrorNotification(error, defaultMessage = 'Something went wrong') {
  let message = defaultMessage;

  try {
    // Try various places where the backend error might reside
    const respData = error?.response?.data
      || error?.data
      || error?.error
      || null;

    console.error('Error response data:', respData);
    console.error('Full error object:', error);

    if (respData && typeof respData === 'object') {
      if (typeof respData.desc === 'string') {
        message = respData.desc;
      }
      else if (respData.validation) {
        const val = respData.validation.body
          || respData.validation.query
          || respData.validation.params
          || null;

        if (val) {
          if (Array.isArray(val.keys) && val.keys.length > 0) {
            const keysStr = val.keys.join(', ');
            const valMsg = typeof val.message === 'string' ? val.message : '';
            message = `${keysStr}${keysStr ? ': ' : ''}${valMsg}`;
          } else if (typeof val.message === 'string') {
            message = val.message;
          } else {
            message = respData.message || defaultMessage;
          }
        } else {
          message = respData.message || defaultMessage;
        }
      }
      else if (typeof respData.message === 'string') {
        message = respData.message;
      }
    } else if (typeof error?.desc === 'string') {
      message = error.desc;
    } else {
      console.warn('Unexpected error shape:', error);
      // If maybe error.validation is directly on error
      if (error?.validation && error.validation.body && typeof error.validation.body.message === 'string') {
        message = error.validation.body.message;
      }
    }
  } catch (parseErr) {
    console.error('Error in showErrorNotification helper:', parseErr, error);
    // fallback to default
  }

  notifications.show({
    title: 'Error',
    message,
    color: 'red',
  });
}
