import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import {
  AppleIcon,
  CameraIcon,
  SearchIcon,
  HomeIcon,
  CompareIcon,
  UserIcon,
} from "./SvgIcons";
import {
  analyzeImage,
  RecognitionResult as ApiRecognitionResult,
} from "../services/apiService";

interface HomePageProps {
  onRecognitionResult?: (
    result: ApiRecognitionResult,
    imageUri: string
  ) => void;
  onTextSearch?: () => void;
  onNavigateToCompare?: () => void;
}

const handleUserPress = () => {
  console.log("用户");
};

const HomePage: React.FC<HomePageProps> = ({
  onRecognitionResult,
  onTextSearch,
  onNavigateToCompare,
}) => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  const recognizeImage = async (imageUri: string) => {
    if (!imageUri) return;

    setIsRecognizing(true);
    try {
      const result = await analyzeImage(imageUri);
      onRecognitionResult?.(result, imageUri);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "识别失败，请重试";
      Alert.alert("识别失败", errorMessage, [
        {
          text: "取消",
          style: "cancel",
          onPress: () => setCapturedImage(null),
        },
        { text: "重试", onPress: () => recognizeImage(imageUri) },
      ]);
      console.error("识别错误:", error);
    } finally {
      setIsRecognizing(false);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current && !isRecognizing) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        if (photo) {
          setCapturedImage(photo.uri);
          await recognizeImage(photo.uri);
        }
      } catch (error) {
        Alert.alert("错误", "拍照失败，请重试");
        console.error("拍照错误:", error);
      }
    }
  };

  const selectFromGallery = async () => {
    if (isRecognizing) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        await recognizeImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("错误", "选择图片失败");
      console.error("选择图片错误:", error);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setIsRecognizing(false);
  };

  // 权限检查
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>正在初始化相机...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            需要相机权限才能使用拍照识别功能
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>授予权限</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.title}>PriceHunter</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleUserPress}
          >
            <UserIcon width={24} height={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 摄像头预览区域 */}
      <View style={styles.cameraContainer}>
        {capturedImage ? (
          // 显示拍摄的照片
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: capturedImage }}
              style={styles.previewImage}
            />
            <View style={styles.imageOverlay}>
              <Text style={styles.previewText}>已拍摄照片</Text>
            </View>
          </View>
        ) : (
          // 显示实时摄像头画面
          <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
            <View style={styles.cameraOverlay}>
              <View style={styles.focusArea} />
              <Text style={styles.instructionText}>将水果放在框内拍照识别</Text>
            </View>
          </CameraView>
        )}

        {/* 识别中遮罩 */}
        {isRecognizing && (
          <View style={styles.recognizingOverlay}>
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text style={styles.recognizingText}>正在识别中...</Text>
          </View>
        )}
      </View>

      {/* 底部控制区 */}
      <View style={styles.controlsContainer}>
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={selectFromGallery}
            disabled={isRecognizing}
          >
            <Text style={styles.galleryButtonText}>相册</Text>
          </TouchableOpacity>

          {capturedImage ? (
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={retakePhoto}
              disabled={isRecognizing}
            >
              <Text style={styles.retakeButtonText}>重拍</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
              disabled={isRecognizing}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.flipButton}
            onPress={() =>
              setFacing((current) => (current === "back" ? "front" : "back"))
            }
            disabled={isRecognizing || !!capturedImage}
          >
            <Text style={styles.flipButtonText}>翻转</Text>
          </TouchableOpacity>
        </View>

        {/* 文字搜索入口 */}
        <TouchableOpacity
          style={styles.textSearchButton}
          onPress={onTextSearch}
        >
          <SearchIcon width={20} height={20} color="white" />
          <Text style={styles.textSearchText}>文字搜索</Text>
        </TouchableOpacity>
        <View style={styles.powerTextContainer}>
          <Text style={styles.powerText}>POWERED BY KIMI/MINIMAX AI</Text>
        </View>
      </View>

      {/* 底部间距，为统一导航栏留出空间 */}
      <View style={styles.bottomSpacing} />
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
    fontSize: 24,
    color: "white",
  },
  powerTextContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  powerText: {
    fontSize: 10,
    fontWeight: "500",
    color: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
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
    // flexDirection: "row",
    gap: 16,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 36,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 24,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    // boxShadow:
    // "6px 0 4px -4px rgba(255, 255, 255, 1) inset, -6px 0 4px -4px rgba(255, 255, 255, 1) inset, 0 -5px 4px -4px rgba(188, 139, 134, 0.4) inset, 0 5px 4px -4px rgba(188, 139, 134, 0.4) inset",
    height: 300,
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
  },
  actionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#370B0B", // 深色文字（用于粉色按钮）
  },
  searchActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white", // 白色文字（用于透明按钮）
  },
  bottomSpacing: {
    height: 100, // 为底部导航栏留出空间
  },

  // 权限和加载相关样式
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    marginTop: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  permissionText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  // 摄像头相关样式
  cameraContainer: {
    flex: 1,
    margin: 24,
    borderRadius: 24,
    overflow: "hidden",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  focusArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  instructionText: {
    color: "white",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  controlsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  galleryButton: {
    width: 60,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
  },
  galleryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "white",
    fontWeight: "600",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  flipButton: {
    width: 60,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
  },
  flipButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  // 识别状态相关样式
  recognizingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
  },
  recognizingText: {
    color: "white",
    fontSize: 16,
    marginTop: 16,
  },
  // 文字搜索按钮样式
  textSearchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  textSearchText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  // 照片预览样式
  imagePreviewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // 黑色背景
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  previewText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  retakeButton: {
    width: 80,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "white",
  },
  retakeButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default HomePage;
