// app/api/getWeather/route.ts

import { NextResponse } from 'next/server';
import { geocodeCity, GeocodingResult } from '@/lib/geocoding';

interface WeatherData {
  date: string; // YYYY-MM-DD
  time: string;
  weather: string;
}

interface ApiResponse {
  success: boolean;
  data?: WeatherData[];
  error?: string;
}

const fetchForecastData = async (lat: number, lon: number, startDate: Date, endDate: Date): Promise<WeatherData[]> => {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    throw new Error('OPENWEATHERMAP_API_KEY is not defined');
  }

  // Forecast API 2.5 사용
  const units = 'metric'; // 섭씨 온도

  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.statusText}`);
  }

  const data = await response.json();

  // 데이터 구조 점검
  if (!data.list) {
    throw new Error('Weather data is missing "list" property.');
  }

  const weatherData: WeatherData[] = [];

  // 각 3시간 간격 예보 처리
  data.list.forEach((entry: any) => {
    const date = new Date(entry.dt * 1000);
    // 여행 기간 내의 날짜인지 확인
    if (date >= startDate && date <= endDate) {
      // 예보 시간 포맷: 오전 9시, 오후 1시, 오후 6시 등으로 매핑
      const hour = date.getHours();
      let timeLabel = '';

      if (hour === 9) {
        timeLabel = '오전 9시';
      } else if (hour === 13) {
        timeLabel = '오후 1시';
      } else if (hour === 18) {
        timeLabel = '오후 6시';
      } else {
        // 원하는 시간대가 아니면 건너뛰기
        return;
      }

      weatherData.push({
        date: formatDate(date),
        time: timeLabel,
        weather: mapWeatherDescription(entry.weather[0].main)
      });
    }
  });

  return weatherData;
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const mapWeatherDescription = (main: string): string => {
  // OpenWeatherMap의 weather.main을 우리의 Weather 타입으로 매핑
  switch (main) {
    case 'Clear':
      return '맑음';
    case 'Clouds':
      return '흐림';
    case 'Rain':
      return '비';
    case 'Snow':
      return '눈';
    default:
      return '흐림'; // 기본값
  }
};

export async function POST(request: Request) {
  try {
    const { city, startDate, endDate } = await request.json();

    console.log('Received city:', city); // 디버깅 로그 추가

    if (!city || !startDate || !endDate) {
      return NextResponse.json({ success: false, error: 'Missing required fields: city, startDate, endDate' }, { status: 400 });
    }

    const geocodingResult: GeocodingResult | null = await geocodeCity(city);

    console.log('Geocoding result:', geocodingResult); // 디버깅 로그 추가

    if (!geocodingResult) {
      return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
    }

    const weatherData = await fetchForecastData(
      geocodingResult.lat,
      geocodingResult.lon,
      new Date(startDate),
      new Date(endDate)
    );

    return NextResponse.json({ success: true, data: weatherData }, { status: 200 });
  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
