import { ApiResponse } from '@/types/common';
import { Model, ModelResponse, UploadResponse } from '@/types/model';
import axiosInstance from './axiosInstance';

export const modelApi = {
  /**
   * Tải lên tệp mô hình 3D
   */
  upload: async (file: File): Promise<Model> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post<UploadResponse>('/admin/models/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },

  /**
   * Lấy mô hình theo slug
   */
  getBySlug: async (slug: string): Promise<Model> => {
    try {
      console.log('Calling getBySlug with slug:', slug);
      const response = await axiosInstance.get<ModelResponse>(`/models/${slug}`);
      console.log('getBySlug response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('getBySlug error:', error);
      throw error;
    }
  },

  /**
   * Lấy mô hình theo ID
   */
  getById: async (id: string): Promise<Model> => {
    const response = await axiosInstance.get<ModelResponse>(`/admin/models/${id}`);
    return response.data.data;
  },

  /**
   * Xóa mô hình
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/admin/models/${id}`);
  },

  /**
   * Lấy tất cả mô hình (admin)
   */
  getAll: async (): Promise<Model[]> => {
    const response = await axiosInstance.get<ApiResponse<Model[]>>('/admin/models');
    return response.data.data;
  },
};
