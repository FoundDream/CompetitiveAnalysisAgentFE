// API配置
export const API_CONFIG = {
  BASE_URL: "http://172.20.10.3:8000", // 使用开发机IP替代localhost
  TIMEOUT: 60000, // 30秒
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ["jpg", "jpeg", "png", "gif", "bmp", "webp"],
};

// 开发环境配置
export const DEV_CONFIG = {
  ENABLE_API_HEALTH_CHECK: true,
  ENABLE_MOCK_DATA: false, // 设置为true时使用mock数据
  LOG_API_CALLS: true,
};

// 获取完整的API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// 检查图片类型是否支持
export const isSupportedImageType = (filename: string): boolean => {
  const extension = filename.toLowerCase().split(".").pop();
  return extension
    ? API_CONFIG.SUPPORTED_IMAGE_TYPES.includes(extension)
    : false;
};
