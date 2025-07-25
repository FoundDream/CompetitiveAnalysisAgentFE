import React, { useState } from "react";
import HomePage from "./HomePage";
import DetailPage from "./DetailPage";
import SearchPage from "./SearchPage";
import ComparePage from "./ComparePage";
import CameraPage from "./CameraPage";
import RecognitionResultPage from "./RecognitionResultPage";

export type PageType =
  | "home"
  | "detail"
  | "photo"
  | "search"
  | "compare"
  | "camera"
  | "recognition";

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [selectedFruit, setSelectedFruit] = useState<string>("");
  const [recognitionResult, setRecognitionResult] = useState<any>(null);
  const [capturedImageUri, setCapturedImageUri] = useState<string>("");

  const navigateToDetail = (fruitName: string) => {
    setSelectedFruit(fruitName);
    setCurrentPage("detail");
  };

  const navigateToHome = () => {
    setCurrentPage("home");
  };

  const handleDirectRecognition = (result: any, imageUri: string) => {
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
    setCurrentPage("recognition");
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
    console.log("导航到比较页面");
  };

  const handleEnterCompare = () => {
    console.log("查看比较");
    navigateToCompare();
  };

  // 渲染当前页面
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            onRecognitionResult={handleDirectRecognition}
            onTextSearch={navigateToSearch}
            onNavigateToCompare={navigateToCompare}
          />
        );
      case "detail":
        return (
          <DetailPage
            fruitName={selectedFruit}
            onBack={navigateToHome}
            onCompare={handleAddToCompare}
            onEnterCompare={handleEnterCompare}
          />
        );
      case "search":
        return (
          <SearchPage onBack={navigateToHome} onFruitPress={navigateToDetail} />
        );
      case "compare":
        return (
          <ComparePage
            onBack={navigateToHome}
            onFruitPress={navigateToDetail}
            onNavigateToHome={navigateToHome}
          />
        );
      case "camera":
        return (
          <CameraPage
            onBack={navigateToHome}
            onRecognitionResult={handleRecognitionResult}
          />
        );
      case "recognition":
        return (
          <RecognitionResultPage
            result={recognitionResult}
            imageUri={capturedImageUri}
            onBack={navigateToHome}
            onSaveToFavorites={handleSaveToFavorites}
            onCompare={handleAddToCompare}
          />
        );
      default:
        return (
          <HomePage
            onRecognitionResult={handleDirectRecognition}
            onTextSearch={navigateToSearch}
            onNavigateToCompare={navigateToCompare}
          />
        );
    }
  };

  return renderCurrentPage();
};

export default Navigation;
