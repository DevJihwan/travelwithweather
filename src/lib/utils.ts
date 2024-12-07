// src/lib/utils.ts

import { Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';

// Weather 타입 정의
export type Weather = '맑음' | '흐림' | '비' | '눈';

// 날씨 아이콘 매핑
export const weatherIcons: Record<Weather, React.ComponentType<{ className?: string }>> = {
  '맑음': Sun,
  '흐림': Cloud,
  '비': CloudRain,
  '눈': Snowflake
};

// 날씨 점수 매핑
export const weatherScores: Record<Weather, number> = {
  '맑음': 100,
  '흐림': 70,
  '비': 50,
  '눈': 30
};

// 클래스 네임을 조건에 따라 결합하는 유틸리티 함수
export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// 타입 정의 (필요 시)
export type WeatherIconType = React.ComponentType<{ className?: string }>;
