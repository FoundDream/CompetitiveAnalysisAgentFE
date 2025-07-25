import axios from "axios";
import { API_CONFIG, DEV_CONFIG, getApiUrl } from "../config/api";

// API响应接口定义
export interface ApiAnalysisResult {
  product_name: string;
  price: string;
  description: string;
  is_overpriced: string;
  price_analysis: string;
  advantage_analysis: string;
  disadvantage_analysis: string;
  user_profile_analysis: string;
  analysis: string;
}

// 转换为应用内部使用的数据结构
export interface RecognitionResult {
  name: string;
  confidence: number;
  description: string;
  price: string;
  isOverpriced: boolean;
  priceAnalysis: string;
  advantageAnalysis: string;
  disadvantageAnalysis: string;
  userProfileAnalysis: string;
  analysis: string;
  // 保留原有的营养信息结构以兼容现有页面
  nutritionFacts: {
    calories: number;
    vitamin_c: string;
    fiber: string;
    sugar: string;
  };
  tips: string[];
}

// 默认营养信息（基于产品名称推测）
const getDefaultNutritionFacts = (productName: string) => {
  const name = productName.toLowerCase();

  if (name.includes("苹果")) {
    return {
      calories: 52,
      vitamin_c: "4.6mg",
      fiber: "2.4g",
      sugar: "10.4g",
    };
  } else if (name.includes("橙") || name.includes("橘")) {
    return {
      calories: 47,
      vitamin_c: "53.2mg",
      fiber: "2.4g",
      sugar: "9.4g",
    };
  } else if (name.includes("芒果")) {
    return {
      calories: 60,
      vitamin_c: "36.4mg",
      fiber: "1.6g",
      sugar: "13.7g",
    };
  } else {
    return {
      calories: 50,
      vitamin_c: "10mg",
      fiber: "2g",
      sugar: "10g",
    };
  }
};

// 默认食用建议（基于产品名称推测）
const getDefaultTips = (productName: string): string[] => {
  const name = productName.toLowerCase();

  if (name.includes("苹果")) {
    return [
      "富含膳食纤维，有助于消化",
      "维生素C含量丰富，增强免疫力",
      "建议连皮食用，营养更全面",
    ];
  } else if (name.includes("橙") || name.includes("橘")) {
    return [
      "维生素C含量极高，增强免疫力",
      "含有丰富的叶酸，适合孕妇食用",
      "饭后食用有助于铁质吸收",
    ];
  } else if (name.includes("芒果")) {
    return [
      "富含β-胡萝卜素，有益眼部健康",
      "含有芒果酮，具有抗氧化作用",
      "过敏体质者需谨慎食用",
    ];
  } else {
    return ["新鲜食用营养价值更高", "适量食用，均衡营养", "注意清洗干净"];
  }
};

// 图片分析API调用
export const analyzeImage = async (
  imageUri: string
): Promise<RecognitionResult> => {
  try {
    // 创建FormData对象
    const formData = new FormData();

    // React Native中的FormData需要特殊处理
    // 获取文件扩展名
    const fileExtension = imageUri.split(".").pop()?.toLowerCase() || "jpg";
    const mimeType = `image/${
      fileExtension === "jpg" ? "jpeg" : fileExtension
    }`;

    // 添加图片文件
    formData.append("file", {
      uri: imageUri,
      type: mimeType,
      name: `image.${fileExtension}`,
    } as any);

    if (DEV_CONFIG.LOG_API_CALLS) {
      console.log("发送图片分析请求:", {
        uri: imageUri,
        type: mimeType,
        name: `image.${fileExtension}`,
      });
    }

    // 发送API请求
    // React Native中不需要手动设置Content-Type，FormData会自动处理
    const response = await axios.post<ApiAnalysisResult>(
      getApiUrl("/analyze"),
      formData,
      {
        timeout: API_CONFIG.TIMEOUT,
        // 在React Native中，让axios自动设置multipart/form-data的Content-Type
        transformRequest: (data, headers) => {
          // 删除Content-Type让axios自动设置
          delete headers["Content-Type"];
          return data;
        },
      }
    );

    if (DEV_CONFIG.LOG_API_CALLS) {
      console.log("API调用成功:", response.data);
    }

    const apiResult = response.data;

    // 转换API响应为应用内部数据结构
    const result: RecognitionResult = {
      name: apiResult.product_name,
      confidence: 0.9, // API没有返回置信度，设置默认值
      description: apiResult.description,
      price: apiResult.price || "未知", // 处理price为null的情况
      isOverpriced: apiResult.is_overpriced === "true",
      priceAnalysis: apiResult.price_analysis,
      advantageAnalysis: apiResult.advantage_analysis,
      disadvantageAnalysis: apiResult.disadvantage_analysis,
      userProfileAnalysis: apiResult.user_profile_analysis,
      analysis: apiResult.analysis,
      nutritionFacts: getDefaultNutritionFacts(apiResult.product_name),
      tips: getDefaultTips(apiResult.product_name),
    };

    return result;
  } catch (error) {
    if (DEV_CONFIG.LOG_API_CALLS) {
      console.error("API调用失败详细信息:", error);
    }

    // 处理不同类型的错误
    if (axios.isAxiosError(error)) {
      if (DEV_CONFIG.LOG_API_CALLS) {
        console.error("Axios错误详情:", {
          code: error.code,
          message: error.message,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            timeout: error.config?.timeout,
          },
          response: error.response
            ? {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
              }
            : null,
        });
      }

      if (error.code === "ECONNABORTED") {
        throw new Error("请求超时，请检查网络连接");
      } else if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          throw new Error(
            `图片格式不支持或请求无效: ${
              error.response.data?.message || "请选择其他图片"
            }`
          );
        } else if (status === 413) {
          throw new Error("图片文件过大，请选择小于10MB的图片");
        } else if (status >= 500) {
          throw new Error(
            `服务器错误 (${status}): ${
              error.response.data?.message || "请稍后重试"
            }`
          );
        } else {
          throw new Error(
            `API错误 (${status}): ${
              error.response.data?.message || "请检查网络连接"
            }`
          );
        }
      } else if (error.request) {
        throw new Error("无法连接到服务器，请检查网络连接和服务器地址");
      } else {
        throw new Error(`请求配置错误: ${error.message}`);
      }
    }

    throw new Error("识别失败，请重试");
  }
};
