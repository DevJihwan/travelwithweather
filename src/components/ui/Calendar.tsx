// src/components/ui/Calendar.tsx

'use client';

import React from 'react';
import { format, isSameDay, isWithinInterval, startOfMonth, getDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from '@/components/TravelWeatherPlanner/types';

type CalendarProps = {
  selectedRange?: DateRange; // 선택적 속성
  onSelect: (date: Date) => void;
};

const Calendar: React.FC<CalendarProps> = ({ selectedRange, onSelect }) => {
  const today = new Date();
  const startMonth = startOfMonth(today);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const startWeekDay = getDay(startMonth); // 0 (일요일)부터 6 (토요일)

  const totalCells = 42; // 6주 x 7일
  const days: Date[] = [];

  // 빈 셀 채우기 (첫 주의 빈 셀)
  for (let i = 0; i < startWeekDay; i++) {
    days.push(new Date(0)); // 빈 날짜 표시를 위해 0으로 설정
  }

  // 현재 월의 날짜 채우기
  for (let i = 1; i <= lastDay; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), i);
    days.push(date);
  }

  // 남은 셀 채우기 (빈 셀)
  const remainingCells = totalCells - days.length;
  for (let i = 0; i < remainingCells; i++) {
    days.push(new Date(0)); // 빈 날짜 표시를 위해 0으로 설정
  }

  const isInRange = (date: Date) => {
    if (selectedRange && selectedRange.start && selectedRange.end) {
      return isWithinInterval(date, { start: selectedRange.start, end: selectedRange.end });
    }
    return false;
  };

  const isStart = (date: Date) => selectedRange?.start ? isSameDay(date, selectedRange.start) : false;
  const isEnd = (date: Date) => selectedRange?.end ? isSameDay(date, selectedRange.end) : false;

  return (
    <div className="grid grid-cols-7 gap-1 p-4 bg-white shadow rounded-md">
      {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
        <div key={day} className="text-center font-semibold text-gray-700">
          {day}
        </div>
      ))}
      {days.map((date, index) => {
        if (date.getTime() === 0) {
          // 빈 셀 표시
          return (
            <div key={index} className="p-2"></div>
          );
        }

        return (
          <button
            type="button" // 필수: 버튼 타입을 명시적으로 "button"으로 설정
            key={date.toISOString()}
            onClick={() => onSelect(date)}
            className={cn(
              'p-2 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500',
              isStart(date) ? 'bg-indigo-600 text-white' :
              isEnd(date) ? 'bg-indigo-600 text-white' :
              isInRange(date) ? 'bg-indigo-300 text-white' :
              'text-gray-700',
              isStart(date) ? 'rounded-l-md' : '',
              isEnd(date) ? 'rounded-r-md' : ''
            )}
          >
            {format(date, 'd')}
          </button>
        );
      })}
    </div>
  );
};

export default Calendar;
