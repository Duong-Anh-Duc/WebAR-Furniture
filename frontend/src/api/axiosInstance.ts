import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Tạo instance axios
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor yêu cầu
axiosInstance.interceptors.request.use(
  (config) => {
    // Thêm token xác thực nếu có
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor phản hồi
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Xử lý các lỗi phổ biến
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 401:
          // Không được phép - xóa token và chuyển hướng đến đăng nhập
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // Bị cấm
          break;
        case 404:
          // Không tìm thấy
          break;
        case 500:
          // Lỗi máy chủ
          break;
        default:
      }
    } else if (error.request) {
      // Lỗi mạng
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// Hàm trợ giúp để xử lý lỗi API
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};
