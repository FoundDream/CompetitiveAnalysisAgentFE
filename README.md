# 水果助手 (Fruit Helper)

一个基于 React Native 和 AI 的智能水果识别与价格分析应用。

## 📱 功能特性

- 🍎 **智能识别**: 通过拍照识别水果品种
- 💰 **价格分析**: AI 分析价格合理性和市场趋势
- 📊 **口感评分**: 多维度口感分析（甜度、酸度、水分等）
- 🔍 **文字搜索**: 手动输入水果信息进行分析
- ⚖️ **产品比较**: 多个水果产品对比功能
- 📈 **价格趋势**: 历史价格走势图表

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 7.0.0
- Expo CLI
- 手机安装 Expo Go App

### 安装步骤

1. **克隆项目**

   ```bash
   git clone <repository-url>
   cd fruit-helper
   ```

2. **安装依赖**

   ```bash
   npm install -g pnpm
   pnpm install
   ```

3. **启动开发服务器**

   ```bash
   pnpm run start
   ```

4. **在手机上运行**
   - 在手机上打开 Expo Go App
   - 扫描终端中显示的二维码

## 🔧 API 配置与真机调试

### 后端服务配置

本应用需要连接后端 AI 分析服务，默认运行在 `8000` 端口。

### 开发环境配置

项目会根据运行环境自动选择 API 地址：

- **iOS 模拟器**: `http://localhost:8000`
- **Android 模拟器**: `http://10.0.2.2:8000`
- **真机调试**: `http://[你的电脑IP]:8000`

### 真机调试设置

如果在真机上遇到网络连接错误，请按以下步骤配置：

1. **获取电脑 IP 地址**

   ```bash
   # Mac/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # Windows
   ipconfig
   ```

2. **更新 API 配置**

   编辑 `src/config/api.ts` 文件：

   ```typescript
   const DEVELOPMENT_CONFIG = {
     COMPUTER_IP: "你的电脑IP地址", // 例如: '192.168.1.100'
     FORCE_USE_IP: true, // 真机调试时设为true
     // ...
   };
   ```

3. **网络要求**
   - 确保手机和电脑在同一 WiFi 网络
   - 确保后端服务正在运行
   - 检查防火墙设置，允许 8000 端口访问

### 常见网络问题

#### 问题 1: `Network Error` 或 `ERR_NETWORK`

**原因**: 手机无法访问电脑的后端服务

**解决方案**:

1. 检查电脑 IP 地址是否正确
2. 确保 `FORCE_USE_IP: true`
3. 确保手机和电脑在同一网络
4. 检查后端服务是否运行在 8000 端口

#### 问题 2: 请求超时

**原因**: AI 分析需要较长时间

**解决方案**:

- 当前超时设置为 90 秒，AI 分析通常需要 30-60 秒
- 请耐心等待分析完成

#### 问题 3: 模拟器正常，真机无法连接

**原因**: 真机需要使用电脑的实际 IP 地址

**解决方案**:

1. 获取电脑 IP 地址
2. 更新 `COMPUTER_IP` 配置
3. 设置 `FORCE_USE_IP: true`

## 🛠️ 开发配置

### 调试模式

在 `src/config/api.ts` 中可以配置调试选项：

```typescript
const DEVELOPMENT_CONFIG = {
  COMPUTER_IP: "172.20.10.3", // 电脑IP地址
  PORT: 8000, // 后端端口
  FORCE_USE_IP: true, // 强制使用IP（真机调试）
  ENABLE_LOGGING: true, // 启用调试日志
};
```

### Mock 数据

如果后端服务不可用，可以启用 Mock 数据：

```typescript
export const DEV_CONFIG = {
  ENABLE_MOCK_DATA: true, // 设置为true使用模拟数据
  // ...
};
```

## 📁 项目结构

```
fruit-helper/
├── src/
│   ├── components/          # React组件
│   │   ├── HomePage.tsx     # 首页
│   │   ├── DetailPage.tsx   # 详情页
│   │   ├── SearchPage.tsx   # 搜索页
│   │   ├── ComparePage.tsx  # 比较页
│   │   └── ...
│   ├── config/
│   │   └── api.ts          # API配置
│   └── services/
│       └── apiService.ts   # API服务
├── android/                # Android原生代码
├── ios/                   # iOS原生代码
└── assets/               # 静态资源
```

## 🔍 调试技巧

### 查看 API 配置信息

启动应用后，控制台会显示当前 API 配置：

```
🚀 API配置信息: {
  BASE_URL: "http://172.20.10.3:8000",
  Platform: "ios",
  forceUseIP: true,
  computerIP: "172.20.10.3"
}
```

### 网络请求日志

启用 `ENABLE_LOGGING: true` 后，所有 API 请求都会在控制台显示详细日志。

## 📝 更新日志

### v1.0.0

- ✅ 智能水果识别功能
- ✅ AI 价格分析
- ✅ 口感多维度评分
- ✅ 文字搜索功能
- ✅ 产品比较功能
- ✅ 真机调试网络配置优化

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。
