/**
 * Laocoon Icon Library
 * All icons as React Native SVG components.
 * Resolution-independent — sharp on every screen, mobile and web.
 *
 * Usage:
 *   import { HomeIcon, JournalIcon } from './icons';
 *   <HomeIcon size={24} color="#c9a96e" />
 */

import React from 'react';
import Svg, { Path, Circle, Line, Polyline, Rect, Ellipse } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────

export const HomeIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M6 10 Q16 4 26 10 L26 26 Q16 22 6 26 Z"
      stroke={color}
      strokeWidth={1.5}
      fill="none"
      strokeLinejoin="round"
    />
    <Path d="M16 4 L16 22" stroke={color} strokeWidth={1.5} />
    <Circle cx={16} cy={17} r={2.5} fill={color} />
  </Svg>
);

export const JournalIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x={5} y={5} width={22} height={28} rx={2} stroke={color} strokeWidth={1.5} />
    <Line x1={10} y1={12} x2={22} y2={12} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Line x1={10} y1={17} x2={22} y2={17} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Line x1={10} y1={22} x2={17} y2={22} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

export const HistoryIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx={16} cy={16} r={10} stroke={color} strokeWidth={1.5} />
    <Path
      d="M16 8 L16 16 L21 21"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx={16} cy={16} r={1.5} fill={color} />
  </Svg>
);

export const ProfileIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx={16} cy={11} r={5} stroke={color} strokeWidth={1.5} />
    <Path
      d="M6 27 C6 21.477 10.477 17 16 17 C21.523 17 26 21.477 26 27"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);

export const SettingsIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx={16} cy={16} r={3} stroke={color} strokeWidth={1.5} />
    <Path
      d="M16 5 L16 8 M16 24 L16 27 M5 16 L8 16 M24 16 L27 16 M8.1 8.1 L10.2 10.2 M21.8 21.8 L23.9 23.9 M23.9 8.1 L21.8 10.2 M10.2 21.8 L8.1 23.9"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);

/** About screen icon — Serpent Coil */
export const AboutIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M16 4 C10 4 6 8 7 13 C8 17 12 18 13 21 C14 24 15 27 16 28"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M16 4 C22 4 26 8 25 13 C24 17 20 18 19 21 C18 24 17 27 16 28"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Circle cx={16} cy={16} r={1.5} fill={color} />
    <Ellipse
      cx={13} cy={4} rx={3} ry={2}
      stroke={color} strokeWidth={1.2}
      transform="rotate(-18 13 4)"
    />
    <Circle cx={12} cy={3.2} r={0.6} fill={color} />
    <Ellipse
      cx={19} cy={4} rx={3} ry={2}
      stroke={color} strokeWidth={1.2}
      transform="rotate(18 19 4)"
    />
    <Circle cx={20} cy={3.2} r={0.6} fill={color} />
    <Path
      d="M11.5 3 L10 1.5 M11.5 3 L10.5 2"
      stroke={color} strokeWidth={0.7} strokeLinecap="round"
    />
    <Path
      d="M20.5 3 L22 1.5 M20.5 3 L21.5 2"
      stroke={color} strokeWidth={0.7} strokeLinecap="round"
    />
    <Circle cx={16} cy={28} r={1.5} fill={color} opacity={0.7} />
  </Svg>
);

// ─────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────

export const NewEntryIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx={16} cy={16} r={11} stroke={color} strokeWidth={1.5} />
    <Line x1={16} y1={10} x2={16} y2={22} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Line x1={10} y1={16} x2={22} y2={16} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

export const EditIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M8 24 L8 19 L19 8 L24 13 L13 24 Z"
      stroke={color} strokeWidth={1.5} strokeLinejoin="round"
    />
    <Line x1={17} y1={10} x2={22} y2={15} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Line x1={6} y1={24} x2={26} y2={24} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

export const ExportIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Polyline
      points="8,12 16,20 24,12"
      stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
    />
    <Line x1={16} y1={6} x2={16} y2={20} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    <Line x1={8} y1={26} x2={24} y2={26} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

export const SearchIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx={13} cy={13} r={7} stroke={color} strokeWidth={1.5} />
    <Line x1={18.5} y1={18.5} x2={26} y2={26} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
  </Svg>
);

