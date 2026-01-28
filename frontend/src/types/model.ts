export interface Model {
  id: string;
  name: string | null;
  slug: string;
  cloudinaryId?: string;
  glbUrl: string;
  usdzUrl: string | null;
  usdzReady: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  viewerUrl?: string;
}

export interface UploadResponse {
  success: boolean;
  data: Model;
  message?: string;
}

export interface ModelResponse {
  success: boolean;
  data: Model;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
