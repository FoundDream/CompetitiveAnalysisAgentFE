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
  Image,
  ActivityIndicator,
} from "react-native";
import { useTask, Task, TaskStatus } from "../store/TaskStore";
import {
  CameraIcon,
  SearchIcon,
  StatsIcon,
  SettingsIcon,
  ArrowLeftIcon,
} from "./SvgIcons";

interface TaskPageProps {
  onBack?: () => void;
  onTaskPress?: (task: Task) => void;
}

const TaskPage: React.FC<TaskPageProps> = ({ onBack, onTaskPress }) => {
  const {
    state,
    removeTask,
    clearCompleted,
    clearAll,
    getActiveTasks,
    getCompletedTasks,
    getFailedTasks,
  } = useTask();

  const [selectedTab, setSelectedTab] = useState<
    "all" | "active" | "completed" | "failed"
  >("all");

  const handleBack = () => {
    onBack?.();
  };

  const handleTaskPress = (task: Task) => {
    console.log(
      "TaskPage: 任务被点击:",
      task.id,
      "status:",
      task.status,
      "result:",
      task.result
    );
    if (task.status === "completed" && task.result) {
      console.log("TaskPage: 任务满足条件，调用onTaskPress");
      onTaskPress?.(task);
    } else {
      console.log(
        "TaskPage: 任务不满足条件 - status:",
        task.status,
        "hasResult:",
        !!task.result
      );
    }
  };

  const handleRemoveTask = (taskId: string) => {
    Alert.alert("删除任务", "确定要删除这个任务吗？", [
      { text: "取消", style: "cancel" },
      { text: "删除", style: "destructive", onPress: () => removeTask(taskId) },
    ]);
  };

  const handleClearCompleted = () => {
    const completedCount = getCompletedTasks().length;
    if (completedCount === 0) {
      Alert.alert("提示", "没有已完成的任务");
      return;
    }

    Alert.alert(
      "清空已完成",
      `确定要清空 ${completedCount} 个已完成的任务吗？`,
      [
        { text: "取消", style: "cancel" },
        { text: "清空", style: "destructive", onPress: clearCompleted },
      ]
    );
  };

  const handleClearAll = () => {
    if (state.tasks.length === 0) {
      Alert.alert("提示", "没有任务需要清空");
      return;
    }

    Alert.alert(
      "清空所有任务",
      `确定要清空所有 ${state.tasks.length} 个任务吗？`,
      [
        { text: "取消", style: "cancel" },
        { text: "清空", style: "destructive", onPress: clearAll },
      ]
    );
  };

  const getFilteredTasks = (): Task[] => {
    switch (selectedTab) {
      case "active":
        return getActiveTasks();
      case "completed":
        return getCompletedTasks();
      case "failed":
        return getFailedTasks();
      default:
        return state.tasks;
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "processing":
        return "🔄";
      case "completed":
        return "✅";
      case "failed":
        return "❌";
      default:
        return "❓";
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case "pending":
        return "等待中";
      case "processing":
        return "处理中";
      case "completed":
        return "已完成";
      case "failed":
        return "失败";
      default:
        return "未知";
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "pending":
        return "#FFA500";
      case "processing":
        return "#4169E1";
      case "completed":
        return "#10B981";
      case "failed":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const renderTaskItem = (task: Task) => {
    const canPress = task.status === "completed" && task.result;

    return (
      <TouchableOpacity
        key={task.id}
        style={[styles.taskItem, canPress && styles.taskItemClickable]}
        onPress={() => handleTaskPress(task)}
        disabled={!canPress}
      >
        <View style={styles.taskHeader}>
          <View style={styles.taskIcon}>
            {task.type === "image" ? (
              <CameraIcon width={20} height={20} color="#FDDDDC" />
            ) : (
              <SearchIcon width={20} height={20} color="#FDDDDC" />
            )}
          </View>

          <View style={styles.taskInfo}>
            <Text style={styles.taskName}>{task.displayName}</Text>
            <Text style={styles.taskTime}>
              {task.createdAt.toLocaleTimeString()}
            </Text>
          </View>

          <View style={styles.taskStatus}>
            <Text style={styles.statusIcon}>{getStatusIcon(task.status)}</Text>
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(task.status) },
              ]}
            >
              {getStatusText(task.status)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleRemoveTask(task.id)}
          >
            <Text style={styles.deleteButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* 缩略图或详情 */}
        {task.thumbnail && (
          <View style={styles.taskThumbnail}>
            <Image
              source={{ uri: task.thumbnail }}
              style={styles.thumbnailImage}
            />
          </View>
        )}

        {/* 进度条 */}
        {task.status === "processing" && task.progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${task.progress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>{task.progress}%</Text>
          </View>
        )}

        {/* 错误信息 */}
        {task.status === "failed" && task.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{task.error}</Text>
          </View>
        )}

        {/* 完成信息 */}
        {task.status === "completed" && task.result && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultPreview}>
              {task.result.name} - {task.result.price}
            </Text>
            <Text style={styles.tapHint}>点击查看详细结果</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const filteredTasks = getFilteredTasks();
  const activeTasks = getActiveTasks();
  const completedTasks = getCompletedTasks();
  const failedTasks = getFailedTasks();

  // 调试信息
  console.log("TaskPage render - 所有任务:", state.tasks.length);
  console.log("TaskPage render - 已完成任务:", completedTasks.length);
  console.log("TaskPage render - 当前筛选的任务:", filteredTasks.length);
  state.tasks.forEach((task) => {
    console.log(
      `任务 ${task.id}: status=${task.status}, hasResult=${!!task.result}`
    );
  });

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
          {/* <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeftIcon width={20} height={20} color="white" />
          </TouchableOpacity> */}
          <Text style={styles.headerTitle}>任务管理</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleClearCompleted}
          >
            <Text style={styles.headerButtonText}>清空已完成</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 筛选标签 */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabs}>
            {[
              { key: "all", label: "全部", count: state.tasks.length },
              { key: "active", label: "进行中", count: activeTasks.length },
              {
                key: "completed",
                label: "已完成",
                count: completedTasks.length,
              },
              { key: "failed", label: "失败", count: failedTasks.length },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  selectedTab === tab.key && styles.activeTab,
                ]}
                onPress={() => setSelectedTab(tab.key as any)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab.key && styles.activeTabText,
                  ]}
                >
                  {tab.label} ({tab.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 任务列表 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <SettingsIcon
                width={48}
                height={48}
                color="rgba(255, 255, 255, 0.5)"
              />
            </View>
            <Text style={styles.emptyText}>
              {selectedTab === "all"
                ? "暂无任务"
                : `暂无${
                    selectedTab === "active"
                      ? "进行中"
                      : selectedTab === "completed"
                      ? "已完成"
                      : "失败"
                  }的任务`}
            </Text>
            <Text style={styles.emptySubText}>
              去拍照或搜索页面添加新的识别任务
            </Text>
          </View>
        ) : (
          <View style={styles.taskList}>
            {filteredTasks.map(renderTaskItem)}
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
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
  },
  headerButtonText: {
    fontSize: 12,
    color: "white",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "300",
    color: "#FDDDDC",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  tabContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: "row",
    gap: 12,
  },
  tab: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "rgba(253, 221, 220, 0.8)",
  },
  tabText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  activeTabText: {
    color: "#370B0B",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  taskList: {
    gap: 16,
  },
  taskItem: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
  },
  taskItemClickable: {
    backgroundColor: "rgba(253, 221, 220, 0.1)",
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  taskIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskName: {
    fontSize: 16,
    color: "white",
    fontWeight: "300",
    marginBottom: 2,
  },
  taskTime: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  taskStatus: {
    alignItems: "center",
    marginRight: 12,
  },
  statusIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  taskThumbnail: {
    marginBottom: 12,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4169E1",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "white",
    minWidth: 35,
    textAlign: "right",
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    fontSize: 12,
    color: "#FCA5A5",
    lineHeight: 16,
  },
  resultContainer: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderRadius: 8,
    padding: 12,
  },
  resultPreview: {
    fontSize: 14,
    color: "#86EFAC",
    marginBottom: 4,
  },
  tapHint: {
    fontSize: 12,
    color: "rgba(134, 239, 172, 0.8)",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyIconContainer: {
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
  bottomSpacing: {
    height: 100,
  },
});

export default TaskPage;
