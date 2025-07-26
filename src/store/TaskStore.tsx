import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import {
  RecognitionResult,
  analyzeImage,
  analyzeText,
} from "../services/apiService";

// 任务状态枚举
export type TaskStatus = "pending" | "processing" | "completed" | "failed";

// 任务类型枚举
export type TaskType = "image" | "text";

// 任务数据结构
export interface Task {
  id: string;
  type: TaskType;
  status: TaskStatus;
  createdAt: Date;
  completedAt?: Date;
  progress?: number; // 0-100

  // 输入数据
  imageUri?: string;
  fruitName?: string;
  price?: string;
  note?: string;

  // 结果数据
  result?: RecognitionResult;
  error?: string;

  // 显示数据
  displayName: string;
  thumbnail?: string;
}

// Store状态
interface TaskState {
  tasks: Task[];
  activeTasks: number; // 正在进行的任务数量
}

// Action类型
type TaskAction =
  | { type: "ADD_TASK"; payload: Omit<Task, "id" | "createdAt" | "status"> }
  | {
      type: "UPDATE_TASK_STATUS";
      payload: { id: string; status: TaskStatus; progress?: number };
    }
  | {
      type: "COMPLETE_TASK";
      payload: { id: string; result: RecognitionResult };
    }
  | { type: "FAIL_TASK"; payload: { id: string; error: string } }
  | { type: "REMOVE_TASK"; payload: string }
  | { type: "CLEAR_COMPLETED" }
  | { type: "CLEAR_ALL" };

// 初始状态
const initialState: TaskState = {
  tasks: [],
  activeTasks: 0,
};

// Reducer
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case "ADD_TASK": {
      const newTask: Task = {
        ...action.payload,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        status: "pending",
      };

      return {
        ...state,
        tasks: [newTask, ...state.tasks],
        activeTasks: state.activeTasks + 1,
      };
    }

    case "UPDATE_TASK_STATUS": {
      const { id, status, progress } = action.payload;
      const updatedTasks = state.tasks.map((task) =>
        task.id === id ? { ...task, status, progress } : task
      );

      return {
        ...state,
        tasks: updatedTasks,
      };
    }

    case "COMPLETE_TASK": {
      const { id, result } = action.payload;
      console.log("Reducer: COMPLETE_TASK处理中:", id, "result:", result);

      const taskToUpdate = state.tasks.find((task) => task.id === id);
      console.log("找到要更新的任务:", taskToUpdate);

      const updatedTasks = state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "completed" as TaskStatus,
              result,
              completedAt: new Date(),
              progress: 100,
            }
          : task
      );

      const updatedTask = updatedTasks.find((task) => task.id === id);
      console.log("任务更新后状态:", updatedTask);

      return {
        ...state,
        tasks: updatedTasks,
        activeTasks: Math.max(0, state.activeTasks - 1),
      };
    }

    case "FAIL_TASK": {
      const { id, error } = action.payload;
      const updatedTasks = state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "failed" as TaskStatus,
              error,
              completedAt: new Date(),
              progress: 0,
            }
          : task
      );

      return {
        ...state,
        tasks: updatedTasks,
        activeTasks: Math.max(0, state.activeTasks - 1),
      };
    }

    case "REMOVE_TASK": {
      const taskToRemove = state.tasks.find(
        (task) => task.id === action.payload
      );
      const isActive =
        taskToRemove &&
        (taskToRemove.status === "pending" ||
          taskToRemove.status === "processing");

      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        activeTasks: isActive
          ? Math.max(0, state.activeTasks - 1)
          : state.activeTasks,
      };
    }

    case "CLEAR_COMPLETED": {
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.status !== "completed"),
      };
    }

    case "CLEAR_ALL": {
      return {
        ...state,
        tasks: [],
        activeTasks: 0,
      };
    }

    default:
      return state;
  }
};

// Context类型
interface TaskContextType {
  state: TaskState;
  addImageTask: (imageUri: string, displayName?: string) => string;
  addTextTask: (fruitName: string, price: string, note?: string) => string;
  removeTask: (id: string) => void;
  clearCompleted: () => void;
  clearAll: () => void;
  getTaskById: (id: string) => Task | undefined;
  getCompletedTasks: () => Task[];
  getActiveTasks: () => Task[];
  getFailedTasks: () => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Provider组件
interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // 监听新任务并自动执行
  useEffect(() => {
    const pendingTasks = state.tasks.filter(
      (task) => task.status === "pending"
    );

    pendingTasks.forEach((task) => {
      if (task.type === "image" && task.imageUri) {
        console.log("自动执行图片识别任务:", task.id, task.displayName);
        executeImageTask(task);
      } else if (task.type === "text" && task.fruitName && task.price) {
        console.log("自动执行文字分析任务:", task.id, task.displayName);
        executeTextTask(task);
      }
    });
  }, [state.tasks.length]); // 当任务数量变化时触发

