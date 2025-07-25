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

// 口味分析数据结构
export interface TasteProfile {
  sweetness: number; // 甜度 (0-10)
  acidity: number; // 酸度 (0-10)
  moisture: number; // 水分 (0-10)
  crispness: number; // 脆度 (0-10)
  freshness: number; // 新鲜程度 (0-10)
}

// 价格趋势数据结构
export interface PriceTrendData {
  date: string;
  price: number;
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
  // 新增口味分析
  tasteProfile: TasteProfile;
  // 新增价格趋势
  priceTrend: PriceTrendData[];
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

// 默认口味分析（基于产品名称推测）
const getDefaultTasteProfile = (productName: string): TasteProfile => {
  const name = productName.toLowerCase();

  if (name.includes("苹果")) {
    return {
      sweetness: 7.5,
      acidity: 4.2,
      moisture: 8.1,
      crispness: 9.0,
      freshness: 8.5,
    };
  } else if (name.includes("橙") || name.includes("橘")) {
    return {
      sweetness: 6.8,
      acidity: 7.5,
      moisture: 8.8,
      crispness: 3.5,
      freshness: 8.2,
    };
  } else if (name.includes("芒果")) {
    return {
      sweetness: 8.5,
      acidity: 2.8,
      moisture: 8.3,
      crispness: 2.0,
      freshness: 7.8,
    };
  } else if (name.includes("蓝莓")) {
    return {
      sweetness: 6.2,
      acidity: 5.8,
      moisture: 7.5,
      crispness: 4.5,
      freshness: 8.0,
    };
  } else if (name.includes("牛油果")) {
    return {
      sweetness: 2.5,
      acidity: 1.8,
      moisture: 6.5,
      crispness: 1.5,
      freshness: 7.5,
    };
  } else if (name.includes("草莓")) {
    return {
      sweetness: 7.8,
      acidity: 6.2,
      moisture: 9.0,
      crispness: 3.8,
      freshness: 8.8,
    };
  } else {
    return {
      sweetness: 6.0,
      acidity: 4.0,
      moisture: 7.0,
      crispness: 5.0,
      freshness: 7.5,
    };
  }
};

// 生成价格趋势数据（基于产品名称和当前价格模拟）
const generatePriceTrend = (
  productName: string,
  currentPrice: string
): PriceTrendData[] => {
  const price = parseFloat(currentPrice) || 10.0;
  const trend: PriceTrendData[] = [];
  const today = new Date();

  // 生成过去30天的价格数据
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // 基于产品特性生成价格波动
    let variation = 0;
    const name = productName.toLowerCase();

    if (name.includes("苹果")) {
      // 苹果价格相对稳定，小幅波动
      variation = (Math.random() - 0.5) * 0.4 + Math.sin(i / 10) * 0.3;
    } else if (name.includes("橙") || name.includes("橘")) {
      // 柑橘类季节性波动较大
      variation = (Math.random() - 0.5) * 0.6 + Math.cos(i / 8) * 0.5;
    } else if (name.includes("芒果")) {
      // 芒果价格波动较大
      variation = (Math.random() - 0.5) * 0.8 + Math.sin(i / 12) * 0.4;
    } else if (name.includes("草莓")) {
      // 草莓价格变化明显
      variation = (Math.random() - 0.5) * 1.0 + Math.cos(i / 6) * 0.6;
    } else {
      // 默认波动
      variation = (Math.random() - 0.5) * 0.5 + Math.sin(i / 15) * 0.2;
    }

    // 添加整体趋势（最近价格略有上涨）
    const trendFactor = ((30 - i) / 30) * 0.1;
    const historicalPrice = price * (1 - 0.05 + variation + trendFactor);

    trend.push({
      date: date.toISOString().split("T")[0],
      price: Math.max(0.1, parseFloat(historicalPrice.toFixed(1))),
    });
  }

  return trend;
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
      tasteProfile: getDefaultTasteProfile(apiResult.product_name),
      priceTrend: generatePriceTrend(
        apiResult.product_name,
        apiResult.price || "10.0"
      ),
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

// 文字识别API调用
export const analyzeText = async (
  fruitLabel: string,
  price: string
): Promise<RecognitionResult> => {
  try {
    // 创建请求数据
    const requestData = {
      fruit_name: fruitLabel.trim(),
      price: price.trim(),
    };

    if (DEV_CONFIG.LOG_API_CALLS) {
      console.log("发送文字识别请求:", requestData);
    }

    // 发送API请求
    const response = await axios.post<ApiAnalysisResult>(
      getApiUrl("/analyze_text"),
      requestData,
      {
        timeout: API_CONFIG.TIMEOUT,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (DEV_CONFIG.LOG_API_CALLS) {
      console.log("文字识别API调用成功:", response.data);
    }

    const apiResult = response.data;

    // 转换API响应为应用内部数据结构
    const result: RecognitionResult = {
      name: apiResult.product_name,
      confidence: 0.95, // 文字输入的置信度设置为95%
      description: apiResult.description,
      price: apiResult.price || price, // 使用API返回的价格或用户输入的价格
      isOverpriced: apiResult.is_overpriced === "true",
      priceAnalysis: apiResult.price_analysis,
      advantageAnalysis: apiResult.advantage_analysis,
      disadvantageAnalysis: apiResult.disadvantage_analysis,
      userProfileAnalysis: apiResult.user_profile_analysis,
      analysis: apiResult.analysis,
      nutritionFacts: getDefaultNutritionFacts(apiResult.product_name),
      tips: getDefaultTips(apiResult.product_name),
      tasteProfile: getDefaultTasteProfile(apiResult.product_name),
      priceTrend: generatePriceTrend(
        apiResult.product_name,
        apiResult.price || price
      ),
    };

    return result;
  } catch (error) {
    if (DEV_CONFIG.LOG_API_CALLS) {
      console.error("文字识别API调用失败详细信息:", error);
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
            `输入信息无效: ${
              error.response.data?.message || "请检查水果名称和价格格式"
            }`
          );
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
