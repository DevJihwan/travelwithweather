// src/components/WeatherIcon.tsx

'use client';

import React from 'react';
import { Weather } from '@/components/TravelWeatherPlanner/types';
import { Sun, Cloud, CloudRain, Snowflake } from 'lucide-react';

type WeatherIconProps = {
  weather: Weather;
  className?: string;
};

const WeatherIcon: React.FC<WeatherIconProps> = ({ weather, className }) => {
  const renderIcon = () => {
    switch (weather) {
      case '맑음':
        return <Sun className={className} />;
      case '흐림':
        return <Cloud className={className} />;
      case '비':
        return <CloudRain className={className} />;
      case '눈':
        return <Snowflake className={className} />;
      default:
        return <Cloud className={className} />;
    }
  };

  return <div>{renderIcon()}</div>;
};

export default WeatherIcon;
