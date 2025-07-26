import { Platform } from "react-native";
import { NetworkHelper } from "./networkHelper";

// 开发环境配置 - 在这里设置你的开发电脑IP地址
const DEVELOPMENT_CONFIG = {
  // 请将此IP地址替换为你的开发电脑的实际IP地址
  // 获取方法：
  // - Mac/Linux: 在终端运行 `ifconfig | grep "inet " | grep -v 127.0.0.1`
  // - Windows: 在命令提示符运行 `ipconfig` 查看IPv4地址
  COMPUTER_IP: "172.20.10.3", // 你的电脑IP地址
  PORT: 8000,

  // 调试选项
  FORCE_USE_IP: true, // 设置为true强制使用IP地址（适用于真机调试）
  ENABLE_LOGGING: true,
};

// 根据平台和调试环境自动选择API地址
const getBaseUrl = (): string => {
  if (!__DEV__) {
    // 生产环境的API地址
    return "https://your-production-api.com";
  }

  // 开发环境
  const { COMPUTER_IP, PORT, FORCE_USE_IP } = DEVELOPMENT_CONFIG;

  // 如果强制使用IP地址（真机调试）
  if (FORCE_USE_IP) {
    return `http://${COMPUTER_IP}:${PORT}`;
  }

  // 根据平台自动选择
  if (Platform.OS === "ios") {
    // iOS模拟器可以使用localhost
    return `http://localhost:8000`;
  } else {
    // Android模拟器使用10.0.2.2
    return `http://10.0.2.2:${PORT}`;
  }
};

// API配置
export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  TIMEOUT: 900000, // 90秒，给AI分析更多时间
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_IMAGE_TYPES: ["jpg", "jpeg", "png", "gif", "bmp", "webp"],
};

// 开发环境配置
export const DEV_CONFIG = {
  ENABLE_API_HEALTH_CHECK: true,
  ENABLE_MOCK_DATA: false, // 设置为true时使用mock数据
  LOG_API_CALLS: DEVELOPMENT_CONFIG.ENABLE_LOGGING,
  // 真机调试配置
  ...DEVELOPMENT_CONFIG,
};

// 获取完整的API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// 获取真机调试时的API URL（手动指定IP）
export const getRealDeviceApiUrl = (endpoint: string, ip?: string): string => {
  const deviceIP = ip || DEVELOPMENT_CONFIG.COMPUTER_IP;
  return `http://${deviceIP}:${DEVELOPMENT_CONFIG.PORT}${endpoint}`;
};

// 切换到真机调试模式的辅助函数
export const enableRealDeviceMode = (ip?: string): string => {
  if (ip) {
    DEVELOPMENT_CONFIG.COMPUTER_IP = ip;
  }
  DEVELOPMENT_CONFIG.FORCE_USE_IP = true;
  const newUrl = getBaseUrl();
  if (DEVELOPMENT_CONFIG.ENABLE_LOGGING) {
    console.log("已切换到真机调试模式，API地址:", newUrl);
  }
  return newUrl;
};

// 检查图片类型是否支持
export const isSupportedImageType = (filename: string): boolean => {
  const extension = filename.toLowerCase().split(".").pop();
  return extension
    ? API_CONFIG.SUPPORTED_IMAGE_TYPES.includes(extension)
    : false;
};

// 调试信息：打印当前使用的API地址
if (__DEV__ && DEVELOPMENT_CONFIG.ENABLE_LOGGING) {
  console.log("🚀 API配置信息:", {
    BASE_URL: API_CONFIG.BASE_URL,
    Platform: Platform.OS,
    isDev: __DEV__,
    forceUseIP: DEVELOPMENT_CONFIG.FORCE_USE_IP,
    computerIP: DEVELOPMENT_CONFIG.COMPUTER_IP,
  });

  // 使用网络诊断工具
  console.log(NetworkHelper.getCurrentNetworkInfo());

  // 异步测试API连接
  NetworkHelper.testConnection(DEVELOPMENT_CONFIG.COMPUTER_IP)
    .then((result) => {
      if (result.success) {
        console.log("✅ API连接测试成功！");
      } else {
        console.log("❌ API连接测试失败:", result.message);
        console.log("🔧 请检查网络配置或运行快速诊断:");
        console.log(
          `   import { quickDiagnose } from './config/networkHelper';`
        );
        console.log(`   quickDiagnose("${DEVELOPMENT_CONFIG.COMPUTER_IP}");`);
      }
    })
    .catch((error) => {
      console.log("⚠️ API连接测试出错:", error.message);
      console.log("🔧 运行快速诊断以获取详细帮助:");
      console.log(`   import { quickDiagnose } from './config/networkHelper';`);
      console.log(`   quickDiagnose("${DEVELOPMENT_CONFIG.COMPUTER_IP}");`);
    });
}
