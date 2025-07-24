import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from "react-native";

interface PhotoPageProps {
  onBack?: () => void;
  onFruitDetected?: (fruitName: string) => void;
}

const PhotoPage: React.FC<PhotoPageProps> = ({ onBack, onFruitDetected }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // 预留的功能函数
  const handleBack = () => {
    console.log("返回");
    onBack?.();
  };

  const handleTakePhoto = () => {
    setIsCapturing(true);
    // TODO: 实现拍照功能
    console.log("开始拍照");

    // 模拟拍照过程
    setTimeout(() => {
      setIsCapturing(false);
      setCapturedImage("captured");
      console.log("拍照完成");
    }, 2000);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    console.log("重新拍照");
  };

  const handleConfirm = () => {
    // TODO: 实现图像识别
    console.log("确认识别");
    // 模拟识别结果
    setTimeout(() => {
      onFruitDetected?.("红富士苹果");
    }, 1500);
  };

  const handleGallery = () => {
    // TODO: 从相册选择
    console.log("从相册选择");
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
          <Text style={styles.headerTitle}>拍照识别</Text>
        </View>
      </View>

      {/* 主要内容区 */}
      <View style={styles.content}>
        {/* 拍照区域 */}
        <View style={styles.cameraContainer}>
          <View style={styles.cameraView}>
            {!capturedImage ? (
              <View style={styles.cameraPlaceholder}>
                <Text style={styles.cameraIcon}>📷</Text>
                <Text style={styles.cameraText}>将水果标签对准取景框</Text>
                <Text style={styles.cameraSubText}>
                  确保标签清晰可见，光线充足
                </Text>
              </View>
            ) : isCapturing ? (
              <View style={styles.capturingView}>
                <Text style={styles.capturingIcon}>⏳</Text>
                <Text style={styles.capturingText}>正在拍照...</Text>
              </View>
            ) : (
              <View style={styles.capturedView}>
                <Text style={styles.capturedIcon}>✅</Text>
                <Text style={styles.capturedText}>拍照完成</Text>
                <Text style={styles.capturedSubText}>图片已捕获，准备识别</Text>
              </View>
            )}
          </View>

          {/* 取景框 */}
          <View style={styles.viewfinder}>
            <View style={styles.viewfinderCorner} />
            <View style={[styles.viewfinderCorner, styles.topRight]} />
            <View style={[styles.viewfinderCorner, styles.bottomLeft]} />
            <View style={[styles.viewfinderCorner, styles.bottomRight]} />
          </View>
        </View>

        {/* 提示信息 */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>拍照提示</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>确保标签完整在取景框内</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>☀️</Text>
              <Text style={styles.tipText}>保持充足的光线</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>📐</Text>
              <Text style={styles.tipText}>避免倾斜和模糊</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 底部操作区 */}
      <View style={styles.bottomContainer}>
        <View style={styles.bottomActions}>
          {!capturedImage ? (
            <>
              <TouchableOpacity
                style={styles.galleryButton}
                onPress={handleGallery}
              >
                <Text style={styles.galleryIcon}>🖼️</Text>
                <Text style={styles.galleryText}>相册</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.captureButton,
                  isCapturing && styles.capturingButton,
                ]}
                onPress={handleTakePhoto}
                disabled={isCapturing}
              >
                <View style={styles.captureButtonInner}>
                  <Text style={styles.captureButtonText}>
                    {isCapturing ? "⏳" : "📷"}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.placeholder} />
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={handleRetake}
              >
                <Text style={styles.retakeIcon}>🔄</Text>
                <Text style={styles.retakeText}>重拍</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmIcon}>✅</Text>
                <Text style={styles.confirmText}>识别</Text>
              </TouchableOpacity>
            </>
          )}
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  cameraContainer: {
    position: "relative",
    height: 400,
    marginBottom: 32,
  },
  cameraView: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraPlaceholder: {
    alignItems: "center",
  },
  cameraIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  cameraText: {
    fontSize: 18,
    color: "white",
    fontWeight: "300",
    marginBottom: 8,
    textAlign: "center",
  },
  cameraSubText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  capturingView: {
    alignItems: "center",
  },
  capturingIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  capturingText: {
    fontSize: 18,
    color: "white",
    fontWeight: "300",
  },
  capturedView: {
    alignItems: "center",
  },
  capturedIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  capturedText: {
    fontSize: 18,
    color: "white",
    fontWeight: "300",
    marginBottom: 8,
  },
  capturedSubText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  viewfinder: {
    position: "absolute",
    top: "25%",
    left: "15%",
    right: "15%",
    bottom: "25%",
  },
  viewfinderCorner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#FDDDDC",
    borderWidth: 3,
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    left: "auto",
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    top: "auto",
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    top: "auto",
    left: "auto",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  tipsContainer: {
    backgroundColor: "rgba(41, 36, 33, 0.1)",
    borderRadius: 22,
    padding: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "300",
    color: "white",
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  tipText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    flex: 1,
  },
  bottomContainer: {
    marginTop: 24,
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 12,
    height: 100,
  },
  galleryButton: {
    alignItems: "center",
    flex: 1,
  },
  galleryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  galleryText: {
    fontSize: 12,
    color: "white",
    fontWeight: "300",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(253, 221, 220, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  capturingButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonText: {
    fontSize: 24,
  },
  placeholder: {
    flex: 1,
  },
  retakeButton: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 16,
    borderRadius: 24,
    marginRight: 8,
  },
  retakeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  retakeText: {
    fontSize: 14,
    color: "white",
    fontWeight: "300",
  },
  confirmButton: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "rgba(253, 221, 220, 0.8)",
    paddingVertical: 16,
    borderRadius: 24,
    marginLeft: 8,
  },
  confirmIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  confirmText: {
    fontSize: 14,
    color: "#370B0B",
    fontWeight: "300",
  },
});

export default PhotoPage;