  // 执行图片识别任务
  const executeImageTask = async (task: Task) => {
    console.log("executeImageTask called:", task.id, task.displayName);
    if (!task.imageUri) {
      console.log("任务没有图片URI，跳过执行");
      return;
    }

    let progressInterval: NodeJS.Timeout | undefined;

    try {
      // 更新状态为处理中
      dispatch({
        type: "UPDATE_TASK_STATUS",
        payload: { id: task.id, status: "processing", progress: 10 },
      });

      // 模拟进度更新
      let currentProgress = 10;
      progressInterval = setInterval(() => {
        currentProgress = Math.min(90, currentProgress + 20);
        dispatch({
          type: "UPDATE_TASK_STATUS",
          payload: {
            id: task.id,
            status: "processing",
            progress: currentProgress,
          },
        });
      }, 1000);

      // 执行识别
      console.log("开始调用analyzeImage API");
      const result = await analyzeImage(task.imageUri);
      console.log("analyzeImage API调用成功:", result);

      clearInterval(progressInterval);

      // 完成任务
      console.log("准备完成图片识别任务:", task.id, "result:", result);
      dispatch({
        type: "COMPLETE_TASK",
        payload: { id: task.id, result },
      });
      console.log("图片识别任务完成，已dispatch COMPLETE_TASK:", task.id);
    } catch (error) {
      console.log("图片识别任务失败:", task.id, error);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      dispatch({
        type: "FAIL_TASK",
        payload: {
          id: task.id,
          error: error instanceof Error ? error.message : "识别失败",
        },
      });
    }
  };

  // 执行文字分析任务
  const executeTextTask = async (task: Task) => {
    console.log("executeTextTask called:", task.id, task.displayName);
    if (!task.fruitName || !task.price) {
      console.log("任务缺少必要参数，跳过执行");
      return;
    }

    let progressInterval: NodeJS.Timeout | undefined;

    try {
      // 更新状态为处理中
      dispatch({
        type: "UPDATE_TASK_STATUS",
        payload: { id: task.id, status: "processing", progress: 10 },
      });

      // 模拟进度更新
      let currentProgress = 10;
      progressInterval = setInterval(() => {
        currentProgress = Math.min(90, currentProgress + 20);
        dispatch({
          type: "UPDATE_TASK_STATUS",
          payload: {
            id: task.id,
            status: "processing",
            progress: currentProgress,
          },
        });
      }, 1000);

      // 执行分析
      console.log("开始调用analyzeText API:", task.fruitName, task.price);
      const result = await analyzeText(task.fruitName, task.price);
      console.log("analyzeText API调用成功:", result);

      clearInterval(progressInterval);

      // 完成任务
      console.log("准备完成文字分析任务:", task.id, "result:", result);
      dispatch({
        type: "COMPLETE_TASK",
        payload: { id: task.id, result },
      });
      console.log("文字分析任务完成，已dispatch COMPLETE_TASK:", task.id);
    } catch (error) {
      console.log("文字分析任务失败:", task.id, error);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      dispatch({
        type: "FAIL_TASK",
        payload: {
          id: task.id,
          error: error instanceof Error ? error.message : "分析失败",
        },
      });
    }
  };

  const addImageTask = (imageUri: string, displayName?: string): string => {
    const taskData = {
      type: "image" as TaskType,
      imageUri,
      displayName: displayName || `图片识别 ${new Date().toLocaleTimeString()}`,
      thumbnail: imageUri,
    };

    dispatch({ type: "ADD_TASK", payload: taskData });
    return taskData.displayName;
  };

  const addTextTask = (
    fruitName: string,
    price: string,
    note?: string
  ): string => {
    const taskData = {
      type: "text" as TaskType,
      fruitName,
      price,
      note,
      displayName: `${fruitName} ¥${price}/斤`,
    };

    dispatch({ type: "ADD_TASK", payload: taskData });
    return taskData.displayName;
  };

  const removeTask = (id: string) => {
    dispatch({ type: "REMOVE_TASK", payload: id });
  };

  const clearCompleted = () => {
    dispatch({ type: "CLEAR_COMPLETED" });
  };

  const clearAll = () => {
    dispatch({ type: "CLEAR_ALL" });
  };

  const getTaskById = (id: string): Task | undefined => {
    return state.tasks.find((task) => task.id === id);
  };

  const getCompletedTasks = (): Task[] => {
    return state.tasks.filter((task) => task.status === "completed");
  };

  const getActiveTasks = (): Task[] => {
    return state.tasks.filter(
      (task) => task.status === "pending" || task.status === "processing"
    );
  };

  const getFailedTasks = (): Task[] => {
    return state.tasks.filter((task) => task.status === "failed");
  };

  const value: TaskContextType = {
    state,
    addImageTask,
    addTextTask,
    removeTask,
    clearCompleted,
    clearAll,
    getTaskById,
    getCompletedTasks,
    getActiveTasks,
    getFailedTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Hook
export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

// 导出类型
export type { TaskState, TaskAction };
