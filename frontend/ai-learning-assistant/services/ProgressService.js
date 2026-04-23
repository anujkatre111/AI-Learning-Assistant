import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { normalizeApiError } from '../utils/apiError';

const getDashboardData = async () => {
  try {
    const response = await axiosInstance.get(
      API_PATHS.PROGRESS.GET_DASHBOARD
    );
    return response.data;
  } catch (error) {
    throw normalizeApiError(error, 'Failed to fetch dashboard data');
  }
};

const progressService = {
  getDashboardData,
};

export default progressService;