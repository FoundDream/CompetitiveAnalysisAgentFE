import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  SafeAreaView,
} from "react-native";

// 中国主要城市数据
const CITIES = [
  { id: "beijing", name: "北京", province: "北京市" },
  { id: "shanghai", name: "上海", province: "上海市" },
  { id: "guangzhou", name: "广州", province: "广东省" },
  { id: "shenzhen", name: "深圳", province: "广东省" },
  { id: "hangzhou", name: "杭州", province: "浙江省" },
  { id: "nanjing", name: "南京", province: "江苏省" },
  { id: "wuhan", name: "武汉", province: "湖北省" },
  { id: "chengdu", name: "成都", province: "四川省" },
  { id: "xian", name: "西安", province: "陕西省" },
  { id: "chongqing", name: "重庆", province: "重庆市" },
  { id: "tianjin", name: "天津", province: "天津市" },
  { id: "suzhou", name: "苏州", province: "江苏省" },
  { id: "zhengzhou", name: "郑州", province: "河南省" },
  { id: "changsha", name: "长沙", province: "湖南省" },
  { id: "dongguan", name: "东莞", province: "广东省" },
  { id: "qingdao", name: "青岛", province: "山东省" },
  { id: "dalian", name: "大连", province: "辽宁省" },
  { id: "ningbo", name: "宁波", province: "浙江省" },
  { id: "xiamen", name: "厦门", province: "福建省" },
  { id: "jinan", name: "济南", province: "山东省" },
  { id: "harbin", name: "哈尔滨", province: "黑龙江省" },
  { id: "changchun", name: "长春", province: "吉林省" },
  { id: "shenyang", name: "沈阳", province: "辽宁省" },
  { id: "kunming", name: "昆明", province: "云南省" },
  { id: "taiyuan", name: "太原", province: "山西省" },
  { id: "shijiazhuang", name: "石家庄", province: "河北省" },
  { id: "nanning", name: "南宁", province: "广西壮族自治区" },
  { id: "guiyang", name: "贵阳", province: "贵州省" },
  { id: "fuzhou", name: "福州", province: "福建省" },
  { id: "nanchang", name: "南昌", province: "江西省" },
  { id: "hefei", name: "合肥", province: "安徽省" },
  { id: "urumqi", name: "乌鲁木齐", province: "新疆维吾尔自治区" },
  { id: "lanzhou", name: "兰州", province: "甘肃省" },
  { id: "haikou", name: "海口", province: "海南省" },
  { id: "yinchuan", name: "银川", province: "宁夏回族自治区" },
  { id: "xining", name: "西宁", province: "青海省" },
  { id: "lhasa", name: "拉萨", province: "西藏自治区" },
  { id: "hohhot", name: "呼和浩特", province: "内蒙古自治区" },
];

interface City {
  id: string;
  name: string;
  province: string;
}

interface CitySelectorProps {
  selectedCity: City | null;
  onCitySelect: (city: City) => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCity,
  onCitySelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredCities = CITIES.filter(
    (city) =>
      city.name.includes(searchText) || city.province.includes(searchText)
  );

  const handleCitySelect = (city: City) => {
    onCitySelect(city);
    setModalVisible(false);
    setSearchText("");
  };

  return (
    <>
      <TouchableOpacity
        style={styles.selectorButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectorText}>
          {selectedCity ? selectedCity.name : "选择城市"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>选择城市</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="搜索城市或省份"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <ScrollView style={styles.cityList}>
            {filteredCities.map((city) => (
              <TouchableOpacity
                key={city.id}
                style={[
                  styles.cityItem,
                  selectedCity?.id === city.id && styles.selectedCityItem,
                ]}
                onPress={() => handleCitySelect(city)}
              >
                <View style={styles.cityInfo}>
                  <Text
                    style={[
                      styles.cityName,
                      selectedCity?.id === city.id && styles.selectedCityName,
                    ]}
                  >
                    {city.name}
                  </Text>
                  <Text style={styles.provinceName}>{city.province}</Text>
                </View>
                {selectedCity?.id === city.id && (
                  <Text style={styles.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  selectorButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    minWidth: 60,
    alignItems: "center",
  },
  selectorText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  placeholder: {
    width: 50,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "white",
  },
  searchInput: {
    height: 40,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
  },
  cityList: {
    flex: 1,
  },
  cityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedCityItem: {
    backgroundColor: "#f0f8ff",
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  selectedCityName: {
    color: "#007AFF",
  },
  provinceName: {
    fontSize: 14,
    color: "#666",
  },
  checkMark: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "bold",
  },
});

export default CitySelector;
