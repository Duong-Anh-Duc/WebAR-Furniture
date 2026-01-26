export const translations = {
  // Common
  common: {
    success: 'Success',
    error: 'Error',
    notFound: 'Not found',
    unauthorized: 'Unauthorized',
    forbidden: 'Forbidden',
    badRequest: 'Bad request',
    internalServerError: 'Internal server error',
  },

  // Model/Upload
  model: {
    uploadSuccess: 'Model uploaded successfully',
    uploadFailed: 'Failed to upload model',
    notFound: 'Model not found',
    invalidFile: 'Invalid file format. Only .glb files are allowed',
    fileTooLarge: 'File size exceeds maximum limit of {size}MB',
    noFile: 'No file uploaded',
    conversionInProgress: 'Model is being optimized for iOS',
    conversionFailed: 'Failed to convert model for iOS',
    conversionReady: 'Model is ready for AR',
    echo3dUploadFailed: 'Failed to upload to echo3D service',
    echo3dError: 'echo3D service error: {error}',
    invalidSlug: 'Invalid model slug',
    deleteFailed: 'Failed to delete model',
    deleteSuccess: 'Model deleted successfully',
  },

  // Validation
  validation: {
    required: '{field} is required',
    invalid: '{field} is invalid',
    tooLong: '{field} is too long',
    tooShort: '{field} is too short',
  },

  // Server
  server: {
    starting: 'Server is starting...',
    started: 'Server started on port {port}',
    error: 'Server error: {error}',
    dbConnected: 'Database connected successfully',
    dbError: 'Database connection error: {error}',
  },
};

export default translations;
