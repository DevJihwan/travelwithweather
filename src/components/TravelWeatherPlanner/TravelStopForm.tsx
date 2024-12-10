// src/components/TravelWeatherPlanner/TravelStopForm.tsx

'use client'; // 클라이언트 컴포넌트로 설정

import React from 'react';
import { DateRange, TravelStop } from './types';
import CalendarPicker from '@/components/ui/CalendarPicker';

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
    <div className="space-y-4">
      <input
        type="text"
        placeholder="여행지 이름"
        value={stop.destination}
        onChange={(e) => handleInputChange(index, 'destination', e.target.value)}
        className="w-full px-4 py-2 border border-terminal-muted rounded-md bg-terminal-bg text-terminal-text focus:outline-none focus:ring-2 focus:ring-terminal-accent font-mono transition-colors duration-200"
      />
      <CalendarPicker
        selectedRange={stop.dateRange}
        onSelectRange={handleDateChange}
      />
    </div>
  );
};

export default TravelStopForm;
