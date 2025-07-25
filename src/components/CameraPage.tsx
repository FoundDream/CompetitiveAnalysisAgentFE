import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
  StatusBar,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { CameraIcon, SearchIcon, ArrowLeftIcon } from "./SvgIcons";
import {
  analyzeImage,
  RecognitionResult as ApiRecognitionResult,
} from "../services/apiService";

interface CameraPageProps {
  onBack?: () => void;
  onRecognitionResult?: (
    result: ApiRecognitionResult,
    imageUri: string
  ) => void;
}

const CameraPage: React.FC<CameraPageProps> = ({
  onBack,
  onRecognitionResult,
}) => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    requestPermission();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        if (photo) {
          setCapturedImage(photo.uri);
        }
      } catch (error) {
        Alert.alert("错误", "拍照失败，请重试");
        console.error("拍照错误:", error);
      }
    }
  };

  const selectFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("错误", "选择图片失败");
      console.error("选择图片错误:", error);
    }
  };

  const recognizeImage = async () => {
    if (!capturedImage) return;

    setIsRecognizing(true);
    try {
      // 首先检查API服务是否可用

      const result = await analyzeImage(capturedImage);
      onRecognitionResult?.(result, capturedImage);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "识别失败，请重试";
      Alert.alert("识别失败", errorMessage, [
        { text: "取消", style: "cancel" },
        { text: "重试", onPress: recognizeImage },
      ]);
      console.error("识别错误:", error);
    } finally {
      setIsRecognizing(false);
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>需要相机权限才能拍照识别</Text>
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

      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeftIcon width={20} height={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>拍照识别</Text>
        <View style={styles.placeholder} />
      </View>

      {capturedImage ? (
        // 显示拍摄的照片
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />

          {isRecognizing && (
            <View style={styles.recognizingOverlay}>
              <ActivityIndicator size="large" color="#FF6B6B" />
              <Text style={styles.recognizingText}>正在识别中...</Text>
            </View>
          )}
        </View>
      ) : (
        // 相机预览
        <View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
            <View style={styles.cameraOverlay}>
              <View style={styles.focusArea} />
              <Text style={styles.instructionText}>将水果放在框内拍照</Text>
            </View>
          </CameraView>
        </View>
      )}

      {/* 底部控制区 */}
      <View style={styles.controlsContainer}>
        {capturedImage ? (
          <View style={styles.capturedControls}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={retakePicture}
            >
              <Text style={styles.secondaryButtonText}>重拍</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                isRecognizing && styles.disabledButton,
              ]}
              onPress={recognizeImage}
              disabled={isRecognizing}
            >
              <SearchIcon width={20} height={20} color="white" />
              <Text style={styles.primaryButtonText}>
                {isRecognizing ? "识别中..." : "开始识别"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={selectFromGallery}
            >
              <Text style={styles.galleryButtonText}>相册</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.flipButton}
              onPress={() =>
                setFacing((current) => (current === "back" ? "front" : "back"))
              }
            >
              <Text style={styles.flipButtonText}>翻转</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "300",
    color: "white",
  },
  placeholder: {
    width: 40,
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
  previewContainer: {
    flex: 1,
    margin: 24,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
  },
  previewImage: {
    flex: 1,
    width: "100%",
  },
  recognizingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  recognizingText: {
    color: "white",
    fontSize: 16,
    marginTop: 16,
  },
  controlsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
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
  },
  capturedControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  primaryButton: {
    flex: 2,
    height: 48,
    backgroundColor: "#FF6B6B",
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CameraPage;
