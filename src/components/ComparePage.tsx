import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useCompare } from "../store/CompareStore";
import {
  CameraIcon,
  SearchIcon,
  SettingsIcon,
  StatsIcon,
  UserIcon,
} from "./SvgIcons";

interface ComparePageProps {
  onBack?: () => void;
  onFruitPress?: (fruitName: string) => void;
  onNavigateToHome?: () => void;
  onNavigateToCamera?: () => void;
  onNavigateToSearch?: () => void;
}

const ComparePage: React.FC<ComparePageProps> = ({
  onBack,
  onFruitPress,
  onNavigateToHome,
  onNavigateToCamera,
  onNavigateToSearch,
}) => {
  const { state, removeItem, clearAll } = useCompare();
  const compareList = state.items;

  // 个性化分析状态
  const [personalizedPrice, setPersonalizedPrice] = useState("");
  const [personalizedNote, setPersonalizedNote] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // 预留的功能函数
  const handleBack = () => {
    console.log("返回");
    onBack?.();
  };

  const handleAddToCompare = () => {
    Alert.alert(
      "添加水果到比较",
      "请选择添加方式",
      [
        { text: "取消", style: "cancel" },
        {
          text: "📷 拍照识别",
          onPress: () => {
            console.log("选择拍照识别");
            onNavigateToCamera?.();
          },
        },
        {
          text: "✏️ 手动输入",
          onPress: () => {
            console.log("选择手动输入");
            onNavigateToSearch?.();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleRemoveFromCompare = (id: string) => {
    removeItem(id);
    console.log("移除对比项:", id);
  };

  const handleClearAll = () => {
    Alert.alert("确认清空", "确定要清空所有比较项目吗？", [
      { text: "取消", style: "cancel" },
      { text: "确定", style: "destructive", onPress: () => clearAll() },
    ]);
  };

  const handleFruitPress = (fruitName: string) => {
    console.log("查看水果详情:", fruitName);
    // onFruitPress?.(fruitName);
  };

  // 个性化分析处理函数
  const handlePersonalizedAnalysis = async () => {
    if (compareList.length === 0) {
      Alert.alert("提示", "请先添加水果到比较列表");
      return;
    }

    if (!personalizedPrice.trim()) {
      Alert.alert("提示", "请输入您的预算价格");
      return;
    }

    // 验证价格格式
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    if (!priceRegex.test(personalizedPrice.trim())) {
      Alert.alert("提示", "请输入正确的价格格式（如：10.5）");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Mock API调用 - 模拟分析过程
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock分析结果
      const mockResult = generateMockAnalysisResult();
      setAnalysisResult(mockResult);
    } catch (error) {
      Alert.alert("分析失败", "请稍后重试");
      console.error("个性化分析失败:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 生成Mock分析结果
  const generateMockAnalysisResult = (): string => {
    const budget = parseFloat(personalizedPrice);
    const fruitNames = compareList.map((item) => item.name).join("、");
    const avgPrice =
      compareList.reduce((sum, item) => {
        const price = parseFloat(
          item.price.replace("¥", "").replace("/斤", "")
        );
        return sum + price;
      }, 0) / compareList.length;

    let recommendation = "";

    if (budget >= avgPrice) {
      const bestFruit = compareList.reduce((best, current) =>
        current.rating > best.rating ? current : best
      );
      recommendation = `🎯 根据您的预算 ¥${budget}/斤，推荐选择「${bestFruit.name}」\n\n✨ 推荐理由：\n• 综合评分最高（${bestFruit.rating}/5）\n• 在您的预算范围内\n• ${bestFruit.description}`;
    } else {
      const affordableFruits = compareList.filter((item) => {
        const price = parseFloat(
          item.price.replace("¥", "").replace("/斤", "")
        );
        return price <= budget;
      });

      if (affordableFruits.length > 0) {
        const bestAffordable = affordableFruits.reduce((best, current) =>
          current.rating > best.rating ? current : best
        );
        recommendation = `💰 根据您的预算 ¥${budget}/斤，推荐选择「${bestAffordable.name}」\n\n✨ 推荐理由：\n• 在预算范围内的最佳选择\n• 性价比最高\n• ${bestAffordable.description}`;
      } else {
        const cheapest = compareList.reduce((cheapest, current) => {
          const currentPrice = parseFloat(
            current.price.replace("¥", "").replace("/斤", "")
          );
          const cheapestPrice = parseFloat(
            cheapest.price.replace("¥", "").replace("/斤", "")
          );
          return currentPrice < cheapestPrice ? current : cheapest;
        });
        recommendation = `⚠️ 您的预算 ¥${budget}/斤 略低于当前对比水果的价格\n\n💡 建议：\n• 最接近预算的是「${
          cheapest.name
        }」(${cheapest.price})\n• 或者考虑调整预算到 ¥${avgPrice.toFixed(
          1
        )}/斤 左右`;
      }
    }

    if (personalizedNote.trim()) {
      recommendation += `\n\n📝 针对您的备注「${personalizedNote}」：\n• 建议选择口感和品质都符合您需求的水果\n• 可以关注产地和新鲜程度`;
    }

    return recommendation;
  };

  const clearPersonalizedInput = () => {
    setPersonalizedPrice("");
    setPersonalizedNote("");
    setAnalysisResult(null);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Text key={index} style={styles.star}>
        {index < rating ? "⭐" : "☆"}
      </Text>
    ));
  };

  const getFruitEmoji = (name: string) => {
    if (name.includes("苹果")) return "🍎";
    if (name.includes("橙") || name.includes("橘")) return "🍊";
    if (name.includes("芒果")) return "🥭";
    if (name.includes("牛油果")) return "🥑";
    if (name.includes("草莓")) return "🍓";
    return "🍎";
  };

  const getComparisonColor = (value: number, maxValue: number) => {
    const ratio = value / maxValue;
    if (ratio >= 0.8) return "#10B981"; // 绿色 - 优秀
    if (ratio >= 0.6) return "#F59E0B"; // 黄色 - 良好
    return "#EF4444"; // 红色 - 一般
  };

  const renderComparisonRow = (
    label: string,
    key: "sweetness" | "moisture" | "crispness"
  ) => {
    const maxValue = Math.max(...compareList.map((item) => item[key]));

    return (
      <View style={styles.comparisonRow}>
        <Text style={styles.comparisonLabel}>{label}</Text>
        <View style={styles.comparisonValues}>
          {compareList.map((item, index) => (
            <View key={item.id} style={styles.comparisonValueContainer}>
              <View style={styles.comparisonBar}>
                <View
                  style={[
                    styles.comparisonBarFill,
                    {
                      width: `${(item[key] / 5) * 100}%`,
                      backgroundColor: getComparisonColor(item[key], maxValue),
                    },
                  ]}
                />
              </View>
              <Text style={styles.comparisonValue}>{item[key]}/5</Text>
            </View>
          ))}
        </View>
      </View>
    );
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
          <Text style={styles.headerTitle}>对比</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleClearAll}
          >
            <Text style={styles.headerButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {compareList.length === 0 ? (
          /* 空状态 */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <StatsIcon
                width={48}
                height={48}
                color="rgba(255, 255, 255, 0.5)"
              />
            </View>
            <Text style={styles.emptyText}>暂无对比项目</Text>
            <Text style={styles.emptySubText}>从水果详情页添加对比项目</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToCompare}
            >
              <Text style={styles.addButtonText}>+ 添加对比</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* 水果卡片对比 */}
            <View style={styles.compareCardsContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.compareCards}
              >
                {compareList.map((item) => (
                  <View key={item.id} style={styles.compareCard}>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveFromCompare(item.id)}
                    >
                      <Text style={styles.removeButtonText}>✕</Text>
                    </TouchableOpacity>

                    <View style={styles.cardContent}>
                      <View style={styles.cardImageContainer}>
                        <Text style={styles.cardEmoji}>
                          {getFruitEmoji(item.name)}
                        </Text>
                      </View>

                      <Text style={styles.cardName}>{item.name}</Text>
                      <Text style={styles.cardOrigin}>{item.origin}</Text>
                      <Text style={styles.cardPrice}>{item.price}</Text>

                      <View style={styles.cardRating}>
                        <View style={styles.cardStars}>
                          {renderStars(Math.floor(item.rating))}
                        </View>
                        <Text style={styles.cardRatingText}>{item.rating}</Text>
                      </View>

                      <Text style={styles.cardDescription}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                ))}

                {/* 添加更多按钮 */}
                {compareList.length < 3 && (
                  <TouchableOpacity
                    style={styles.addMoreCard}
                    onPress={handleAddToCompare}
                  >
                    <Text style={styles.addMoreIcon}>+</Text>
                    <Text style={styles.addMoreText}>添加对比</Text>
                  </TouchableOpacity>
                )}
              </ScrollView>
            </View>

            {/* 详细对比表格 */}
            <View style={styles.comparisonTableContainer}>
              <Text style={styles.comparisonTitle}>详细对比</Text>

              <View style={styles.comparisonTable}>
                {/* 价格对比 */}
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonLabel}>价格</Text>
                  <View style={styles.comparisonValues}>
                    {compareList.map((item) => (
                      <View
                        key={item.id}
                        style={styles.comparisonValueContainer}
                      >
                        <Text style={styles.priceValue}>{item.price}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* 评分对比 */}
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonLabel}>评分</Text>
                  <View style={styles.comparisonValues}>
                    {compareList.map((item) => (
                      <View
                        key={item.id}
                        style={styles.comparisonValueContainer}
                      >
                        <View style={styles.ratingContainer}>
                          <Text style={styles.ratingIcon}>⭐</Text>
                          <Text style={styles.ratingValue}>{item.rating}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                {/* 口感对比 */}
                {renderComparisonRow("甜度", "sweetness")}
                {renderComparisonRow("汁水", "moisture")}
                {renderComparisonRow("脆度", "crispness")}

                {/* 产地对比 */}
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonLabel}>产地</Text>
                  <View style={styles.comparisonValues}>
                    {compareList.map((item) => (
                      <View
                        key={item.id}
                        style={styles.comparisonValueContainer}
                      >
                        <Text style={styles.originValue}>{item.origin}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* 个性化分析推荐 */}
            <View style={styles.personalizedSection}>
              <View style={styles.personalizedHeader}>
                <SettingsIcon width={20} height={20} color="#FDDDDC" />
                <Text style={styles.personalizedTitle}>个性化分析推荐</Text>
              </View>
              <Text style={styles.personalizedSubtitle}>
                输入您的预算和需求，获得专属推荐
              </Text>

              <View style={styles.inputContainer}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>预算价格 (元/斤)</Text>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIconContainer}>
                      <StatsIcon
                        width={16}
                        height={16}
                        color="rgba(255, 255, 255, 0.7)"
                      />
                    </View>
                    <TextInput
                      style={styles.textInput}
                      placeholder="例如：10.5"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={personalizedPrice}
                      onChangeText={setPersonalizedPrice}
                      keyboardType="decimal-pad"
                      editable={!isAnalyzing}
                    />
                    {personalizedPrice.length > 0 && !isAnalyzing && (
                      <TouchableOpacity
                        onPress={() => setPersonalizedPrice("")}
                      >
                        <Text style={styles.clearIcon}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>备注说明 (可选)</Text>
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputIconContainer}>
                      <UserIcon
                        width={16}
                        height={16}
                        color="rgba(255, 255, 255, 0.7)"
                      />
                    </View>
                    <TextInput
                      style={styles.textInput}
                      placeholder="例如：喜欢甜一点的，给小孩吃"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={personalizedNote}
                      onChangeText={setPersonalizedNote}
                      multiline
                      maxLength={100}
                      editable={!isAnalyzing}
                    />
                    {personalizedNote.length > 0 && !isAnalyzing && (
                      <TouchableOpacity onPress={() => setPersonalizedNote("")}>
                        <Text style={styles.clearIcon}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={[
                      styles.analyzeButton,
                      isAnalyzing && styles.analyzingButton,
                      (compareList.length === 0 || !personalizedPrice.trim()) &&
                        styles.disabledButton,
                    ]}
                    onPress={handlePersonalizedAnalysis}
                    disabled={
                      isAnalyzing ||
                      compareList.length === 0 ||
                      !personalizedPrice.trim()
                    }
                  >
                    {isAnalyzing ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#370B0B" />
                        <Text style={styles.analyzeButtonText}>分析中...</Text>
                      </View>
                    ) : (
                      <Text style={styles.analyzeButtonText}>
                        获取个性化推荐
                      </Text>
                    )}
                  </TouchableOpacity>

                  {!isAnalyzing &&
                    (personalizedPrice ||
                      personalizedNote ||
                      analysisResult) && (
                      <TouchableOpacity
                        style={styles.clearButton}
                        onPress={clearPersonalizedInput}
                      >
                        <Text style={styles.clearButtonText}>清空</Text>
                      </TouchableOpacity>
                    )}
                </View>
              </View>

              {/* 分析结果显示 */}
              {analysisResult && (
                <View style={styles.resultContainer}>
                  <View style={styles.resultHeader}>
                    <StatsIcon width={18} height={18} color="#FDDDDC" />
                    <Text style={styles.resultTitle}>分析结果</Text>
                  </View>
                  <View style={styles.resultContent}>
                    <Text style={styles.resultText}>{analysisResult}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* 推荐结论 */}
            {/* <View style={styles.recommendationContainer}>
              <Text style={styles.recommendationTitle}>推荐结论</Text>
              <View style={styles.recommendationContent}>
                <View style={styles.recommendationItem}>
                  <Text style={styles.recommendationIcon}>🏆</Text>
                  <View style={styles.recommendationText}>
                    <Text style={styles.recommendationLabel}>综合推荐</Text>
                    <Text style={styles.recommendationValue}>
                      {
                        compareList.reduce((best, current) =>
                          current.rating > best.rating ? current : best
                        ).name
                      }
                    </Text>
                    <Text style={styles.recommendationReason}>
                      评分最高，综合表现优秀
                    </Text>
                  </View>
                </View>

                <View style={styles.recommendationItem}>
                  <Text style={styles.recommendationIcon}>💰</Text>
                  <View style={styles.recommendationText}>
                    <Text style={styles.recommendationLabel}>性价比推荐</Text>
                    <Text style={styles.recommendationValue}>
                      {
                        compareList.reduce((best, current) =>
                          parseFloat(
                            current.price.replace("¥", "").replace("/斤", "")
                          ) <
                          parseFloat(
                            best.price.replace("¥", "").replace("/斤", "")
                          )
                            ? current
                            : best
                        ).name
                      }
                    </Text>
                    <Text style={styles.recommendationReason}>
                      价格实惠，品质不错
                    </Text>
                  </View>
                </View>
              </View>
            </View> */}
          </>
        )}

        {/* 底部间距，为统一导航栏留出空间 */}
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
  time: {
    fontSize: 14,
    fontWeight: "normal",
    color: "white",
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
    fontSize: 24,
    fontWeight: "600",
    color: "white",
    marginLeft: 0,
  },
  headerRight: {
    flexDirection: "row",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyIconContainer: {
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "white",
    fontWeight: "300",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: "rgba(253, 221, 220, 0.8)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addButtonText: {
    fontSize: 16,
    color: "#370B0B",
    fontWeight: "300",
  },
  compareCardsContainer: {
    marginBottom: 32,
  },
  compareCards: {
    flexDirection: "row",
    gap: 16,
  },
  compareCard: {
    width: 200,
    backgroundColor: "rgba(41, 36, 33, 0.1)",
    borderRadius: 22,
    padding: 16,
    position: "relative",
  },
  removeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  removeButtonText: {
    fontSize: 12,
    color: "white",
  },
  cardContent: {
    alignItems: "center",
  },
  cardImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardEmoji: {
    fontSize: 32,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "300",
    color: "white",
    textAlign: "center",
    marginBottom: 4,
  },
  cardOrigin: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: "300",
    color: "#FDDDDC",
    textAlign: "center",
    marginBottom: 8,
  },
  cardRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardStars: {
    flexDirection: "row",
    marginRight: 4,
  },
  star: {
    fontSize: 12,
    color: "#FDDDDC",
  },
  cardRatingText: {
    fontSize: 12,
    color: "white",
    fontWeight: "300",
  },
  cardDescription: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 16,
  },
  addMoreCard: {
    width: 200,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 22,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderStyle: "dashed",
  },
  addMoreIcon: {
    fontSize: 32,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 8,
  },
  addMoreText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "300",
  },
  comparisonTableContainer: {
    marginBottom: 32,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "white",
    marginBottom: 16,
  },
  comparisonTable: {
    backgroundColor: "rgba(41, 36, 33, 0.1)",
    borderRadius: 22,
    padding: 20,
  },
  comparisonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  comparisonLabel: {
    fontSize: 14,
    color: "white",
    fontWeight: "300",
    width: 60,
  },
  comparisonValues: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  comparisonValueContainer: {
    flex: 1,
    alignItems: "center",
  },
  comparisonBar: {
    width: "80%",
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    marginBottom: 4,
  },
  comparisonBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  comparisonValue: {
    fontSize: 12,
    color: "white",
    fontWeight: "300",
  },
  priceValue: {
    fontSize: 14,
    color: "#FDDDDC",
    fontWeight: "300",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 14,
    color: "white",
    fontWeight: "300",
  },
  originValue: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  recommendationContainer: {
    marginBottom: 32,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "300",
    color: "white",
    marginBottom: 16,
  },
  recommendationContent: {
    backgroundColor: "rgba(41, 36, 33, 0.1)",
    borderRadius: 22,
    padding: 20,
    gap: 16,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  recommendationIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
  },
  recommendationLabel: {
    fontSize: 14,
    color: "white",
    fontWeight: "300",
    marginBottom: 4,
  },
  recommendationValue: {
    fontSize: 16,
    color: "#FDDDDC",
    fontWeight: "300",
    marginBottom: 4,
  },
  recommendationReason: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 16,
  },
  bottomSpacing: {
    height: 100, // 为底部导航栏留出空间
  },
  // 个性化分析推荐样式
  personalizedSection: {
    marginBottom: 32,
    backgroundColor: "rgba(41, 36, 33, 0.1)",
    borderRadius: 22,
    padding: 20,
  },
  personalizedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  personalizedTitle: {
    fontSize: 18,
    fontWeight: "300",
    color: "white",
  },
  personalizedSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 20,
  },
  inputContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: "white",
    fontWeight: "300",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  inputIconContainer: {
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "white",
    fontWeight: "300",
    paddingVertical: 12,
  },
  clearIcon: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    padding: 4,
  },
  buttonGroup: {
    gap: 12,
    marginTop: 8,
  },
  analyzeButton: {
    backgroundColor: "rgba(253, 221, 220, 0.9)",
    height: 48,
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  analyzingButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  disabledButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    opacity: 0.5,
  },
  analyzeButtonText: {
    fontSize: 16,
    color: "#370B0B",
    fontWeight: "500",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  clearButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "300",
  },
  resultContainer: {
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  resultTitle: {
    fontSize: 16,
    color: "white",
    fontWeight: "300",
  },
  resultContent: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
  },
  resultText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 22,
  },
});

export default ComparePage;
