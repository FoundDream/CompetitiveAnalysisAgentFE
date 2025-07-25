import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { RecognitionResult } from "../services/apiService";

// 比较项的数据结构
export interface CompareItem {
  id: string;
  name: string;
  price: string;
  priceStatus: string;
  rating: number;
  sweetness: number;
  acidity: number;
  moisture: number;
  crispness: number;
  freshness: number;
  origin: string;
  description: string;
  analysis: string;
  nutritionFacts: { [key: string]: string };
  addedAt: Date;
  // 从RecognitionResult转换而来的完整数据
  fullData: RecognitionResult;
}

// Store状态
interface CompareState {
  items: CompareItem[];
  maxItems: number;
}

// Action类型
type CompareAction =
  | { type: "ADD_ITEM"; payload: RecognitionResult }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_ALL" }
  | {
      type: "UPDATE_ITEM";
      payload: { id: string; data: Partial<CompareItem> };
    };

// 初始状态
const initialState: CompareState = {
  items: [],
  maxItems: 3, // 最多比较3个水果
};

// Reducer
const compareReducer = (
  state: CompareState,
  action: CompareAction
): CompareState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const result = action.payload;

      // 检查是否已经存在相同的水果
      const existingIndex = state.items.findIndex(
        (item) => item.name.toLowerCase() === result.name.toLowerCase()
      );

      if (existingIndex !== -1) {
        // 如果已存在，更新数据
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = convertResultToCompareItem(result);
        return {
          ...state,
          items: updatedItems,
        };
      }

      // 如果达到最大数量，移除最旧的项目
      let newItems = [...state.items];
      if (newItems.length >= state.maxItems) {
        newItems = newItems.slice(1); // 移除第一个（最旧的）
      }

      // 添加新项目
      newItems.push(convertResultToCompareItem(result));

      return {
        ...state,
        items: newItems,
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "CLEAR_ALL":
      return {
        ...state,
        items: [],
      };

    case "UPDATE_ITEM": {
      const { id, data } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, ...data } : item
        ),
      };
    }

    default:
      return state;
  }
};

// 将RecognitionResult转换为CompareItem
const convertResultToCompareItem = (result: RecognitionResult): CompareItem => {
  // 从description中提取产地信息，如果没有则使用默认值
  const extractOrigin = (description: string, name: string): string => {
    // 尝试从描述中提取产地信息
    const originMatch = description.match(/产地[：:]?\s*([^，。\s]+)/);
    if (originMatch) return originMatch[1];

    const locationMatch = description.match(/([^，。\s]*[省市县区][^，。\s]*)/);
    if (locationMatch) return locationMatch[1];

    // 根据水果名称推测产地
    if (name.includes("苹果")) return "山东烟台";
    if (name.includes("橙") || name.includes("橘")) return "湖南怀化";
    if (name.includes("芒果")) return "海南三亚";
    if (name.includes("牛油果")) return "进口";
    if (name.includes("草莓")) return "辽宁丹东";

    return "产地未知";
  };

  // 计算综合评分
  const calculateRating = (
    tasteProfile: typeof result.tasteProfile
  ): number => {
    const { sweetness, acidity, moisture, crispness, freshness } = tasteProfile;
    const total = sweetness + acidity + moisture + crispness + freshness;
    const maxTotal = 25; // 5个维度，每个最高5分
    return Math.round((total / maxTotal) * 5 * 10) / 10; // 转换为5分制，保留1位小数
  };

  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: result.name,
    price: result.price,
    priceStatus: result.priceStatus,
    rating: calculateRating(result.tasteProfile),
    sweetness: result.tasteProfile.sweetness,
    acidity: result.tasteProfile.acidity,
    moisture: result.tasteProfile.moisture,
    crispness: result.tasteProfile.crispness,
    freshness: result.tasteProfile.freshness,
    origin: extractOrigin(result.description, result.name),
    description: result.description,
    analysis: result.analysis,
    nutritionFacts: result.nutritionFacts,
    addedAt: new Date(),
    fullData: result,
  };
};

// Context
interface CompareContextType {
  state: CompareState;
  addItem: (result: RecognitionResult) => void;
  removeItem: (id: string) => void;
  clearAll: () => void;
  updateItem: (id: string, data: Partial<CompareItem>) => void;
  isItemInCompare: (name: string) => boolean;
  getItemCount: () => number;
  canAddMore: () => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

// Provider组件
interface CompareProviderProps {
  children: ReactNode;
}

export const CompareProvider: React.FC<CompareProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(compareReducer, initialState);

  const addItem = (result: RecognitionResult) => {
    dispatch({ type: "ADD_ITEM", payload: result });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const clearAll = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  const updateItem = (id: string, data: Partial<CompareItem>) => {
    dispatch({ type: "UPDATE_ITEM", payload: { id, data } });
  };

  const isItemInCompare = (name: string): boolean => {
    return state.items.some(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
  };

  const getItemCount = (): number => {
    return state.items.length;
  };

  const canAddMore = (): boolean => {
    return state.items.length < state.maxItems;
  };

  const value: CompareContextType = {
    state,
    addItem,
    removeItem,
    clearAll,
    updateItem,
    isItemInCompare,
    getItemCount,
    canAddMore,
  };

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
};

// Hook
export const useCompare = (): CompareContextType => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};

// 导出类型
export type { CompareState, CompareAction };
