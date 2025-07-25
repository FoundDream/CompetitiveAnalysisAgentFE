import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, {
  Polyline,
  Line,
  Circle,
  Text as SvgText,
  G,
  Defs,
  LinearGradient,
  Stop,
  Path,
} from "react-native-svg";

interface PriceTrendData {
  date: string;
  price: number;
}

interface PriceTrendChartProps {
  data: PriceTrendData[];
  currentPrice: number;
  width?: number;
  height?: number;
}

const PriceTrendChart: React.FC<PriceTrendChartProps> = ({
  data,
  currentPrice,
  width = 320,
  height = 180,
}) => {
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // 计算价格范围
  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const paddedMin = minPrice - priceRange * 0.1;
  const paddedMax = maxPrice + priceRange * 0.1;
  const paddedRange = paddedMax - paddedMin;

  // 坐标转换函数
  const getX = (index: number) =>
    padding.left + (index / (data.length - 1)) * chartWidth;
  const getY = (price: number) =>
    padding.top + ((paddedMax - price) / paddedRange) * chartHeight;

  // 生成路径点
  const pathPoints = data
    .map((point, index) => `${getX(index)},${getY(point.price)}`)
    .join(" ");

  // 生成填充路径
  const fillPath = `M ${padding.left},${getY(paddedMin)} L ${pathPoints
    .split(" ")
    .join(" L ")} L ${padding.left + chartWidth},${getY(paddedMin)} Z`;

  // 计算趋势
  const firstPrice = data[0]?.price || currentPrice;
  const lastPrice = data[data.length - 1]?.price || currentPrice;
  const trend =
    lastPrice > firstPrice ? "up" : lastPrice < firstPrice ? "down" : "stable";
  const trendPercentage = (
    ((lastPrice - firstPrice) / firstPrice) *
    100
  ).toFixed(1);

  // 生成网格线
  const generateGridLines = () => {
    const lines = [];
    const gridCount = 4;

    // 水平网格线
    for (let i = 0; i <= gridCount; i++) {
      const y = padding.top + (i / gridCount) * chartHeight;
      const price = paddedMax - (i / gridCount) * paddedRange;

      lines.push(
        <Line
          key={`h-grid-${i}`}
          x1={padding.left}
          y1={y}
          x2={padding.left + chartWidth}
          y2={y}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
          strokeDasharray="3,3"
        />
      );

      // 价格标签
      if (i % 2 === 0) {
        lines.push(
          <SvgText
            key={`price-label-${i}`}
            x={padding.left - 5}
            y={y + 4}
            fontSize="10"
            fill="rgba(255, 255, 255, 0.6)"
            textAnchor="end"
          >
            {price.toFixed(1)}
          </SvgText>
        );
      }
    }

    return lines;
  };

  // 生成数据点
  const generateDataPoints = () => {
    return data.map((point, index) => {
      const x = getX(index);
      const y = getY(point.price);

      return (
        <G key={`point-${index}`}>
          <Circle
            cx={x}
            cy={y}
            r="4"
            fill="#FF6B6B"
            stroke="white"
            strokeWidth="2"
          />
          {/* 悬浮价格标签 */}
          {index === data.length - 1 && (
            <G>
              <SvgText
                x={x}
                y={y - 15}
                fontSize="10"
                fill="#FF6B6B"
                textAnchor="middle"
                fontWeight="bold"
              >
                ¥{point.price.toFixed(1)}
              </SvgText>
            </G>
          )}
        </G>
      );
    });
  };

  // 生成日期标签
  const generateDateLabels = () => {
    const labelCount = Math.min(4, data.length);
    const step = Math.floor(data.length / labelCount);

    return data
      .filter((_, index) => index % step === 0 || index === data.length - 1)
      .map((point, labelIndex) => {
        const originalIndex = data.findIndex((d) => d.date === point.date);
        const x = getX(originalIndex);
        const y = height - 10;

        return (
          <SvgText
            key={`date-${labelIndex}`}
            x={x}
            y={y}
            fontSize="9"
            fill="rgba(255, 255, 255, 0.6)"
            textAnchor="middle"
          >
            {formatDate(point.date)}
          </SvgText>
        );
      });
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月`;
  };

  // 趋势箭头
  const getTrendIcon = () => {
    if (trend === "up") return "↗";
    if (trend === "down") return "↘";
    return "→";
  };

  const getTrendColor = () => {
    if (trend === "up") return "#22C55E";
    if (trend === "down") return "#EF4444";
    return "#6B7280";
  };

  return (
    <View style={styles.container}>
      {/* 趋势指示器 */}
      <View style={styles.trendIndicator}>
        <View
          style={[
            styles.trendBadge,
            { backgroundColor: getTrendColor() + "20" },
          ]}
        >
          <Text style={[styles.trendIcon, { color: getTrendColor() }]}>
            {getTrendIcon()}
          </Text>
          {/* <Text style={[styles.trendText, { color: getTrendColor() }]}>
            {Math.abs(parseFloat(trendPercentage))}%
          </Text> */}
        </View>
        <Text style={styles.trendLabel}>
          {trend === "up"
            ? "价格上涨"
            : trend === "down"
            ? "价格下跌"
            : "价格稳定"}
        </Text>
      </View>

      {/* 图表 */}
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.05" />
          </LinearGradient>
        </Defs>

        {/* 网格线 */}
        {generateGridLines()}

        {/* 填充区域 */}
        <Path d={fillPath} fill="url(#priceGradient)" />

        {/* 价格线 */}
        <Polyline
          points={pathPoints}
          fill="none"
          stroke="#FF6B6B"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 数据点 */}
        {/* {generateDataPoints()} */}

        {/* 日期标签 */}
        {generateDateLabels()}

        {/* 当前价格线 */}
        <Line
          x1={padding.left}
          y1={getY(currentPrice)}
          x2={padding.left + chartWidth}
          y2={getY(currentPrice)}
          stroke="#FF6B6B"
          strokeWidth="2"
          strokeDasharray="5,5"
          opacity="0.8"
        />

        {/* 当前价格标签 */}
        <SvgText
          x={padding.left + chartWidth + 5}
          y={getY(currentPrice) + 4}
          fontSize="10"
          fill="#FF6B6B"
          fontWeight="bold"
        >
          当前 ¥{currentPrice.toFixed(1)}
        </SvgText>
      </Svg>

      {/* 图表说明 */}
      <Text style={styles.chartNote}>* 基于最近30天市场价格数据</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  trendIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 8,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendIcon: {
    fontSize: 14,
    fontWeight: "bold",
  },
  trendText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  trendLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  chartNote: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    marginTop: 8,
    fontStyle: "italic",
  },
});

export default PriceTrendChart;
