// lib/geocoding.ts

export interface GeocodingResult {
    lat: number;
    lon: number;
    // 추가 필드 필요 시 추가
  }
  
  export const geocodeCity = async (city: string): Promise<GeocodingResult | null> => {
    try {
      // OpenWeatherMap Geocoding API 사용
      const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  
      if (!apiKey) {
        throw new Error('OPENWEATHERMAP_API_KEY is not defined');
      }
  
      const limit = 1; // 결과 제한
      const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=${limit}&appid=${apiKey}`;
  
      const response = await fetch(geocodingUrl);
  
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (data.length === 0) {
        return null;
      }
  
      const result = data[0];
      return {
        lat: result.lat,
        lon: result.lon,
        // 필요 시 추가 필드 설정
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };
  