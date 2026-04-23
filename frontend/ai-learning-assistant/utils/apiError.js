export const normalizeApiError = (error, fallback = 'Something went wrong') => {
  const message =
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    fallback;

  return {
    message,
    statusCode: error?.response?.status,
    raw: error,
  };
};

