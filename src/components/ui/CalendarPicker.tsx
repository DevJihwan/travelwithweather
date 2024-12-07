// src/components/ui/CalendarPicker.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Calendar from './Calendar'; // 사용자 정의 Calendar 컴포넌트 경로
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from '@/components/TravelWeatherPlanner/types';

type CalendarPickerProps = {
  selectedRange?: DateRange;
  onSelectRange: (range: DateRange | undefined) => void;
};

const CalendarPicker: React.FC<CalendarPickerProps> = ({ selectedRange, onSelectRange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelectDate = (date: Date) => {
    if (!selectedRange?.start || (selectedRange?.start && selectedRange?.end)) {
      // 새로운 시작일 선택
      onSelectRange({ start: date }); // end는 선택적으로 설정
    } else if (selectedRange?.start && !selectedRange?.end) {
      // 종료일 선택
      if (date >= selectedRange.start) {
        onSelectRange({ start: selectedRange.start, end: date });
      } else {
        // 종료일이 시작일보다 이전일 경우, 시작일과 종료일을 교환
        onSelectRange({ start: date, end: selectedRange.start });
      }
      setIsOpen(false);
    }
  };

  // 외부 클릭 감지하여 달력 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const displayText = () => {
    if (selectedRange?.start && selectedRange?.end) {
      return `${selectedRange.start.toLocaleDateString()} - ${selectedRange.end.toLocaleDateString()}`;
    }
    if (selectedRange?.start) {
      return `${selectedRange.start.toLocaleDateString()} - ?`;
    }
    return '날짜를 선택하세요';
  };

  return (
    <div className="relative inline-block w-full">
      <button
        type="button" // 필수: 버튼 타입을 명시적으로 "button"으로 설정
        ref={toggleRef}
        onClick={handleToggle}
        className={cn(
          'w-full px-4 py-2 border rounded-md flex items-center justify-between bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500'
        )}
      >
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          <span className="text-gray-700">
            {displayText()}
          </span>
        </div>
        <svg
          className={`h-5 w-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div ref={calendarRef} className="absolute z-50 mt-2 w-full max-w-xs md:max-w-md bg-white border rounded-md shadow-lg">
            <Calendar selectedRange={{ start: selectedRange?.start, end: selectedRange?.end }} onSelect={handleSelectDate} />
        </div>
      )}
    </div>
  );
};

export default CalendarPicker;
