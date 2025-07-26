import { Platform } from "react-native";

// 网络配置辅助工具
export class NetworkHelper {
  // 常见的开发环境IP地址模式
  private static readonly COMMON_IP_PATTERNS = [
    /^192\.168\.\d+\.\d+$/, // 家庭网络
    /^10\.\d+\.\d+\.\d+$/, // 企业网络
    /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/, // 私有网络
    /^30\.\d+\.\d+\.\d+$/, // 特定网络段
  ];

  // 检测当前可能的IP地址
  static getCurrentNetworkInfo(): string {
    const currentTime = new Date().toLocaleString();
    return `
🌐 网络配置检测 (${currentTime})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 平台信息: ${Platform.OS}
🔧 调试模式: ${__DEV__ ? "开发环境" : "生产环境"}

💡 获取IP地址的方法:
   Mac/Linux: ifconfig | grep "inet " | grep -v 127.0.0.1
   Windows: ipconfig

🔍 常见网络问题排查:
   1. 确保手机和电脑在同一WiFi网络
   2. 检查防火墙是否阻止了8000端口
   3. 确认后端服务正在运行
   4. 尝试在浏览器访问 http://YOUR_IP:8000/health

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  }

  // 验证IP地址格式
  static isValidIP(ip: string): boolean {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) return false;

    const parts = ip.split(".");
    return parts.every((part) => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    });
  }

  // 检查IP是否为常见的开发环境IP
  static isCommonDevIP(ip: string): boolean {
    return this.COMMON_IP_PATTERNS.some((pattern) => pattern.test(ip));
  }

  // 生成API配置建议
  static generateConfigSuggestion(newIP: string): string {
    if (!this.isValidIP(newIP)) {
      return `❌ 无效的IP地址: ${newIP}`;
    }

    const isCommon = this.isCommonDevIP(newIP);
    const suggestion = `
🔧 API配置建议:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

新IP地址: ${newIP} ${isCommon ? "✅ (常见开发环境IP)" : "⚠️ (请确认网络环境)"}

请在 src/config/api.ts 中更新:
COMPUTER_IP: "${newIP}"

完整的API地址将是: http://${newIP}:8000

${
  !isCommon
    ? `
⚠️  注意: 这个IP地址不是常见的开发环境IP段，
   请确认您的网络配置是否正确。
`
    : ""
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
    return suggestion;
  }

  // 测试API连接
  static async testConnection(
    ip: string,
    port: number = 8000
  ): Promise<{
    success: boolean;
    message: string;
    url: string;
  }> {
    // 尝试多个可能的端点
    const endpoints = ["/health", "/", "/api/health", "/docs"];

    for (const endpoint of endpoints) {
      const url = `http://${ip}:${port}${endpoint}`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时

        const response = await fetch(url, {
          method: "GET",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          return {
            success: true,
            message: `✅ API连接成功！(端点: ${endpoint})`,
            url,
          };
        } else if (
          response.status === 404 &&
          endpoint !== endpoints[endpoints.length - 1]
        ) {
          // 如果是404且不是最后一个端点，继续尝试下一个
          continue;
        } else {
          return {
            success: false,
            message: `❌ API返回错误状态: ${response.status} (端点: ${endpoint})`,
            url,
          };
        }
      } catch (error) {
        // 如果不是最后一个端点，继续尝试
        if (endpoint !== endpoints[endpoints.length - 1]) {
          continue;
        }

        let message = "❌ API连接失败";

        if (error instanceof Error) {
          if (error.name === "AbortError") {
            message += ": 连接超时 (5秒)";
          } else if (error.message.includes("Network request failed")) {
            message += ": 网络请求失败，请检查IP地址和端口";
          } else {
            message += `: ${error.message}`;
          }
        }

        return {
          success: false,
          message,
          url,
        };
      }
    }

    // 理论上不会到达这里
    return {
      success: false,
      message: "❌ 所有端点测试失败",
      url: `http://${ip}:${port}`,
    };
  }

  // 完整的网络诊断
  static async diagnoseNetwork(ip: string): Promise<string> {
    const testResult = await this.testConnection(ip);

    return `
🔍 网络诊断结果:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

测试地址: ${testResult.url}
连接状态: ${testResult.message}

${
  !testResult.success
    ? `
🛠️  故障排除建议:
   1. 检查后端服务是否运行: 在电脑上访问 ${testResult.url}
   2. 检查防火墙设置: 确保8000端口未被阻止
   3. 确认网络连接: 手机和电脑是否在同一WiFi
   4. 重启应用: 有时需要重新加载网络配置
   5. 检查Expo tunnel模式: 可能需要切换到LAN模式

💡 快速测试命令:
   curl ${testResult.url}
`
    : `
🎉 网络连接正常！
   您的API配置正确，可以正常使用应用功能。
`
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  }
}

// 导出便捷函数
export const getCurrentNetworkInfo = () =>
  NetworkHelper.getCurrentNetworkInfo();
export const testAPIConnection = (ip: string) =>
  NetworkHelper.testConnection(ip);
export const diagnoseNetwork = (ip: string) =>
  NetworkHelper.diagnoseNetwork(ip);
export const generateConfigSuggestion = (ip: string) =>
  NetworkHelper.generateConfigSuggestion(ip);

// 快速诊断网络连接问题
export const quickDiagnose = async (
  ip: string,
  port: number = 8000
): Promise<void> => {
  console.log("🔍 开始网络诊断...");
  console.log(`📍 目标地址: http://${ip}:${port}`);

  try {
    // 使用Promise.race来实现超时
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 5000)
    );

    // 测试基本连接
    const response = await Promise.race([
      fetch(`http://${ip}:${port}`, { method: "GET" }),
      timeoutPromise,
    ]);

    console.log("✅ 服务器连接成功");
    console.log(`📊 状态码: ${response.status}`);

    // 测试具体API端点
    try {
      const apiTest = await Promise.race([
        fetch(`http://${ip}:${port}/analyze_image`, { method: "POST" }),
        timeoutPromise,
      ]);
      console.log(`🔌 API端点测试: ${apiTest.status}`);
    } catch (apiError) {
      console.log("⚠️ API端点可能不可用，但服务器在运行");
    }
  } catch (error) {
    console.log("❌ 连接失败，可能的原因:");
    console.log("  1. 后端服务未启动");
    console.log("  2. IP地址已变化");
    console.log("  3. 防火墙阻止连接");
    console.log("  4. 网络配置问题");

    // 提供解决建议
    console.log("\n🔧 建议解决步骤:");
    console.log("  1. 检查后端服务是否运行在8000端口");
    console.log("  2. 获取当前IP地址:");
    console.log(
      "     - Mac/Linux: ifconfig | grep 'inet ' | grep -v 127.0.0.1"
    );
    console.log("     - Windows: ipconfig");
    console.log(`  3. 更新 api.ts 中的 COMPUTER_IP 为新IP地址`);
    console.log("  4. 确保手机和电脑在同一WiFi网络");
  }
};
