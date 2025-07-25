import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { analyzeText, RecognitionResult } from "../services/apiService";

interface SearchPageProps {
  onBack?: () => void;
  onRecognitionResult?: (result: RecognitionResult, imageUri: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({
  onBack,
  onRecognitionResult,
}) => {
  const [fruitLabel, setFruitLabel] = useState("");
  const [price, setPrice] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState("");

  const handleBack = () => {
    console.log("返回");
    onBack?.();
  };

  const validateInput = (): boolean => {
    if (!fruitLabel.trim()) {
      Alert.alert("提示", "请输入水果名称");
      return false;
    }

    if (!price.trim()) {
      Alert.alert("提示", "请输入价格");
      return false;
    }

    // 验证价格格式（支持小数）
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    if (!priceRegex.test(price.trim())) {
      Alert.alert("提示", "请输入正确的价格格式（如：10.5）");
      return false;
    }

    return true;
  };

  const handleAnalyze = async () => {
    if (!validateInput()) return;

    setIsAnalyzing(true);
    setAnalysisProgress("正在连接服务器...");
    console.log("开始文字识别:", { fruitLabel, price });

    try {
      // 添加进度提示
      const progressTimer = setTimeout(() => {
        setAnalysisProgress("正在分析水果信息...");
      }, 2000);

      const progressTimer2 = setTimeout(() => {
        setAnalysisProgress("正在生成分析报告...");
      }, 5000);

      const result = await analyzeText(fruitLabel, price);

      // 清除定时器
      clearTimeout(progressTimer);
      clearTimeout(progressTimer2);

      console.log("识别成功:", result);

      // 由于是文字输入，没有实际图片，使用空字符串作为imageUri
      onRecognitionResult?.(result, "");
    } catch (error) {
      console.error("识别失败:", error);

      let errorMessage = "请检查网络连接后重试";
      if (error instanceof Error) {
        if (
          error.message.includes("timeout") ||
          error.message.includes("超时")
        ) {
          errorMessage = "服务器响应超时，请稍后重试";
        } else if (
          error.message.includes("Network Error") ||
          error.message.includes("无法连接")
        ) {
          errorMessage = "无法连接到服务器，请检查网络连接";
        } else if (error.message.includes("400")) {
          errorMessage = "输入信息有误，请检查水果名称和价格";
        } else {
          errorMessage = error.message;
        }
      }

      Alert.alert("识别失败", errorMessage, [
        { text: "取消", style: "cancel" },
        { text: "重试", onPress: () => handleAnalyze() },
      ]);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress("");
    }
  };

  const handleClearInput = () => {
    setFruitLabel("");
    setPrice("");
  };

  const handleQuickInput = (fruit: string, defaultPrice: string) => {
    setFruitLabel(fruit);
    setPrice(defaultPrice);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
            <Text style={styles.headerButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>文字识别</Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* 输入说明 */}
        <View style={styles.instructionSection}>
          <Text style={styles.instructionTitle}>输入水果信息</Text>
          <Text style={styles.instructionText}>
            请输入水果名称和价格，我们将为您提供专业的分析
          </Text>
        </View>

        {/* 输入区域 */}
        <View style={styles.inputSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>水果名称</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🍎</Text>
              <TextInput
                style={styles.textInput}
                placeholder="例如：红富士苹果"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={fruitLabel}
                onChangeText={setFruitLabel}
                returnKeyType="next"
                editable={!isAnalyzing}
              />
              {fruitLabel.length > 0 && !isAnalyzing && (
                <TouchableOpacity onPress={() => setFruitLabel("")}>
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>价格 (元/斤)</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>💰</Text>
              <TextInput
                style={styles.textInput}
                placeholder="例如：8.5"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                returnKeyType="done"
                editable={!isAnalyzing}
              />
              {price.length > 0 && !isAnalyzing && (
                <TouchableOpacity onPress={() => setPrice("")}>
                  <Text style={styles.clearIcon}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 操作按钮 */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.analyzeButton,
                isAnalyzing && styles.analyzingButton,
              ]}
              onPress={handleAnalyze}
              disabled={isAnalyzing || !fruitLabel.trim() || !price.trim()}
            >
              {isAnalyzing ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#370B0B" />
                  <Text style={styles.analyzeButtonText}>分析中...</Text>
                </View>
              ) : (
                <Text style={styles.analyzeButtonText}>开始分析</Text>
              )}
            </TouchableOpacity>

            {!isAnalyzing && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearInput}
              >
                <Text style={styles.clearButtonText}>清空输入</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 分析进度提示 */}
          {isAnalyzing && analysisProgress && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>{analysisProgress}</Text>
              <Text style={styles.progressSubText}>
                请耐心等待，通常需要10-30秒
              </Text>
            </View>
          )}
        </View>

        {/* 快速输入 */}
        {!isAnalyzing && (
          <View style={styles.quickInputSection}>
            <Text style={styles.quickInputTitle}>快速输入</Text>
            <Text style={styles.quickInputSubtitle}>
              点击下方选项快速填入常见水果
            </Text>

            <View style={styles.quickInputGrid}>
              {[
                { name: "红富士苹果", price: "8.5", emoji: "🍎" },
                { name: "脐橙", price: "6.8", emoji: "🍊" },
                { name: "香蕉", price: "5.2", emoji: "🍌" },
                { name: "芒果", price: "12.0", emoji: "🥭" },
                { name: "草莓", price: "15.8", emoji: "🍓" },
                { name: "蓝莓", price: "25.0", emoji: "🫐" },
              ].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickInputItem}
                  onPress={() => handleQuickInput(item.name, item.price)}
                >
                  <Text style={styles.quickInputEmoji}>{item.emoji}</Text>
                  <Text style={styles.quickInputName}>{item.name}</Text>
                  <Text style={styles.quickInputPrice}>¥{item.price}/斤</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 提示信息 */}
        {!isAnalyzing && (
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 使用提示</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>
                • 请输入具体的水果品种，如"红富士苹果"而非"苹果"
              </Text>
              <Text style={styles.tipItem}>
                • 价格请输入当前市场价格，支持小数点后两位
              </Text>
              <Text style={styles.tipItem}>
                • 我们将基于您的输入提供专业的价格和品质分析
              </Text>
              <Text style={styles.tipItem}>
                • 首次分析可能需要较长时间，请耐心等待
              </Text>
            </View>
          </View>
        )}

        {/* 底部间距 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#726B61",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtonText: {
    fontSize: 16,
    color: "white",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "300",
    color: "white",
    marginLeft: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  instructionSection: {
    marginBottom: 32,
    alignItems: "center",
  },
  instructionTitle: {
    fontSize: 24,
    fontWeight: "300",
    color: "white",
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
  },
  inputSection: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "white",
    fontWeight: "300",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "white",
    fontWeight: "300",
  },
  clearIcon: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    padding: 4,
  },
  buttonGroup: {
    gap: 12,
    marginTop: 8,
  },
  analyzeButton: {
    backgroundColor: "rgba(253, 221, 220, 0.9)",
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  analyzingButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  analyzeButtonText: {
    fontSize: 18,
    color: "#370B0B",
    fontWeight: "500",
  },
  loadingIcon: {
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "300",
  },
  quickInputSection: {
    marginBottom: 32,
  },
  quickInputTitle: {
    fontSize: 18,
    color: "white",
    fontWeight: "300",
    marginBottom: 4,
  },
  quickInputSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 16,
  },
  quickInputGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickInputItem: {
    width: "47%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  quickInputEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickInputName: {
    fontSize: 14,
    color: "white",
    fontWeight: "300",
    marginBottom: 4,
    textAlign: "center",
  },
  quickInputPrice: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  tipsSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    color: "white",
    fontWeight: "300",
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  progressText: {
    fontSize: 16,
    color: "white",
    fontWeight: "300",
    marginBottom: 4,
  },
  progressSubText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
});

export default SearchPage;
