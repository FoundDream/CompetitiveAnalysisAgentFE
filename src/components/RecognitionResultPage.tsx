import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { HeartIcon, StatsIcon, ArrowLeftIcon } from "./SvgIcons";
import { RecognitionResult } from "../services/apiService";
import RadarChart from "./RadarChart";
import PriceTrendChart from "./PriceTrendChart";

interface RecognitionResultPageProps {
  result: RecognitionResult;
  imageUri: string;
  onBack?: () => void;
  onSaveToFavorites?: (result: RecognitionResult) => void;
  onCompare?: (result: RecognitionResult) => void;
}

const RecognitionResultPage: React.FC<RecognitionResultPageProps> = ({
  result,
  imageUri,
  onBack,
  onSaveToFavorites,
  onCompare,
}) => {
  const confidencePercentage = Math.round(result.confidence * 100);

  const getFruitEmoji = (name: string) => {
    const fruitName = name.toLowerCase();
    if (fruitName.includes("苹果")) return "🍎";
    if (fruitName.includes("橙") || fruitName.includes("橘")) return "🍊";
    if (fruitName.includes("芒果")) return "🥭";
    if (fruitName.includes("牛油果")) return "🥑";
    if (fruitName.includes("草莓")) return "🍓";
    if (fruitName.includes("香蕉")) return "🍌";
    if (fruitName.includes("葡萄")) return "🍇";
    if (fruitName.includes("蓝莓")) return "🫐";
    if (fruitName.includes("西瓜")) return "🍉";
    if (fruitName.includes("桃") || fruitName.includes("蜜桃")) return "🍑";
    if (fruitName.includes("柠檬")) return "🍋";
    if (fruitName.includes("樱桃")) return "🍒";
    return "🍎"; // 默认苹果图标
  };

  const getPriceBadgeStyle = (status: string) => {
    switch (status) {
      case "偏高":
        return styles.overpriced;
      case "略高":
        return styles.slightlyOverpriced;
      case "正常":
        return styles.reasonable;
      case "略低":
        return styles.slightlyUnderpriced;
      case "偏低":
        return styles.underpriced;
      default:
        return styles.reasonable;
    }
  };

  const getPriceBadgeTextStyle = (status: string) => {
    switch (status) {
      case "偏高":
        return styles.priceBadgeTextOverpriced;
      case "略高":
        return styles.priceBadgeTextSlightlyOverpriced;
      case "正常":
        return styles.priceBadgeTextReasonable;
      case "略低":
        return styles.priceBadgeTextSlightlyUnderpriced;
      case "偏低":
        return styles.priceBadgeTextUnderpriced;
      default:
        return styles.priceBadgeTextReasonable;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* 顶部导航 */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <ArrowLeftIcon width={20} height={20} color="white" />
      </TouchableOpacity>
      <View style={styles.header}>
        <Text style={styles.title}>识别结果</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 图片和基本信息 */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.fruitImage} />
            ) : (
              <View style={styles.defaultImageContainer}>
                <Text style={styles.defaultImageEmoji}>
                  {getFruitEmoji(result.name)}
                </Text>
                <Text style={styles.textInputLabel}>文字输入</Text>
              </View>
            )}
            {/* <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>{confidencePercentage}%</Text>
            </View> */}
          </View>

          <View style={styles.basicInfo}>
            <Text style={styles.fruitName}>{result.name}</Text>
            {/* <Text style={styles.confidenceLabel}>
              识别准确度: {confidencePercentage}%
            </Text> */}
          </View>
        </View>

        {/* 描述 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>水果介绍</Text>
          <View style={styles.descriptionCard}>
            <Text style={styles.description}>{result.description}</Text>
          </View>
        </View>

        {/* 价格分析 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>价格分析</Text>
          <View style={styles.priceAnalysisCard}>
            <View style={styles.priceHeader}>
              <Text style={styles.priceValue}>
                预估: ¥{result.market_price_range.split("元")[0] + "元"}
              </Text>
              <View
                style={[
                  styles.priceBadge,
                  getPriceBadgeStyle(result.priceStatus),
                ]}
              >
                <Text
                  style={[
                    styles.priceBadgeText,
                    getPriceBadgeTextStyle(result.priceStatus),
                  ]}
                >
                  {result.priceStatus}
                </Text>
              </View>
            </View>
            <Text style={styles.priceAnalysisText}>{result.priceAnalysis}</Text>

            <View style={styles.analysisGrid}>
              <View style={styles.analysisItem}>
                <Text style={styles.analysisLabel}>优势</Text>
                <Text style={styles.analysisText}>
                  {result.advantageAnalysis}
                </Text>
              </View>
              <View style={styles.analysisItem}>
                <Text style={styles.analysisLabel}>劣势</Text>
                <Text style={styles.analysisText}>
                  {result.disadvantageAnalysis}
                </Text>
              </View>
            </View>

            {/* 价格趋势图 */}
            <View style={styles.priceTrendSection}>
              <Text style={styles.priceTrendTitle}>价格趋势</Text>
              <PriceTrendChart
                data={result.priceTrend}
                currentPrice={parseFloat(result.market_price_range) || 0}
                width={320}
                height={180}
              />
            </View>
          </View>
        </View>

        {/* 营养信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>营养成分 (每100g)</Text>
          <View style={styles.nutritionGrid}>
            {Object.entries(result.nutritionFacts).map(
              ([key, value], index) => (
                <View key={index} style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{value}</Text>
                  <Text style={styles.nutritionLabel}>{key}</Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* 口味分析 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>口味分析</Text>
          <View style={styles.tasteAnalysisCard}>
            <RadarChart data={result.tasteProfile} size={280} />
            <Text style={styles.tasteNote}>
              * 新鲜程度影响整体口感，但不单独标注
            </Text>
          </View>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => onCompare?.(result)}
          >
            <StatsIcon width={20} height={20} color="#726B61" />
            <Text style={styles.primaryButtonText}>添加到比较</Text>
          </TouchableOpacity>
        </View>

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
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  backButton: {
    position: "absolute",
    left: 30,
    top: 72,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  fruitImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#F3F4F6",
  },
  confidenceBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  confidenceText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  basicInfo: {
    alignItems: "center",
  },
  fruitName: {
    fontSize: 24,
    fontWeight: "300",
    color: "white",
    marginBottom: 4,
  },
  confidenceLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "300",
    color: "white",
    marginBottom: 12,
  },
  descriptionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 20,
  },
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  nutritionItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  actionsSection: {
    gap: 12,
    marginTop: 8,
  },
  primaryButton: {
    height: 48,
    backgroundColor: "#FF6B6B",
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  bottomSpacing: {
    height: 40,
  },
  // 价格分析相关样式
  priceAnalysisCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
  },
  priceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  priceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  reasonable: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
  },
  overpriced: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  slightlyOverpriced: {
    backgroundColor: "rgba(255, 152, 0, 0.2)",
  },
  slightlyUnderpriced: {
    backgroundColor: "rgba(255, 152, 0, 0.2)",
  },
  underpriced: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
  },
  priceBadgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "white",
  },
  priceAnalysisText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 16,
    lineHeight: 20,
  },
  analysisGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  analysisItem: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 12,
  },
  analysisLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  analysisText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 18,
  },
  // 口味分析相关样式
  tasteAnalysisCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  tasteNote: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
  },
  // 价格趋势相关样式
  priceTrendSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  priceTrendTitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 12,
    fontWeight: "500",
  },
  defaultImageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  defaultImageEmoji: {
    fontSize: 80,
    marginBottom: 8,
  },
  textInputLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  priceBadgeTextOverpriced: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FF6B6B",
  },
  priceBadgeTextSlightlyOverpriced: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FF9800",
  },
  priceBadgeTextReasonable: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4CAF50",
  },
  priceBadgeTextSlightlyUnderpriced: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FF9800",
  },
  priceBadgeTextUnderpriced: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FF6B6B",
  },
});

export default RecognitionResultPage;
