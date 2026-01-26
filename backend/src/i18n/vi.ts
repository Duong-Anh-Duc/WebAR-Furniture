export const translations = {
  // Common
  common: {
    success: 'Thành công',
    error: 'Lỗi',
    notFound: 'Không tìm thấy',
    unauthorized: 'Chưa xác thực',
    forbidden: 'Không có quyền truy cập',
    badRequest: 'Yêu cầu không hợp lệ',
    internalServerError: 'Lỗi máy chủ nội bộ',
  },

  // Model/Upload
  model: {
    uploadSuccess: 'Tải lên mô hình thành công',
    uploadFailed: 'Không thể tải lên mô hình',
    notFound: 'Không tìm thấy mô hình',
    invalidFile: 'Định dạng file không hợp lệ. Chỉ chấp nhận file .glb',
    fileTooLarge: 'Kích thước file vượt quá giới hạn {size}MB',
    noFile: 'Chưa có file được tải lên',
    conversionInProgress: 'Đang tối ưu hóa mô hình cho iOS',
    conversionFailed: 'Không thể chuyển đổi mô hình cho iOS',
    conversionReady: 'Mô hình đã sẵn sàng cho AR',
    echo3dUploadFailed: 'Không thể tải lên dịch vụ echo3D',
    echo3dError: 'Lỗi dịch vụ echo3D: {error}',
    invalidSlug: 'Mã định danh mô hình không hợp lệ',
    deleteFailed: 'Không thể xóa mô hình',
    deleteSuccess: 'Đã xóa mô hình thành công',
  },

  // Validation
  validation: {
    required: '{field} là bắt buộc',
    invalid: '{field} không hợp lệ',
    tooLong: '{field} quá dài',
    tooShort: '{field} quá ngắn',
  },

  // Server
  server: {
    starting: 'Máy chủ đang khởi động...',
    started: 'Máy chủ đã khởi động trên cổng {port}',
    error: 'Lỗi máy chủ: {error}',
    dbConnected: 'Kết nối cơ sở dữ liệu thành công',
    dbError: 'Lỗi kết nối cơ sở dữ liệu: {error}',
  },
};

export default translations;
