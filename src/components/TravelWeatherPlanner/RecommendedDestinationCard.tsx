// src/components/TravelWeatherPlanner/RecommendedDestinationCard.tsx

'use client';

import React from 'react';
import Card from '@/components/ui/Card'; // 기본 가져오기 방식
import Button from '@/components/ui/Button'; // 기본 가져오기 방식
import Dialog from '@/components/ui/Dialog'; // 기본 가져오기 방식
import { format } from 'date-fns';
import WeatherIcon from './WeatherIcon';
import { RecommendedDestination, Weather } from './types'; // Weather 타입 추가

type RecommendedDestinationCardProps = {
  destination: RecommendedDestination;
};

const RecommendedDestinationCard: React.FC<RecommendedDestinationCardProps> = ({ destination }) => {
  return (
    <Card className="overflow-hidden bg-white shadow-lg transition-all hover:shadow-xl">
      <Card.Header className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
        <Card.Title className="text-2xl">
          {destination.name}, {destination.country}
        </Card.Title>
      </Card.Header>
      <Card.Content className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <WeatherIcon weather={destination.weather} className="h-12 w-12 text-blue-500" />
            <div>
              <p className="text-3xl font-bold text-gray-800">{destination.temperature}°C</p>
              <p className="text-lg text-gray-600">{destination.weather}</p>
            </div>
          </div>
          <Dialog>
            <Dialog.Trigger asChild>
              <Button variant="outline" className="bg-blue-100 text-blue-600 hover:bg-blue-200">
                자세히 보기
              </Button>
            </Dialog.Trigger>
            <Dialog.Content className="sm:max-w-[425px]">
              <Dialog.Header>
                <Dialog.Title className="text-2xl font-bold text-gray-800">
                  {destination.name} 월간 날씨
                </Dialog.Title>
              </Dialog.Header>
              <div className="grid gap-4 py-4">
                {destination.monthlyForecast.map((forecast, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-700">
                      {format(forecast.date, 'MM/dd')}
                    </span>
                    <div className="flex items-center space-x-2">
                      <WeatherIcon weather={forecast.weather} className="h-6 w-6 text-blue-500" />
                      <span className="text-gray-800">{forecast.temperature}°C</span>
                    </div>
                  </div>
                ))}
              </div>
            </Dialog.Content>
          </Dialog>
        </div>
      </Card.Content>
    </Card>
  );
};

export default RecommendedDestinationCard;
