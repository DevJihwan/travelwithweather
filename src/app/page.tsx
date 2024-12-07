// src/app/page.tsx

'use client';

import React from 'react';
import TravelWeatherPlanner from '@/components/TravelWeatherPlanner/TravelWeatherPlanner';

const Home: React.FC = () => {
  return (
    <div>
      <TravelWeatherPlanner />
    </div>
  );
};

export default Home;
