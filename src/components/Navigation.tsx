import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import HomePage from "./HomePage";
import SearchPage from "./SearchPage";
import ComparePage from "./ComparePage";
import CameraPage from "./CameraPage";
import RecognitionResultPage from "./RecognitionResultPage";
import TaskPage from "./TaskPage";
import { HomeIcon, CompareIcon, SettingsIcon } from "./SvgIcons";
import { useTask, Task } from "../store/TaskStore";

export type PageType =
  | "home"
  | "photo"
  | "search"
  | "compare"
  | "camera"
  | "recognition"
  | "tasks";

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = () => {
  const { getActiveTasks } = useTask();
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [recognitionResult, setRecognitionResult] = useState<any>(null);
  const [capturedImageUri, setCapturedImageUri] = useState<string>("");
  const [isAddingToCompare, setIsAddingToCompare] = useState(false); // 标记是否正在为比较添加水果
  const [previousPage, setPreviousPage] = useState<PageType>("home"); // 跟踪上一个页面

  const navigateToHome = () => {
    setCurrentPage("home");
    setIsAddingToCompare(false); // 重置添加状态
  };

  const navigateBackFromRecognition = () => {
    if (isAddingToCompare) {
      setIsAddingToCompare(false);
      setCurrentPage("compare");
    } else {
      // 返回到之前的页面
      setCurrentPage(previousPage);
    }
  };

  const handleDirectRecognition = (result: any, imageUri: string) => {
    setPreviousPage("home"); // 从首页发起的识别，设置上一个页面为首页
    setRecognitionResult(result);
    setCapturedImageUri(imageUri);
    setCurrentPage("recognition");
    console.log("识别完成，跳转到结果页面");
  };

  const navigateToCamera = () => {
    setCurrentPage("camera");
  };

  const handleRecognitionResult = (result: any, imageUri: string) => {
    setRecognitionResult(result);
    setCapturedImageUri(imageUri);

    if (isAddingToCompare) {
      // 如果是从比较页面发起的，直接添加到比较并返回比较页面
      setPreviousPage("compare");
      setCurrentPage("recognition");
      // 设置一个标记，让RecognitionResultPage知道需要自动添加到比较
    } else {
      // 从搜索或拍照页面发起的，设置上一个页面为首页
      setPreviousPage("home");
      setCurrentPage("recognition");
    }
  };

  const handleSaveToFavorites = (result: any) => {
    console.log("保存到收藏:", result);
    // 这里可以实现保存到本地存储的逻辑
  };

  const handleAddToCompare = () => {
    console.log("添加到比较");
  };

  const navigateToSearch = () => {
    setCurrentPage("search");
    console.log("导航到文字搜索页面");
  };

  const navigateToCompare = () => {
    setCurrentPage("compare");
    setIsAddingToCompare(false); // 重置添加状态
    console.log("导航到比较页面");
  };

  const handleEnterCompare = () => {
    console.log("查看比较");
    navigateToCompare();
  };

  // 从比较页面查看水果详情
  const handleViewFruitDetailFromCompare = (result: any, imageUri: string) => {
    console.log("从比较页面查看水果详情:", result.name);
    setPreviousPage("compare"); // 设置上一个页面为比较页面
    setRecognitionResult(result);
    setCapturedImageUri(imageUri);
    setCurrentPage("recognition");
  };

  // 从比较页面发起的添加操作
  const navigateToCameraFromCompare = () => {
    setIsAddingToCompare(true);
    setCurrentPage("camera");
    console.log("从比较页面导航到拍照页面");
  };

  const navigateToSearchFromCompare = () => {
    setIsAddingToCompare(true);
    setCurrentPage("search");
    console.log("从比较页面导航到搜索页面");
  };

  const navigateToTasks = () => {
    setCurrentPage("tasks");
    setIsAddingToCompare(false);
    console.log("导航到任务管理页面");
  };

  const handleTaskPress = (task: Task) => {
    console.log(
      "Navigation: handleTaskPress被调用:",
      task.id,
      "result:",
      task.result
    );
    if (task.result) {
      setPreviousPage("tasks"); // 设置上一个页面为任务管理页面
      setRecognitionResult(task.result);
      setCapturedImageUri(task.imageUri || "");
      setCurrentPage("recognition");
      console.log("从任务页面查看识别结果，跳转到recognition页面");
    } else {
      console.log("Navigation: 任务没有result，无法跳转");
    }
  };

  // 判断是否显示底部导航栏
  const shouldShowBottomNav = () => {
    return (
      currentPage === "home" ||
      currentPage === "compare" ||
      currentPage === "tasks"
    );
  };

  // 渲染当前页面
  const renderCurrentPage = () => {
    // 为有底部导航栏的页面添加底部间距
    const pageStyle = shouldShowBottomNav()
      ? [styles.pageContainer, styles.pageWithBottomNav]
      : styles.pageContainer;

    switch (currentPage) {
      case "home":
        return (
          <View style={pageStyle}>
            <HomePage
              onRecognitionResult={handleDirectRecognition}
              onTextSearch={navigateToSearch}
              onNavigateToCompare={navigateToCompare}
              onNavigateToTasks={navigateToTasks}
            />
          </View>
        );
      case "search":
        return (
          <SearchPage
            onBack={isAddingToCompare ? navigateToCompare : navigateToHome}
            onRecognitionResult={handleRecognitionResult}
          />
        );
      case "compare":
        return (
          <View style={pageStyle}>
            <ComparePage
              onBack={navigateToHome}
              onFruitPress={navigateToSearch}
              onNavigateToHome={navigateToHome}
              onNavigateToCamera={navigateToCameraFromCompare}
              onNavigateToSearch={navigateToSearchFromCompare}
              onViewFruitDetail={handleViewFruitDetailFromCompare}
            />
          </View>
        );
      case "camera":
        return (
          <CameraPage
            onBack={isAddingToCompare ? navigateToCompare : navigateToHome}
            onRecognitionResult={handleRecognitionResult}
          />
        );
      case "recognition":
        return (
          <RecognitionResultPage
            result={recognitionResult}
            imageUri={capturedImageUri}
            onBack={navigateBackFromRecognition}
            onSaveToFavorites={handleSaveToFavorites}
            onCompare={handleAddToCompare}
            isFromCompare={isAddingToCompare}
          />
        );
      case "tasks":
        return (
          <View style={pageStyle}>
            <TaskPage onBack={navigateToHome} onTaskPress={handleTaskPress} />
          </View>
        );
      default:
        return (
          <View style={pageStyle}>
            <HomePage
              onRecognitionResult={handleDirectRecognition}
              onTextSearch={navigateToSearch}
              onNavigateToCompare={navigateToCompare}
              onNavigateToTasks={navigateToTasks}
            />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* 页面内容 */}
      <View style={styles.contentContainer}>{renderCurrentPage()}</View>

      {/* 统一的底部导航栏 */}
      {shouldShowBottomNav() && (
        <View style={styles.bottomNavContainer}>
          <View style={styles.bottomNav}>
            <TouchableOpacity
              style={[
                styles.navItem,
                currentPage === "home" && styles.activeNavItem,
              ]}
              onPress={navigateToHome}
            >
              <View style={styles.navIconContainer}>
                <HomeIcon
                  width={24}
                  height={24}
                  color={
                    currentPage === "home"
                      ? "white"
                      : "rgba(255, 255, 255, 0.5)"
                  }
                />
              </View>
              <Text
                style={[
                  styles.navText,
                  currentPage === "home" && styles.activeNavText,
                ]}
              >
                首页
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navItem,
                currentPage === "compare" && styles.activeNavItem,
              ]}
              onPress={navigateToCompare}
            >
              <View style={styles.navIconContainer}>
                <CompareIcon
                  width={20}
                  height={20}
                  color={
                    currentPage === "compare"
                      ? "white"
                      : "rgba(255, 255, 255, 0.5)"
                  }
                />
              </View>
              <Text
                style={[
                  styles.navText,
                  currentPage === "compare" && styles.activeNavText,
                ]}
              >
                比较
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navItem,
                currentPage === "tasks" && styles.activeNavItem,
              ]}
              onPress={navigateToTasks}
            >
              <View style={styles.navIconContainer}>
                <SettingsIcon
                  width={20}
                  height={20}
                  color={
                    currentPage === "tasks"
                      ? "white"
                      : "rgba(255, 255, 255, 0.5)"
                  }
                />
                {getActiveTasks().length > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {getActiveTasks().length}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.navText,
                  currentPage === "tasks" && styles.activeNavText,
                ]}
              >
                任务
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#726B61",
  },
  contentContainer: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
  // 为有底部导航栏的页面添加底部间距
  pageWithBottomNav: {
    paddingBottom: 90, // 为底部导航栏预留空间
  },
  // 底部导航栏样式
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    paddingTop: 24,
    // 添加渐变背景遮罩
    backgroundColor: "#726B61",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginHorizontal: 24,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  activeNavItem: {
    // 激活状态样式
  },
  navIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "400",
  },
  activeNavText: {
    color: "white",
    fontWeight: "500",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
  },
});

export default Navigation;
