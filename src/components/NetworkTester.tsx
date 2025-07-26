import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { NetworkHelper } from "../config/networkHelper";
import { API_CONFIG } from "../config/api";

const NetworkTester: React.FC = () => {
  const [testIP, setTestIP] = useState("30.201.220.51");
  const [testResult, setTestResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    if (!testIP.trim()) {
      Alert.alert("错误", "请输入IP地址");
      return;
    }

    setIsLoading(true);
    setTestResult("正在测试连接...");

    try {
      const result = await NetworkHelper.testConnection(testIP);
      const diagnosis = await NetworkHelper.diagnoseNetwork(testIP);

      setTestResult(`${result.message}\n\n${diagnosis}`);
    } catch (error) {
      setTestResult(
        `测试失败: ${error instanceof Error ? error.message : "未知错误"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentConfig = () => {
    const info = NetworkHelper.getCurrentNetworkInfo();
    const suggestion = NetworkHelper.generateConfigSuggestion(testIP);
    setTestResult(
      `${info}\n\n${suggestion}\n\n当前API配置: ${API_CONFIG.BASE_URL}`
    );
  };

  const testCurrentAPI = async () => {
    setIsLoading(true);
    setTestResult("正在测试当前API配置...");

    try {
      // 提取当前配置的IP
      const currentIP =
        API_CONFIG.BASE_URL.match(/http:\/\/([^:]+):/)?.[1] || testIP;
      const result = await NetworkHelper.testConnection(currentIP);
      const diagnosis = await NetworkHelper.diagnoseNetwork(currentIP);

      setTestResult(
        `当前API: ${API_CONFIG.BASE_URL}\n\n${result.message}\n\n${diagnosis}`
      );
    } catch (error) {
      setTestResult(
        `当前API测试失败: ${
          error instanceof Error ? error.message : "未知错误"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 网络连接测试工具</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>测试IP地址:</Text>
        <TextInput
          style={styles.input}
          value={testIP}
          onChangeText={setTestIP}
          placeholder="输入IP地址"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={testConnection}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "测试中..." : "测试连接"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={testCurrentAPI}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>测试当前API</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.infoButton]}
          onPress={getCurrentConfig}
        >
          <Text style={styles.buttonText}>获取配置信息</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultContainer}>
        <Text style={styles.resultText}>{testResult}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "white",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    minWidth: 100,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  secondaryButton: {
    backgroundColor: "#34C759",
  },
  infoButton: {
    backgroundColor: "#FF9500",
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  resultContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 12,
  },
  resultText: {
    color: "#00ff00",
    fontSize: 12,
    fontFamily: "monospace",
    lineHeight: 18,
  },
});

export default NetworkTester;
