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
  user_profile_analysis?: string;
  analysis?: string;
  // 新增口味相关字段
  fresh_level?: string;
  sweet_level?: string;
  sour_level?: string;
  water_level?: string;
  crisp_level?: string;
  // 新增价格趋势字段
  price_trend?: string;
  market_price_range?: string;
  // 新增营养成分分析字段
  nutrition_analysis?: { [key: string]: string };
  // 新增字段
  price_unit?: string;
}

// 口味分析数据结构
export interface TasteProfile {
  sweetness: number | null; // 甜度 (0-5)
  acidity: number | null; // 酸度 (0-5)
  moisture: number | null; // 水分 (0-5)
  crispness: number | null; // 脆度 (0-5)
  freshness: number | null; // 新鲜程度 (0-5)
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
  priceStatus: string; // 价格状态：偏高、略高、正常、略低、偏低
  priceAnalysis: string;
  advantageAnalysis: string;
  disadvantageAnalysis: string;
  userProfileAnalysis: string;
  analysis: string;
  // 营养信息改为动态结构
  nutritionFacts: { [key: string]: string };
  tips: string[];
  // 新增口味分析
  tasteProfile: TasteProfile;
  // 新增价格趋势
  priceTrend: PriceTrendData[];
  market_price_range: string;
}

// 从API数据生成营养信息，如果API没有返回则使用默认值
const getNutritionFactsFromApi = (
  apiResult: ApiAnalysisResult,
  productName: string
): { [key: string]: string } => {
  // 如果API返回了营养分析数据，则使用API数据
  if (
    apiResult.nutrition_analysis &&
    Object.keys(apiResult.nutrition_analysis).length > 0
  ) {
    return apiResult.nutrition_analysis;
  }

  // 如果API没有返回营养数据，则使用基于产品名称的默认值
  const name = productName.toLowerCase();

  if (name.includes("苹果")) {
    return {
      卡路里: "52",
      维生素C: "4.6mg",
      膳食纤维: "2.4g",
      糖分: "10.4g",
    };
  } else if (name.includes("橙") || name.includes("橘")) {
    return {
      卡路里: "47",
      维生素C: "53.2mg",
      膳食纤维: "2.4g",
      糖分: "9.4g",
    };
  } else if (name.includes("芒果")) {
    return {
      卡路里: "60",
      维生素C: "36.4mg",
      膳食纤维: "1.6g",
      糖分: "13.7g",
    };
  } else {
    return {
      卡路里: "50",
      维生素C: "10mg",
      膳食纤维: "2g",
      糖分: "10g",
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

// 从API数据生成口味分析，如果API没有返回则使用默认值
const getTasteProfileFromApi = (
  apiResult: ApiAnalysisResult,
  productName: string
): TasteProfile => {
  // 安全地解析每个字段，null值转换为0
  const parseValue = (value: string | undefined | null): number => {
    if (value === null || value === undefined) return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  return {
    sweetness: parseValue(apiResult.sweet_level),
    acidity: parseValue(apiResult.sour_level),
    moisture: parseValue(apiResult.water_level),
    crispness: parseValue(apiResult.crisp_level),
    freshness: parseValue(apiResult.fresh_level),
  };
};

// 处理价格状态
const getPriceStatus = (isOverpriced: string): string => {
  if (!isOverpriced) return "正常";

  const status = isOverpriced.toLowerCase();

  // 如果后端返回的是具体的状态文本
  if (status.includes("偏高")) return "偏高";
  if (status.includes("略高")) return "略高";
  if (status.includes("偏低")) return "偏低";
  if (status.includes("略低")) return "略低";
  if (status.includes("正常")) return "正常";

  // 兼容原有的true/false格式
  if (status === "true") return "偏高";
  if (status === "false") return "正常";

  // 默认返回正常
  return "正常";
};

// 从API数据生成价格趋势，如果API没有返回则使用模拟数据
const generatePriceTrendFromApi = (
  apiResult: ApiAnalysisResult,
  productName: string,
  currentPrice: string
): PriceTrendData[] => {
  // 如果API返回了价格趋势数据，则解析并使用
  if (apiResult.price_trend) {
    try {
      const priceArray = JSON.parse(apiResult.price_trend) as number[];
      const trend: PriceTrendData[] = [];
      const today = new Date();

      // 生成最近6个月的标签（从当前月往前推）
      for (let i = 0; i < priceArray.length; i++) {
        const monthsAgo = priceArray.length - 1 - i;
        const date = new Date(today);
        date.setMonth(date.getMonth() - monthsAgo);

        trend.push({
          date: date.toISOString().split("T")[0],
          price: priceArray[i],
        });
      }

      return trend;
    } catch (error) {
      console.warn("解析价格趋势数据失败:", error);
    }
  }
  return [];
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
      getApiUrl("/analyze_image"),
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
      priceStatus: getPriceStatus(apiResult.is_overpriced),
      priceAnalysis: apiResult.price_analysis,
      advantageAnalysis: apiResult.advantage_analysis,
      disadvantageAnalysis: apiResult.disadvantage_analysis,
      userProfileAnalysis: apiResult.user_profile_analysis || "无特殊建议",
      analysis: apiResult.analysis || "暂无详细分析",
      nutritionFacts: getNutritionFactsFromApi(
        apiResult,
        apiResult.product_name
      ),
      tips: getDefaultTips(apiResult.product_name),
      tasteProfile: getTasteProfileFromApi(apiResult, apiResult.product_name),
      priceTrend: generatePriceTrendFromApi(
        apiResult,
        apiResult.product_name,
        apiResult.price || "10.0"
      ),
      market_price_range: apiResult.market_price_range || "未知",
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
      product_name: fruitLabel.trim(),
      price: `${price.trim()}元/斤`,
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
      priceStatus: getPriceStatus(apiResult.is_overpriced),
      priceAnalysis: apiResult.price_analysis,
      advantageAnalysis: apiResult.advantage_analysis,
      disadvantageAnalysis: apiResult.disadvantage_analysis,
      userProfileAnalysis: apiResult.user_profile_analysis || "无特殊建议",
      analysis: apiResult.analysis || "暂无详细分析",
      nutritionFacts: getNutritionFactsFromApi(
        apiResult,
        apiResult.product_name
      ),
      tips: getDefaultTips(apiResult.product_name),
      tasteProfile: getTasteProfileFromApi(apiResult, apiResult.product_name),
      priceTrend: generatePriceTrendFromApi(
        apiResult,
        apiResult.product_name,
        apiResult.price || price
      ),
      market_price_range: apiResult.market_price_range || price,
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

      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        throw new Error("服务器响应超时，AI分析需要较长时间，请稍后重试");
      } else if (error.code === "ERR_NETWORK") {
        throw new Error("网络连接失败，请检查网络连接或稍后重试");
      } else if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          throw new Error(
            `输入信息无效: ${
              error.response.data?.message || "请检查水果名称和价格格式"
            }`
          );
        } else if (status === 422) {
          throw new Error("输入数据格式错误，请检查水果名称和价格");
        } else if (status === 500) {
          throw new Error("服务器内部错误，AI分析服务暂时不可用");
        } else if (status >= 500) {
          throw new Error(
            `服务器错误 (${status}): AI服务暂时不可用，请稍后重试`
          );
        } else {
          throw new Error(
            `API错误 (${status}): ${
              error.response.data?.message || "请检查网络连接"
            }`
          );
        }
      } else if (error.request) {
        throw new Error("无法连接到AI分析服务器，请检查网络连接");
      } else {
        throw new Error(`请求配置错误: ${error.message}`);
      }
    }

    throw new Error("AI分析失败，请重试");
  }
};

