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

interface DetailPageProps {
  fruitName?: string;
  onBack?: () => void;
  onPhotoRecognition?: () => void;
  onCompare?: () => void;
  onEnterCompare?: () => void;
}

const ParaflowDetailPage: React.FC<DetailPageProps> = ({
  fruitName = "红富士苹果",
  onBack,
  onPhotoRecognition,
  onCompare,
  onEnterCompare,
}) => {
  const [selectedTab, setSelectedTab] = useState("产地介绍");
  const [isFavorited, setIsFavorited] = useState(true);

  // 预留的功能函数
  const handleShare = () => {
    console.log("分享");
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    console.log("收藏/取消收藏");
  };

  const handleBack = () => {
    console.log("返回");
    onBack?.();
  };

  // 根据水果名称显示不同的emoji和数据
  const getFruitEmoji = (name: string) => {
    if (name.includes("苹果")) return "🍎";
    if (name.includes("橙") || name.includes("橘")) return "🍊";
    if (name.includes("芒果")) return "🥭";
    if (name.includes("牛油果")) return "🥑";
    if (name.includes("草莓")) return "🍓";
    return "🍎";
  };

  // 模拟数据 - 基于原型
  const fruitData = {
    name: fruitName,
    origin: "原产地: 山东烟台 · 脆甜爽口 · 汁水丰富",
    ratings: {
      甜度: 4,
      汁水: 3,
      脆度: 5,
    },
    currentPrice: "¥6.8/斤",
    priceStatus: "合理价格",
    priceDescription: "相比去年同期下降了8%，处于近三年的价格合理区间",
    overallRating: 4.8,
    reviewCount: 126,
    popularTags: ["脆甜", "新鲜"],
    tabs: {
      产地介绍: {
        title: "烟台苹果",
        badge: "国家地理标志",
        description:
          "烟台位于山东半岛东端，气候温和，四季分明，土壤肥沃，光照充足，非常适合苹果生长。",
        detail:
          '烟台红富士苹果以其色泽鲜艳、果肉细脆、汁多味甜而闻名，被誉为"中国苹果之都"，已有超过140年的种植历史。',
      },
      口感分析: {
        title: "口感特点",
        description: "红富士苹果口感脆嫩多汁，酸甜适中，果肉细腻，香气浓郁。",
        detail:
          "红富士苹果糖度通常在13-15度之间，酸度适中，口感层次丰富，深受消费者喜爱。",
      },
      营养成分: {
        title: "营养价值",
        description:
          "富含维生素C、膳食纤维、钾元素等多种营养成分，有助于增强免疫力。",
        detail:
          "每100克红富士苹果含维生素C约4-6mg，膳食纤维2.4g，钾119mg，是健康的水果选择。",
      },
    },
    reviews: [
      {
        id: "1",
        userName: "李小花",
        rating: 5,
        content:
          "苹果非常新鲜，个头适中，很脆很甜，一口咬下去汁水丰富，家里小孩特别喜欢吃。",
        avatar: "👩",
      },
      {
        id: "2",
        userName: "张先生",
        rating: 4,
        content:
          "品质不错，但是部分苹果运输过程中有轻微碰伤，希望包装可以再加强一些。味道还是很棒的。",
        avatar: "👨",
      },
    ],
  };

  const renderStars = (rating: number, size: "small" | "medium" = "medium") => {
    const starSize = size === "small" ? 12 : 14;
    return Array.from({ length: 5 }, (_, index) => (
      <Text key={index} style={[styles.star, { fontSize: starSize }]}>
        {index < rating ? "⭐" : "☆"}
      </Text>
    ));
  };

  const renderRatingIcon = (category: string) => {
    switch (category) {
      case "甜度":
        return "🍯";
      case "汁水":
        return "💧";
      case "脆度":
        return "🍎";
      default:
        return "🍎";
    }
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
          <Text style={styles.headerTitle}>水果详情</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Text style={styles.headerButtonText}>↗</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleFavorite}
          >
            <Text style={styles.headerButtonText}>
              {isFavorited ? "❤️" : "🤍"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 水果概览区 */}
        <View style={styles.overviewSection}>
          <View style={styles.fruitImageContainer}>
            <View style={styles.fruitImage}>
              <Text style={styles.fruitEmoji}>
                {getFruitEmoji(fruitData.name)}
              </Text>
            </View>
          </View>
          <Text style={styles.fruitName}>{fruitData.name}</Text>
          <Text style={styles.fruitOrigin}>{fruitData.origin}</Text>
        </View>

        {/* 评分系统 */}
        <View style={styles.ratingsSection}>
          {Object.entries(fruitData.ratings).map(([category, rating]) => (
            <View key={category} style={styles.ratingCard}>
              <View style={styles.ratingIconContainer}>
                <Text style={styles.ratingIcon}>
                  {renderRatingIcon(category)}
                </Text>
              </View>
              <Text style={styles.ratingCategory}>{category}</Text>
              <View style={styles.starsContainer}>{renderStars(rating)}</View>
            </View>
          ))}
        </View>

        {/* 详细信息选项卡 */}
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>详细信息</Text>

          {/* 选项卡按钮 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabScrollView}
          >
            <View style={styles.tabsContainer}>
              {Object.keys(fruitData.tabs).map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, selectedTab === tab && styles.activeTab]}
                  onPress={() => setSelectedTab(tab)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      selectedTab === tab && styles.activeTabText,
                    ]}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* 选项卡内容 */}
          <View style={styles.tabContentContainer}>
            <View style={styles.tabContentHeader}>
              <Text style={styles.tabContentTitle}>
                {
                  fruitData.tabs[selectedTab as keyof typeof fruitData.tabs]
                    .title
                }
              </Text>
              {selectedTab === "产地介绍" && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {fruitData.tabs.产地介绍.badge}
                  </Text>
                </View>
              )}
            </View>

            {selectedTab === "产地介绍" && (
              <View style={styles.originContent}>
                <View style={styles.originImagePlaceholder}>
                  <Text style={styles.originImageEmoji}>🏞️</Text>
                </View>
                <View style={styles.originTextContent}>
                  <Text style={styles.tabContentDescription}>
                    {
                      fruitData.tabs[selectedTab as keyof typeof fruitData.tabs]
                        .description
                    }
                  </Text>
                </View>
              </View>
            )}

            <Text style={styles.tabContentDetail}>
              {
                fruitData.tabs[selectedTab as keyof typeof fruitData.tabs]
                  .detail
              }
            </Text>
          </View>
        </View>

        {/* 价格分析 */}
        <View style={styles.priceSection}>
          <Text style={styles.sectionTitle}>价格分析</Text>
          <View style={styles.priceContainer}>
            <View style={styles.priceHeader}>
              <View>
                <Text style={styles.priceLabel}>当前均价</Text>
                <Text style={styles.currentPrice}>
                  {fruitData.currentPrice}
                </Text>
              </View>
              <View style={styles.priceStatusBadge}>
                <Text style={styles.priceStatusText}>
                  {fruitData.priceStatus}
                </Text>
              </View>
            </View>
            <Text style={styles.priceDescription}>
              {fruitData.priceDescription}
            </Text>

            {/* 简化的价格图表 */}
            <View style={styles.priceChart}>
              <View style={styles.chartPlaceholder}>
                <Text style={styles.chartEmoji}>📈</Text>
                <Text style={styles.chartText}>价格趋势图</Text>
              </View>
            </View>

            {/* 图例 */}
            <View style={styles.chartLegend}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#FDDDDC" }]}
                />
                <Text style={styles.legendText}>市场价</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: "rgba(255, 255, 255, 0.3)" },
                  ]}
                />
                <Text style={styles.legendText}>价格区间</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 用户评价 */}
        <View style={styles.reviewSection}>
          <View style={styles.reviewHeader}>
            <Text style={styles.sectionTitle}>用户评价</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>查看全部</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reviewContainer}>
            <View style={styles.reviewSummary}>
              <View style={styles.ratingOverview}>
                <Text style={styles.overallRatingIcon}>⭐</Text>
                <Text style={styles.overallRating}>
                  {fruitData.overallRating}
                </Text>
                <Text style={styles.reviewCount}>
                  ({fruitData.reviewCount}条评价)
                </Text>
              </View>
              <View style={styles.popularTags}>
                {fruitData.popularTags.map((tag, index) => (
                  <View key={index} style={styles.popularTag}>
                    <Text style={styles.popularTagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 评价列表 */}
            {fruitData.reviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewerInfo}>
                  <View style={styles.reviewerAvatar}>
                    <Text style={styles.reviewerAvatarText}>
                      {review.avatar}
                    </Text>
                  </View>
                  <View style={styles.reviewerDetails}>
                    <Text style={styles.reviewerName}>{review.userName}</Text>
                    <View style={styles.reviewRating}>
                      {renderStars(review.rating, "small")}
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewContent}>{review.content}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 底部间距 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={styles.bottomActionContainer}>
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={[styles.bottomActionButton, styles.compareButton]}
            onPress={onCompare}
          >
            <Text style={styles.compareButtonIcon}>⚖️</Text>
            <Text style={styles.compareButtonText}>加入比较</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bottomActionButton, styles.findStoreButton]}
            onPress={onEnterCompare}
          >
            <Text style={styles.findStoreButtonIcon}>🏪</Text>
            <Text style={styles.findStoreButtonText}>查看比较</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    fontSize: 20,
    fontWeight: "300",
    color: "white",
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  overviewSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  fruitImageContainer: {
    marginBottom: 24,
  },
  fruitImage: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  fruitEmoji: {
    fontSize: 120,
  },
  fruitName: {
    fontSize: 20,
    fontWeight: "300",
    color: "white",
    marginBottom: 8,
  },
  fruitOrigin: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  ratingsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  ratingCard: {
    flex: 1,
    backgroundColor: "rgba(41, 36, 33, 0.1)",
    borderRadius: 22,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  ratingIconContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingIcon: {
    fontSize: 18,
    color: "white",
  },
  ratingCategory: {
    fontSize: 12,
    color: "white",
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: "row",
  },
  star: {
    fontSize: 14,
    color: "#FDDDDC",
    marginHorizontal: 1,
  },
  detailSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "300",
    color: "white",
    marginBottom: 16,
  },
  tabScrollView: {
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: "row",
  },
  tab: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  activeTab: {
    backgroundColor: "rgba(253, 221, 220, 0.8)",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "300",
    color: "white",
  },
  activeTabText: {
    color: "#370B0B",
  },
  tabContentContainer: {
    backgroundColor: "rgba(41, 36, 33, 0.1)",
    borderRadius: 22,
    padding: 20,
  },
  tabContentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  tabContentTitle: {
    fontSize: 16,
    fontWeight: "300",
    color: "white",
  },
  badge: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    color: "white",
  },
  originContent: {
    flexDirection: "row",
    marginBottom: 16,
  },
  originImagePlaceholder: {
    width: 120,
    height: 80,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  originImageEmoji: {
    fontSize: 32,
  },
  originTextContent: {
    flex: 1,
  },
  tabContentDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  tabContentDetail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  priceSection: {
    marginBottom: 32,
  },
  priceContainer: {
    backgroundColor: "rgba(41, 36, 33, 0.1)",
    borderRadius: 22,
    padding: 20,
  },
  priceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: "300",
    color: "white",
  },
  priceStatusBadge: {
    backgroundColor: "rgba(253, 221, 220, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
  },
  priceStatusText: {
    fontSize: 12,
    color: "#370B0B",
  },
  priceDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 16,
    lineHeight: 20,
  },
  priceChart: {
    marginBottom: 16,
  },
  chartPlaceholder: {
    height: 150,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  chartEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  chartText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  reviewSection: {
    marginBottom: 32,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },
  reviewContainer: {
    backgroundColor: "rgba(41, 36, 33, 0.1)",
    borderRadius: 22,
    padding: 20,
  },
  reviewSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingOverview: {
    flexDirection: "row",
    alignItems: "center",
  },
  overallRatingIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  overallRating: {
    fontSize: 18,
    fontWeight: "300",
    color: "white",
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    alignSelf: "flex-end",
    marginBottom: 2,
  },
  popularTags: {
    flexDirection: "row",
    gap: 8,
  },
  popularTag: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  popularTagText: {
    fontSize: 12,
    color: "white",
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  reviewerAvatarText: {
    fontSize: 16,
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    color: "white",
    marginBottom: 2,
  },
  reviewRating: {
    flexDirection: "row",
  },
  reviewContent: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
  bottomActionContainer: {
    marginTop: 24,
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 24,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 32,
    gap: 12,
  },
  bottomActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  compareButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  compareButtonIcon: {
    fontSize: 16,
    marginRight: 8,
    color: "white",
  },
  compareButtonText: {
    fontSize: 16,
    fontWeight: "300",
    color: "white",
  },
  findStoreButton: {
    backgroundColor: "rgba(253, 221, 220, 0.8)",
  },
  findStoreButtonIcon: {
    fontSize: 16,
    marginRight: 8,
    color: "#370B0B",
  },
  findStoreButtonText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#370B0B",
  },
});

export default ParaflowDetailPage;
