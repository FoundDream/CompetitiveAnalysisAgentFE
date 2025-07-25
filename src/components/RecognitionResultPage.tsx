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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeftIcon width={20} height={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>识别结果</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onSaveToFavorites?.(result)}
          >
            <HeartIcon width={16} height={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onCompare?.(result)}
          >
            <StatsIcon width={16} height={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 图片和基本信息 */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.fruitImage} />
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>{confidencePercentage}%</Text>
            </View>
          </View>

          <View style={styles.basicInfo}>
            <Text style={styles.fruitName}>{result.name}</Text>
            <Text style={styles.confidenceLabel}>
              识别准确度: {confidencePercentage}%
            </Text>
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
              <Text style={styles.priceValue}>¥{result.price}</Text>
              <View
                style={[
                  styles.priceBadge,
                  result.isOverpriced ? styles.overpriced : styles.reasonable,
                ]}
              >
                <Text style={styles.priceBadgeText}>
                  {result.isOverpriced ? "价格偏高" : "价格合理"}
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

            <View style={styles.userProfileSection}>
              <Text style={styles.userProfileLabel}>适合人群</Text>
              <Text style={styles.userProfileText}>
                {result.userProfileAnalysis}
              </Text>
            </View>

            <View style={styles.comprehensiveAnalysis}>
              <Text style={styles.comprehensiveLabel}>综合分析</Text>
              <Text style={styles.comprehensiveText}>{result.analysis}</Text>
            </View>
          </View>
        </View>

        {/* 营养信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>营养成分 (每100g)</Text>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {result.nutritionFacts.calories}
              </Text>
              <Text style={styles.nutritionLabel}>卡路里</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {result.nutritionFacts.vitamin_c}
              </Text>
              <Text style={styles.nutritionLabel}>维生素C</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {result.nutritionFacts.fiber}
              </Text>
              <Text style={styles.nutritionLabel}>膳食纤维</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {result.nutritionFacts.sugar}
              </Text>
              <Text style={styles.nutritionLabel}>糖分</Text>
            </View>
          </View>
        </View>

        {/* 食用建议 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>食用建议</Text>
          <View style={styles.tipsContainer}>
            {result.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={styles.tipBullet} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => onSaveToFavorites?.(result)}
          >
            <HeartIcon width={20} height={20} color="white" />
            <Text style={styles.primaryButtonText}>收藏到我的水果</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => onCompare?.(result)}
          >
            <StatsIcon width={20} height={20} color="#726B61" />
            <Text style={styles.secondaryButtonText}>添加到比较</Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 24,
  },
  backButton: {
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
    fontWeight: "300",
    color: "white",
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
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
  tipsContainer: {
    gap: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF6B6B",
    marginTop: 7,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 20,
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
  secondaryButton: {
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  secondaryButtonText: {
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
  userProfileSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  userProfileLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  userProfileText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 18,
  },
  comprehensiveAnalysis: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 12,
  },
  comprehensiveLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  comprehensiveText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 20,
  },
});

export default RecognitionResultPage;