// 个性化推荐API响应接口
export interface RecommendationApiResponse {
  success: boolean;
  data: string;
  input: {
    budget: string;
    special_remark: string;
    available_fruits: string[];
  };
}

// 个性化推荐API调用
export const getPersonalizedRecommendation = async (
  budget: string,
  specialRemark: string,
  availableFruits: string[]
): Promise<string> => {
  try {
    // 创建请求数据
    const requestData = {
      budget: budget,
      special_remark: specialRemark,
      available_fruits: availableFruits,
    };

    if (DEV_CONFIG.LOG_API_CALLS) {
      console.log("发送个性化推荐请求:", requestData);
    }

    // 发送API请求
    const response = await axios.post<RecommendationApiResponse>(
      getApiUrl("/recommend_fruits"),
      requestData,
      {
        timeout: API_CONFIG.TIMEOUT,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (DEV_CONFIG.LOG_API_CALLS) {
      console.log("个性化推荐API调用成功:", response.data);
    }

    const apiResult = response.data;

    if (!apiResult.success) {
      throw new Error("API返回失败状态");
    }

    // 处理返回的推荐结果
    let recommendationText = apiResult.data;

    // 如果返回的是JSON格式的字符串，尝试解析并提取value
    try {
      const parsedData = JSON.parse(recommendationText);

      // 如果是对象格式，提取所有value并组合
      if (typeof parsedData === "object" && parsedData !== null) {
        const values = Object.values(parsedData);
        if (values.length > 0) {
          // 将所有推荐内容组合成一个字符串
          recommendationText = values
            .map((value, index) => {
              const fruitName = Object.keys(parsedData)[index];
              return `🍊 **${fruitName}**\n\n${value}`;
            })
            .join("\n\n---\n\n");
        }
      }
    } catch (parseError) {
      // 如果不是JSON格式，直接使用原始文本
      if (DEV_CONFIG.LOG_API_CALLS) {
        console.log("推荐结果不是JSON格式，使用原始文本");
      }
    }

    return recommendationText;
  } catch (error) {
    if (DEV_CONFIG.LOG_API_CALLS) {
      console.error("个性化推荐API调用失败详细信息:", error);
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

      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        throw new Error("AI推荐分析超时，请稍后重试");
      } else if (error.code === "ERR_NETWORK") {
        throw new Error("网络连接失败，请检查网络连接或稍后重试");
      } else if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          throw new Error(
            `推荐请求参数无效: ${
              error.response.data?.message || "请检查预算和水果列表"
            }`
          );
        } else if (status === 422) {
          throw new Error("推荐数据格式错误，请检查输入参数");
        } else if (status === 500) {
          throw new Error("服务器内部错误，AI推荐服务暂时不可用");
        } else if (status >= 500) {
          throw new Error(
            `服务器错误 (${status}): AI推荐服务暂时不可用，请稍后重试`
          );
        } else {
          throw new Error(
            `API错误 (${status}): ${
              error.response.data?.message || "请检查网络连接"
            }`
          );
        }
      } else if (error.request) {
        throw new Error("无法连接到AI推荐服务器，请检查网络连接");
      } else {
        throw new Error(`请求配置错误: ${error.message}`);
      }
    }

    throw new Error("AI推荐分析失败，请重试");
  }
};
