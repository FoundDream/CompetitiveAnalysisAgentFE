import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, {
  Polygon,
  Line,
  Circle,
  Text as SvgText,
  G,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

interface RadarData {
  sweetness: number | null; // 甜度 (0-5)
  acidity: number | null; // 酸度 (0-5)
  moisture: number | null; // 水分 (0-5)
  crispness: number | null; // 脆度 (0-5)
  freshness: number | null; // 新鲜程度 (0-5, 不展示标签)
}

interface RadarChartProps {
  data: RadarData;
  size?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ data, size = 200 }) => {
  const center = size / 2;
  const maxRadius = (size - 80) / 2; // 增加标签空间，避免溢出
  const levels = 5; // 雷达图层级数
  const maxValue = 5; // 最大值改为5

  // 数据点（按顺序：甜度、酸度、水分、脆度、新鲜程度）
  // 处理null值，将null转换为0
  const values = [
    data.sweetness ?? 0,
    data.acidity ?? 0,
    data.moisture ?? 0,
    data.crispness ?? 0,
    data.freshness ?? 0,
  ];

  // 标签（新鲜程度不显示）
  const labels = ["甜度", "酸度", "水分", "脆度", "新鲜度"];

  // 计算每个点的角度（从顶部开始，顺时针）
  const angleStep = (2 * Math.PI) / 5;
  const startAngle = -Math.PI / 2; // 从顶部开始

  // 计算坐标点
  const getPoint = (angle: number, radius: number) => {
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  // 生成网格线
  const generateGridLines = () => {
    const lines = [];

    // 同心圆网格
    for (let level = 1; level <= levels; level++) {
      const radius = (maxRadius * level) / levels;
      const points = [];

      for (let i = 0; i < 5; i++) {
        const angle = startAngle + i * angleStep;
        const point = getPoint(angle, radius);
        points.push(`${point.x},${point.y}`);
      }

      lines.push(
        <Polygon
          key={`grid-${level}`}
          points={points.join(" ")}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />
      );
    }

    // 径向线
    for (let i = 0; i < 5; i++) {
      const angle = startAngle + i * angleStep;
      const endPoint = getPoint(angle, maxRadius);

      lines.push(
        <Line
          key={`radial-${i}`}
          x1={center}
          y1={center}
          x2={endPoint.x}
          y2={endPoint.y}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />
      );
    }

    return lines;
  };

  // 生成数据多边形
  const generateDataPolygon = () => {
    const points = [];

    for (let i = 0; i < 5; i++) {
      const angle = startAngle + i * angleStep;
      const value = values[i];
      const radius = (maxRadius * value) / maxValue; // 使用maxValue=5
      const point = getPoint(angle, radius);
      points.push(`${point.x},${point.y}`);
    }

    return (
      <G>
        {/* 填充区域 */}
        <Polygon
          points={points.join(" ")}
          fill="url(#radarGradient)"
          fillOpacity="0.3"
        />
        {/* 边框 */}
        <Polygon
          points={points.join(" ")}
          fill="none"
          stroke="#FF6B6B"
          strokeWidth="2"
        />
      </G>
    );
  };

  // 生成标签
  const generateLabels = () => {
    const labelElements = [];

    for (let i = 0; i < 5; i++) {
      if (!labels[i]) continue; // 跳过空标签

      const angle = startAngle + i * angleStep;
      const labelRadius = maxRadius + 30; // 标签距离
      const point = getPoint(angle, labelRadius);

      // 标签文字
      labelElements.push(
        <SvgText
          key={`label-${i}`}
          x={point.x}
          y={point.y}
          fontSize="11"
          fill="rgba(255, 255, 255, 0.8)"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {labels[i]}
        </SvgText>
      );

      // 数值显示在标签正下方
      labelElements.push(
        <SvgText
          key={`value-${i}`}
          x={point.x}
          y={point.y + 14} // 在标签下方14像素的位置
          fontSize="9"
          fill="#FF6B6B"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontWeight="bold"
        >
          {values[i].toFixed(1)}
        </SvgText>
      );
    }

    return labelElements;
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient
            id="radarGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <Stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#FF6B6B" stopOpacity="0.2" />
          </LinearGradient>
        </Defs>

        {/* 网格线 */}
        {generateGridLines()}

        {/* 数据多边形 */}
        {generateDataPolygon()}

        {/* 标签 */}
        {generateLabels()}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RadarChart;