export const ArchiveIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M10 27 L10 18 C10 15.239 12.239 13 15 13 L17 13 C19.761 13 22 15.239 22 18 L22 27"
      stroke={color} strokeWidth={1.5} strokeLinecap="round"
    />
    <Rect x={6} y={24} width={20} height={3} rx={1} stroke={color} strokeWidth={1.5} />
    <Path
      d="M13 13 L13 8 C13 6.343 14.343 5 16 5 C17.657 5 19 6.343 19 8 L19 13"
      stroke={color} strokeWidth={1.5} strokeLinecap="round"
    />
  </Svg>
);

export const DeleteIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Polyline
      points="8,9 16,5 24,9 24,23 16,27 8,23 Z"
      stroke={color} strokeWidth={1.5} strokeLinejoin="round"
    />
    <Line x1={16} y1={5} x2={16} y2={27} stroke={color} strokeWidth={0.75} strokeDasharray="2,2" />
    <Line x1={8} y1={9} x2={24} y2={9} stroke={color} strokeWidth={0.75} strokeDasharray="2,2" />
  </Svg>
);

// ─────────────────────────────────────────────
// THOUGHT STATES
// ─────────────────────────────────────────────

export const ThoughtIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M16 6 C10.477 6 6 10.477 6 16 C6 18.5 6.9 20.8 8.4 22.6 L7 27 L11.6 25.8 C13.0 26.6 14.4 27 16 27 C21.523 27 26 22.523 26 17 C26 11.477 21.523 6 16 6 Z"
      stroke={color} strokeWidth={1.5} strokeLinejoin="round"
    />
    <Circle cx={12} cy={16} r={1.2} fill={color} />
    <Circle cx={16} cy={16} r={1.2} fill={color} />
    <Circle cx={20} cy={16} r={1.2} fill={color} />
  </Svg>
);

export const StarredIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M16 6 L18.5 12 L25 12.5 L20 17 L21.8 24 L16 20.5 L10.2 24 L12 17 L7 12.5 L13.5 12 Z"
      stroke={color} strokeWidth={1.5} strokeLinejoin="round"
    />
  </Svg>
);

export const MoodIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M16 8 C16 8 8 12 8 18 C8 22.418 11.582 26 16 26 C20.418 26 24 22.418 24 18 C24 12 16 8 16 8 Z"
      stroke={color} strokeWidth={1.5} strokeLinejoin="round"
    />
    <Path
      d="M16 14 C16 14 13 16 13 19 C13 20.657 14.343 22 16 22"
      stroke={color} strokeWidth={1.5} strokeLinecap="round"
    />
  </Svg>
);

export const DailyLogIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x={7} y={5} width={18} height={22} rx={2} stroke={color} strokeWidth={1.5} />
    <Line x1={7} y1={10} x2={25} y2={10} stroke={color} strokeWidth={1.5} />
    <Line x1={13} y1={5} x2={13} y2={10} stroke={color} strokeWidth={1.5} />
    <Line x1={19} y1={5} x2={19} y2={10} stroke={color} strokeWidth={1.5} />
    <Line x1={11} y1={15} x2={21} y2={15} stroke={color} strokeWidth={1} strokeLinecap="round" />
    <Line x1={11} y1={19} x2={21} y2={19} stroke={color} strokeWidth={1} strokeLinecap="round" />
    <Line x1={11} y1={23} x2={17} y2={23} stroke={color} strokeWidth={1} strokeLinecap="round" />
  </Svg>
);

export const TrendsIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M6 24 L11 17 L15 21 L20 13 L26 24 Z"
      stroke={color} strokeWidth={1.5} strokeLinejoin="round"
    />
    <Line x1={6} y1={24} x2={26} y2={24} stroke={color} strokeWidth={1} strokeLinecap="round" />
  </Svg>
);

export const FocusIcon = ({ size = 24, color = '#c9a96e' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path
      d="M16 7 L16 10 M16 22 L16 25 M25 16 L22 16 M10 16 L7 16"
      stroke={color} strokeWidth={1.5} strokeLinecap="round"
    />
    <Circle cx={16} cy={16} r={6} stroke={color} strokeWidth={1.5} />
    <Circle cx={16} cy={16} r={2} fill={color} />
  </Svg>
);
