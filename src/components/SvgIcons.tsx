import React from "react";
import Svg, {
  Path,
  Circle,
  G,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

interface IconProps {
  width?: number;
  height?: number;
  color?: string;
}

// 苹果图标
export const AppleIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#FF6B6B",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Defs>
      <LinearGradient
        id={`appleGradient-${width}-${height}`}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <Stop offset="0%" stopColor="#fff" />
        <Stop offset="100%" stopColor="#fff" />
      </LinearGradient>
    </Defs>
    <Path
      d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
      fill={`url(#appleGradient-${width}-${height})`}
    />
  </Svg>
);

// 橙子图标
export const OrangeIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#FF8C00",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Defs>
      <LinearGradient
        id={`orangeGradient-${width}-${height}`}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <Stop offset="0%" stopColor="#FFA500" />
        <Stop offset="100%" stopColor="#FF8C00" />
      </LinearGradient>
    </Defs>
    <Circle
      cx="12"
      cy="13"
      r="8"
      fill={`url(#orangeGradient-${width}-${height})`}
    />
    <Path d="M12 5c0-1 1-2 2-2s2 1 2 2-1 1-2 1-2 0-2-1z" fill="#4CAF50" />
    <Path
      d="M8 9c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z"
      fill="#FFB84D"
      opacity="0.3"
    />
    <Path
      d="M16 11c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z"
      fill="#FFB84D"
      opacity="0.3"
    />
  </Svg>
);

// 芒果图标
export const MangoIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#FFD700",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Defs>
      <LinearGradient
        id={`mangoGradient-${width}-${height}`}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <Stop offset="0%" stopColor="#FFD700" />
        <Stop offset="50%" stopColor="#FFA500" />
        <Stop offset="100%" stopColor="#FF6347" />
      </LinearGradient>
    </Defs>
    <Path
      d="M12 3c-3 0-8 2-8 8 0 6 4 10 8 10s8-4 8-10c0-6-5-8-8-8z"
      fill={`url(#mangoGradient-${width}-${height})`}
    />
    <Path
      d="M10 7c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z"
      fill="#FFE55C"
      opacity="0.4"
    />
    <Path
      d="M14 9c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z"
      fill="#FFE55C"
      opacity="0.4"
    />
  </Svg>
);

// 蓝莓图标
export const BlueberryIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#4169E1",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Defs>
      <LinearGradient
        id={`blueberryGradient-${width}-${height}`}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <Stop offset="0%" stopColor="#6A5ACD" />
        <Stop offset="100%" stopColor="#4169E1" />
      </LinearGradient>
    </Defs>
    <Circle
      cx="12"
      cy="13"
      r="7"
      fill={`url(#blueberryGradient-${width}-${height})`}
    />
    <Path d="M12 6c0-1 1-2 2-2s2 1 2 2-1 1-2 1-2 0-2-1z" fill="#4CAF50" />
    <Circle cx="10" cy="11" r="1" fill="#E6E6FA" opacity="0.6" />
    <Circle cx="14" cy="12" r="1" fill="#E6E6FA" opacity="0.6" />
    <Circle cx="12" cy="15" r="1" fill="#E6E6FA" opacity="0.6" />
    <Circle cx="9" cy="14" r="0.5" fill="#E6E6FA" opacity="0.4" />
    <Circle cx="15" cy="15" r="0.5" fill="#E6E6FA" opacity="0.4" />
  </Svg>
);

// 牛油果图标
export const AvocadoIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#228B22",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Defs>
      <LinearGradient
        id={`avocadoGradient-${width}-${height}`}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <Stop offset="0%" stopColor="#90EE90" />
        <Stop offset="100%" stopColor="#228B22" />
      </LinearGradient>
    </Defs>
    <Path
      d="M12 3c-4 0-7 3-7 7 0 6 3 11 7 11s7-5 7-11c0-4-3-7-7-7z"
      fill={`url(#avocadoGradient-${width}-${height})`}
    />
    <Circle cx="12" cy="13" r="3" fill="#8B4513" />
    <Circle cx="12" cy="13" r="2" fill="#DEB887" />
  </Svg>
);

// 草莓图标
export const StrawberryIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#DC143C",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Defs>
      <LinearGradient
        id={`strawberryGradient-${width}-${height}`}
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <Stop offset="0%" stopColor="#FF69B4" />
        <Stop offset="100%" stopColor="#DC143C" />
      </LinearGradient>
    </Defs>
    <Path
      d="M12 4c-3 0-6 2-6 6 0 6 3 10 6 10s6-4 6-10c0-4-3-6-6-6z"
      fill={`url(#strawberryGradient-${width}-${height})`}
    />
    <Path
      d="M8 4c0-1 1-2 2-2h4c1 0 2 1 2 2v1c0 1-1 1-2 1h-4c-1 0-2 0-2-1V4z"
      fill="#4CAF50"
    />
    <Circle cx="10" cy="9" r="0.5" fill="#FFE4E1" />
    <Circle cx="14" cy="10" r="0.5" fill="#FFE4E1" />
    <Circle cx="11" cy="12" r="0.5" fill="#FFE4E1" />
    <Circle cx="13" cy="14" r="0.5" fill="#FFE4E1" />
    <Circle cx="10" cy="15" r="0.5" fill="#FFE4E1" />
  </Svg>
);

// 相机图标
export const CameraIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#4A5568",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 3h6l2 2h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-2z"
      fill={color}
    />
    <Circle cx="12" cy="13" r="4" fill="white" />
    <Circle cx="12" cy="13" r="2.5" fill={color} />
  </Svg>
);

// 搜索图标
export const SearchIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#4A5568",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" fill="none" />
    <Path
      d="m21 21-4.35-4.35"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// 首页图标
export const HomeIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#4A5568",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      stroke={color}
      strokeWidth="2"
      fill="none"
    />
    <Path d="M9 22V12h6v10" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

// 比较图标
export const CompareIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#4A5568",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6h18M3 18h18M7 6v12M17 6v12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="7" cy="9" r="1" fill={color} />
    <Circle cx="17" cy="15" r="1" fill={color} />
  </Svg>
);

// 用户图标
export const UserIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#4A5568",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      stroke={color}
      strokeWidth="3"
      fill="none"
    />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" fill="none" />
  </Svg>
);

// 设置图标
export const SettingsIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#4A5568",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" fill="none" />
    <Path
      d="M12 1v6m0 6v6m11-7h-6m-6 0H1m17-4a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// 心形图标
export const HeartIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#E53E3E",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill={color}
    />
  </Svg>
);

// 统计图标
export const StatsIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#4A5568",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path d="M3 3v18h18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path
      d="M7 16l4-4 4 4 6-6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 6h4v4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 返回箭头图标
export const ArrowLeftIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color = "#4A5568",
}) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 19l-7-7 7-7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
