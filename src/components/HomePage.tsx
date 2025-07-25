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
import {
  AppleIcon,
  CameraIcon,
  SearchIcon,
  HomeIcon,
  CompareIcon,
  UserIcon,
} from "./SvgIcons";

interface HomePageProps {
  onPhotoRecognition?: () => void;
  onTextSearch?: () => void;
  onNavigateToCompare?: () => void;
}

const handleUserPress = () => {
  console.log("用户");
};

const HomePage: React.FC<HomePageProps> = ({
  onPhotoRecognition,
  onTextSearch,
  onNavigateToCompare,
}) => {
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
            <AppleIcon width={24} height={24} color="white" />
          </View>
          <Text style={styles.title}>PriceHunter</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleUserPress}
          >
            <UserIcon width={16} height={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {/* 内容 */}
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
                <CameraIcon width={20} height={20} color="#370B0B" />
              </View>
              <Text style={styles.actionText}>拍照识别</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.searchButton]}
              onPress={onTextSearch}
            >
              <View style={styles.actionIconContainer}>
                <SearchIcon width={20} height={20} color="white" />
              </View>
              <Text style={styles.searchActionText}>文字搜索</Text>
            </TouchableOpacity>
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
              <HomeIcon width={24} height={24} color="white" />
            </View>
            <Text style={[styles.navText, styles.activeNavText]}>首页</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={onNavigateToCompare}
          >
            <View style={styles.navIconContainer}>
              <CompareIcon
                width={20}
                height={20}
                color="rgba(255, 255, 255, 0.5)"
              />
            </View>
            <Text style={styles.navText}>比较</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 68,
    paddingHorizontal: 32,
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
    fontWeight: "600",
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
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
  actionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#370B0B", // 深色文字（用于粉色按钮）
  },
  searchActionText: {
    fontSize: 16,
    fontWeight: "300",
    color: "white", // 白色文字（用于透明按钮）
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
  navText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },
  activeNavText: {
    color: "white",
  },
});

export default HomePage;
