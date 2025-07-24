import React, { useState } from "react";
import HomePage from "./HomePage";
import DetailPage from "./DetailPage";
import PhotoPage from "./PhotoPage";
import SearchPage from "./SearchPage";
import ComparePage from "./ComparePage";

export type PageType = "home" | "detail" | "photo" | "search" | "compare";

interface NavigationProps {}

const Navigation: React.FC<NavigationProps> = () => {
  const [currentPage, setCurrentPage] = useState<PageType>("home");
  const [selectedFruit, setSelectedFruit] = useState<string>("");

  const navigateToDetail = (fruitName: string) => {
    setSelectedFruit(fruitName);
    setCurrentPage("detail");
  };

  const navigateToHome = () => {
    setCurrentPage("home");
  };

  const navigateToPhoto = () => {
    setCurrentPage("photo");
    console.log("导航到拍照识别页面");
  };

  const navigateToSearch = () => {
    setCurrentPage("search");
    console.log("导航到文字搜索页面");
  };

  const navigateToCompare = () => {
    setCurrentPage("compare");
    console.log("导航到比较页面");
  };

  const handleFindStore = () => {
    console.log("查找商家");
  };

  // 渲染当前页面
  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            onFruitPress={navigateToDetail}
            onPhotoRecognition={navigateToPhoto}
            onTextSearch={navigateToSearch}
          />
        );
      case "detail":
        return (
          <DetailPage
            fruitName={selectedFruit}
            onBack={navigateToHome}
            onCompare={navigateToCompare}
            onFindStore={handleFindStore}
          />
        );
      case "photo":
        return (
          <PhotoPage
            onBack={navigateToHome}
            onFruitDetected={navigateToDetail}
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
          />
        );
      default:
        return (
          <HomePage
            onFruitPress={navigateToDetail}
            onPhotoRecognition={navigateToPhoto}
            onTextSearch={navigateToSearch}
          />
        );
    }
  };

  return renderCurrentPage();
};

export default Navigation;
