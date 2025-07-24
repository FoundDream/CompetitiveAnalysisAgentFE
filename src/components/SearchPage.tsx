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
} from "react-native";

interface SearchPageProps {
  onBack?: () => void;
  onFruitPress?: (fruitName: string) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onBack, onFruitPress }) => {
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // 预留的功能函数
  const handleBack = () => {
    console.log("返回");
    onBack?.();
  };

  const handleSearch = () => {
    if (!searchText.trim()) return;

    setIsSearching(true);
    console.log("搜索:", searchText);

    // 模拟搜索过程
    setTimeout(() => {
      const mockResults = [
        {
          id: "1",
          name: "红富士苹果",
          origin: "山东烟台",
          price: "¥6.8/斤",
          rating: 4.8,
          description: "脆甜爽口，汁水丰富",
          tags: ["脆甜", "新鲜"],
        },
        {
          id: "2",
          name: "嘎啦苹果",
          origin: "新疆阿克苏",
          price: "¥5.2/斤",
          rating: 4.5,
          description: "口感清脆，酸甜适中",
          tags: ["清脆", "酸甜"],
        },
        {
          id: "3",
          name: "黄元帅苹果",
          origin: "辽宁",
          price: "¥4.5/斤",
          rating: 4.2,
          description: "果肉松软，香甜可口",
          tags: ["香甜", "松软"],
        },
      ].filter(
        (item) =>
          item.name.includes(searchText) ||
          (searchText.includes("苹果") && item.name.includes("苹果"))
      );

      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setSearchResults([]);
  };

  const handleResultPress = (fruitName: string) => {
    console.log("选择水果:", fruitName);
    onFruitPress?.(fruitName);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Text key={index} style={styles.star}>
        {index < Math.floor(rating) ? "⭐" : "☆"}
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
          <Text style={styles.headerTitle}>文字搜索</Text>
        </View>
      </View>

      {/* 搜索区域 */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="输入水果名称或品种"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
                <Text style={styles.clearIcon}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[styles.searchButton, isSearching && styles.searchingButton]}
            onPress={handleSearch}
            disabled={isSearching || !searchText.trim()}
          >
            <Text style={styles.searchButtonText}>
              {isSearching ? "⏳" : "搜索"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 热门搜索 */}
        <View style={styles.hotSearchContainer}>
          <Text style={styles.hotSearchTitle}>热门搜索</Text>
          <View style={styles.hotSearchTags}>
            {["苹果", "橙子", "香蕉", "葡萄", "草莓", "芒果"].map(
              (tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.hotSearchTag}
                  onPress={() => {
                    setSearchText(tag);
                    handleSearch();
                  }}
                >
                  <Text style={styles.hotSearchTagText}>{tag}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </View>
      </View>

      {/* 搜索结果 */}
      <ScrollView
        style={styles.resultsContainer}
        showsVerticalScrollIndicator={false}
      >
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingIcon}>⏳</Text>
            <Text style={styles.loadingText}>正在搜索...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                找到 {searchResults.length} 个结果
              </Text>
              <TouchableOpacity>
                <Text style={styles.sortButton}>排序 ↕️</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.resultsList}>
              {searchResults.map((result) => (
                <TouchableOpacity
                  key={result.id}
                  style={styles.resultItem}
                  onPress={() => handleResultPress(result.name)}
                >
                  <View style={styles.resultImageContainer}>
                    <Text style={styles.resultEmoji}>
                      {getFruitEmoji(result.name)}
                    </Text>
                  </View>

                  <View style={styles.resultContent}>
                    <View style={styles.resultHeader}>
                      <Text style={styles.resultName}>{result.name}</Text>
                      <Text style={styles.resultPrice}>{result.price}</Text>
                    </View>

                    <Text style={styles.resultOrigin}>{result.origin}</Text>
                    <Text style={styles.resultDescription}>
                      {result.description}
                    </Text>

                    <View style={styles.resultFooter}>
                      <View style={styles.resultRating}>
                        <View style={styles.starsContainer}>
                          {renderStars(result.rating)}
                        </View>
                        <Text style={styles.ratingText}>{result.rating}</Text>
                      </View>

                      <View style={styles.resultTags}>
                        {result.tags.map((tag: string, index: number) => (
                          <View key={index} style={styles.resultTag}>
                            <Text style={styles.resultTagText}>{tag}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : searchText.length > 0 && !isSearching ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsIcon}>🔍</Text>
            <Text style={styles.noResultsText}>未找到相关结果</Text>
            <Text style={styles.noResultsSubText}>
              试试其他关键词或检查拼写
            </Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🍎</Text>
            <Text style={styles.emptyText}>输入水果名称开始搜索</Text>
            <Text style={styles.emptySubText}>支持模糊搜索和智能联想</Text>
          </View>
        )}
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
    fontSize: 20,
    fontWeight: "300",
    color: "white",
    marginLeft: 12,
  },
  searchSection: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
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
  searchButton: {
    backgroundColor: "rgba(253, 221, 220, 0.8)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    minWidth: 80,
    alignItems: "center",
  },
  searchingButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  searchButtonText: {
    fontSize: 16,
    color: "#370B0B",
    fontWeight: "300",
  },
  hotSearchContainer: {
    marginTop: 8,
  },
  hotSearchTitle: {
    fontSize: 14,
    color: "white",
    fontWeight: "300",
    marginBottom: 12,
  },
  hotSearchTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  hotSearchTag: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  hotSearchTagText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "300",
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "white",
    fontWeight: "300",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: "white",
    fontWeight: "300",
  },
  sortButton: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "300",
  },
  resultsList: {
    gap: 16,
  },
  resultItem: {
    flexDirection: "row",
    backgroundColor: "rgba(41, 36, 33, 0.1)",
    borderRadius: 22,
    padding: 16,
  },
  resultImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  resultEmoji: {
    fontSize: 32,
  },
  resultContent: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  resultName: {
    fontSize: 16,
    fontWeight: "300",
    color: "white",
  },
  resultPrice: {
    fontSize: 16,
    fontWeight: "300",
    color: "#FDDDDC",
  },
  resultOrigin: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 6,
  },
  resultDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 12,
    lineHeight: 20,
  },
  resultFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 6,
  },
  star: {
    fontSize: 12,
    color: "#FDDDDC",
  },
  ratingText: {
    fontSize: 12,
    color: "white",
    fontWeight: "300",
  },
  resultTags: {
    flexDirection: "row",
    gap: 6,
  },
  resultTag: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  resultTagText: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 18,
    color: "white",
    fontWeight: "300",
    marginBottom: 8,
  },
  noResultsSubText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
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
  },
});

export default SearchPage;
