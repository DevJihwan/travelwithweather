// src/components/TravelWeatherPlanner/TravelStopForm.tsx

'use client'; // 추가된 부분

import React from 'react';
import { DateRange, TravelStop } from './types';
import CalendarPicker from '@/components/ui/CalendarPicker'; // 사용자 정의 CalendarPicker 컴포넌트 경로

interface TravelStopFormProps {
  stop: TravelStop;
  index: number;
  handleInputChange: (
    index: number,
    field: 'destination' | 'dateRange',
    value: string | DateRange | undefined
  ) => void;
}

const TravelStopForm: React.FC<TravelStopFormProps> = ({ stop, index, handleInputChange }) => {
  const handleDateChange = (range: DateRange | undefined) => {
    handleInputChange(index, 'dateRange', range);
  };

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder="여행지 이름"
        value={stop.destination}
        onChange={(e) => handleInputChange(index, 'destination', e.target.value)}
        className="w-full p-2 border rounded"
      />
      <CalendarPicker
        selectedRange={stop.dateRange}
        onSelectRange={handleDateChange}
      />
    </div>
  );
};

export default TravelStopForm;
