import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { HomeIcon, CompareIcon } from "./SvgIcons";

interface ComparePageProps {
  onBack?: () => void;
  onFruitPress?: (fruitName: string) => void;
  onNavigateToHome?: () => void;
}

const ComparePage: React.FC<ComparePageProps> = ({
  onBack,
  onFruitPress,
  onNavigateToHome,
}) => {
  const [compareList, setCompareList] = useState([
    {
      id: "1",
      name: "红富士苹果",
      price: "¥6.8/斤",
      rating: 4.8,
      sweetness: 4,
      juiciness: 5,
      crispness: 5,
      origin: "山东烟台",
      description: "脆甜爽口，汁水丰富",
    },
    {
      id: "2",
      name: "嘎啦苹果",
      price: "¥5.2/斤",
      rating: 4.5,
      sweetness: 3,
      juiciness: 4,
      crispness: 4,
      origin: "新疆阿克苏",
      description: "口感清脆，酸甜适中",
    },
  ]);

  // 预留的功能函数
  const handleBack = () => {
    console.log("返回");
    onBack?.();
  };

  const handleAddToCompare = () => {
    console.log("添加对比项");
  };

  const handleRemoveFromCompare = (id: string) => {
    setCompareList(compareList.filter((item) => item.id !== id));
    console.log("移除对比项:", id);
  };

  const handleClearAll = () => {
    setCompareList([]);
    console.log("清空对比");
  };

  const handleFruitPress = (fruitName: string) => {
    console.log("查看水果详情:", fruitName);
    onFruitPress?.(fruitName);
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
    key: "sweetness" | "juiciness" | "crispness"
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
            <Text style={styles.emptyIcon}>⚖️</Text>
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

                    <TouchableOpacity
                      style={styles.cardContent}
                      onPress={() => handleFruitPress(item.name)}
                    >
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
                    </TouchableOpacity>
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
                {renderComparisonRow("汁水", "juiciness")}
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

            {/* 推荐结论 */}
            <View style={styles.recommendationContainer}>
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
            </View>
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
});

export default ComparePage;
