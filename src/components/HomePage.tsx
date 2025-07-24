import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";

interface HomePageProps {
  onFruitPress?: (fruitName: string) => void;
  onPhotoRecognition?: () => void;
  onTextSearch?: () => void;
}

// 预留的功能函数（暂不实现）
const handleSettingsPress = () => {
  console.log("设置");
};

const handleUserPress = () => {
  console.log("用户");
};

const handleViewAllRecent = () => {
  console.log("查看全部最近查询");
};

const handleManageFavorites = () => {
  console.log("管理收藏");
};

const HomePage: React.FC<HomePageProps> = ({
  onFruitPress,
  onPhotoRecognition,
  onTextSearch,
}) => {
  // 模拟数据 - 基于原型
  const recentSearches = [
    {
      id: "1",
      name: "红富士苹果",
      time: "1小时前",
    },
    {
      id: "2",
      name: "脐橙",
      time: "2小时前",
    },
    {
      id: "3",
      name: "芒果",
      time: "昨天",
    },
    {
      id: "4",
      name: "蓝莓",
      time: "昨天",
    },
  ];

  const favorites = [
    {
      id: "1",
      name: "牛油果",
      description: "富含不饱和脂肪酸，有助于降低胆固醇",
      tags: ["营养价值", "食用方法"],
    },
    {
      id: "2",
      name: "草莓",
      description: "维生素C含量丰富，有助美白肌肤",
      tags: ["营养价值", "季节性"],
    },
  ];

  const handleRecentItemPress = (item: string) => {
    console.log("查询项:", item);
    onFruitPress?.(item);
  };

  const handleFavoritePress = (item: string) => {
    console.log("收藏项:", item);
    onFruitPress?.(item);
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
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>🍎</Text>
          </View>
          <Text style={styles.title}>水果百科</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleSettingsPress}
          >
            <Text style={styles.headerButtonText}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleUserPress}
          >
            <Text style={styles.headerButtonText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 查询水果信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>查询水果信息</Text>
          <View style={styles.mainActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.photoButton]}
              onPress={onPhotoRecognition}
            >
              <View style={styles.actionIconContainer}>
                <Text style={styles.actionIcon}>📷</Text>
              </View>
              <Text style={styles.actionText}>拍照识别</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.searchButton]}
              onPress={onTextSearch}
            >
              <View style={styles.actionIconContainer}>
                <Text style={styles.searchActionIcon}>🔍</Text>
              </View>
              <Text style={styles.searchActionText}>文字搜索</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 最近查询 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>最近查询</Text>
            <TouchableOpacity onPress={handleViewAllRecent}>
              <Text style={styles.viewAllText}>查看全部</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.recentScrollView}
            contentContainerStyle={styles.recentList}
          >
            {recentSearches.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.recentItem}
                onPress={() => handleRecentItemPress(item.name)}
              >
                <View style={styles.recentItemImageContainer}>
                  <Text style={styles.recentItemEmoji}>
                    {item.name.includes("苹果")
                      ? "🍎"
                      : item.name.includes("橙")
                      ? "🍊"
                      : item.name.includes("芒果")
                      ? "🥭"
                      : "🫐"}
                  </Text>
                </View>
                <Text style={styles.recentItemName}>{item.name}</Text>
                <Text style={styles.recentItemTime}>{item.time}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 我的收藏 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderTitle}>我的收藏</Text>
            <TouchableOpacity onPress={handleManageFavorites}>
              <Text style={styles.viewAllText}>管理</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.favoritesList}>
            {favorites.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.favoriteItem}
                onPress={() => handleFavoritePress(item.name)}
              >
                <View style={styles.favoriteItemImage}>
                  <Text style={styles.favoriteItemEmoji}>
                    {item.name === "牛油果" ? "🥑" : "🍓"}
                  </Text>
                </View>
                <View style={styles.favoriteItemContent}>
                  <View style={styles.favoriteItemHeader}>
                    <Text style={styles.favoriteItemName}>{item.name}</Text>
                    <View style={styles.favoriteItemActions}>
                      <TouchableOpacity style={styles.favoriteActionButton}>
                        <Text style={styles.favoriteActionText}>📊</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.favoriteActionButton}>
                        <Text style={styles.favoriteActionText}>❤️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={styles.favoriteItemDescription}>
                    {item.description}
                  </Text>
                  <View style={styles.favoriteItemTags}>
                    {item.tags.map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 底部间距 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* 底部导航栏 */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>
          <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
            <View style={styles.navIconContainer}>
              <Text style={styles.navIcon}>🏠</Text>
            </View>
            <Text style={[styles.navText, styles.activeNavText]}>首页</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navIconContainer}>
              <Text style={[styles.navIcon, styles.inactiveNavIcon]}>⚖️</Text>
            </View>
            <Text style={styles.navText}>比较</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={styles.navIconContainer}>
              <Text style={[styles.navIcon, styles.inactiveNavIcon]}>👤</Text>
            </View>
            <Text style={styles.navText}>我的</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#726B61", // 基于原型的渐变色
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
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoIcon: {
    fontSize: 18,
    color: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "300",
    color: "white",
  },
  headerRight: {
    flexDirection: "row",
    gap: 16,
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "300",
    color: "white",
    marginBottom: 16,
  },
  mainActions: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 24,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    boxShadow:
      "6px 0 4px -4px rgba(255, 255, 255, 1) inset, -6px 0 4px -4px rgba(255, 255, 255, 1) inset, 0 -5px 4px -4px rgba(188, 139, 134, 0.4) inset, 0 5px 4px -4px rgba(188, 139, 134, 0.4) inset",
  },
  photoButton: {
    backgroundColor: "rgba(253, 221, 220, 0.8)", // 粉色按钮
  },
  searchButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // 透明白色按钮
    // @ts-ignore
    backgroundImage:
      "radial-gradient(63% 63% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 43%, rgba(255, 255, 255, 0.05) 74%, rgba(255, 255, 255, 0.2) 100%)",
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 20,
    color: "#370B0B", // 深色图标（用于粉色按钮）
  },
  actionText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#370B0B", // 深色文字（用于粉色按钮）
  },
  searchActionIcon: {
    fontSize: 20,
    color: "white", // 白色图标（用于透明按钮）
  },
  searchActionText: {
    fontSize: 16,
    fontWeight: "300",
    color: "white", // 白色文字（用于透明按钮）
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: "300",
    color: "white",
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "300",
    color: "rgba(255, 255, 255, 0.5)",
  },
  recentScrollView: {
    marginBottom: 16,
  },
  recentList: {
    flexDirection: "row",
    gap: 16,
    paddingBottom: 16,
  },
  recentItem: {
    width: 112,
    alignItems: "center",
  },
  recentItemImageContainer: {
    width: 112,
    height: 112,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  recentItemEmoji: {
    fontSize: 48,
  },
  recentItemName: {
    fontSize: 14,
    fontWeight: "300",
    color: "white",
    textAlign: "center",
    marginBottom: 4,
  },
  recentItemTime: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
  },
  favoritesList: {
    gap: 16,
  },
  favoriteItem: {
    flexDirection: "row",
    backgroundColor: "rgba(41, 36, 33, 0.1)",
    borderRadius: 22,
    padding: 16,
    alignItems: "center",
  },
  favoriteItemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  favoriteItemEmoji: {
    fontSize: 32,
  },
  favoriteItemContent: {
    flex: 1,
  },
  favoriteItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  favoriteItemName: {
    fontSize: 16,
    fontWeight: "300",
    color: "white",
  },
  favoriteItemActions: {
    flexDirection: "row",
    gap: 8,
  },
  favoriteActionButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteActionText: {
    fontSize: 12,
    color: "white",
  },
  favoriteItemDescription: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
    lineHeight: 16,
  },
  favoriteItemTags: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  bottomSpacing: {
    height: 40,
  },
  bottomNavContainer: {
    marginTop: 24,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 24,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderRadius: 50,
    boxShadow:
      "5px 0 4px -3px rgba(255, 255, 255, 0.6) inset, -5px 0 4px -3px rgba(255, 255, 255, 0.6) inset, 0 15px 40px 0 rgba(0, 0, 0, 0.2)",
    // @ts-ignore
    backgroundImage:
      "radial-gradient(63% 63% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0) 43%, rgba(255, 255, 255, 0.05) 74%, rgba(255, 255, 255, 0.2) 100%)",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  activeNavItem: {
    // 激活状态样式
  },
  navIconContainer: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  navIcon: {
    fontSize: 16,
    color: "white",
  },
  inactiveNavIcon: {
    opacity: 0.5,
  },
  navText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },
  activeNavText: {
    color: "white",
  },
});

export default HomePage;
