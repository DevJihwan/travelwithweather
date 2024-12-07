// src/components/TravelWeatherPlanner/types.ts

export type Weather = '맑음' | '흐림' | '비' | '눈';

export interface WeatherEntry {
  date: string; // YYYY-MM-DD
  time: string;
  weather: Weather;
}

export interface DateRange {
  start?: Date;
  end?: Date; // end를 선택적으로 변경
}

export interface TravelStop {
  destination: string;
  dateRange?: DateRange;
  weatherInfo: WeatherEntry[];
}

export interface RecommendedDestination {
  name: string;
  country: string;
  temperature: number;
  weather: Weather;
  monthlyForecast: any[]; // 더 구체적인 타입으로 변경 가능
}
