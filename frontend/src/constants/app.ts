export const APP_NAME = 'WebAR Furniture';
export const APP_VERSION = '1.0.0';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['.glb', '.gltf'];

export const API_ENDPOINTS = {
  MODELS: '/models',
  UPLOAD: '/models/upload',
} as const;

export const ROUTES = {
  HOME: '/',
  ADMIN_UPLOAD: '/admin/upload',
  VIEWER: '/p/:slug',
} as const;
