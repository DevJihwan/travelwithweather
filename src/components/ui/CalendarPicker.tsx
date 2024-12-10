// src/components/ui/CalendarPicker.tsx

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Calendar from './Calendar';
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
      onSelectRange({ start: date });
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
          'w-full px-4 py-2 border border-terminal-muted rounded-md flex items-center justify-between bg-terminal-bg hover:bg-terminal-muted focus:outline-none focus:ring-2 focus:ring-terminal-accent text-terminal-text font-mono transition-colors duration-200'
        )}
      >
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5 text-terminal-accent" />
          <span className="text-terminal-text">
            {displayText()}
          </span>
        </div>
        <svg
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'} text-terminal-accent`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {/* {isOpen && (
        <div ref={calendarRef} className="absolute z-50 mt-2 w-full max-w-md bg-terminal-bg border border-terminal-muted rounded-md shadow-lg max-h-96 overflow-y-auto transition-all duration-300 ease-in-out">
          <Calendar selectedRange={{ start: selectedRange?.start, end: selectedRange?.end }} onSelect={handleSelectDate} />
        </div>
      )} */}
      {isOpen && (
        <div ref={calendarRef} className="absolute z-50 mt-2 w-full max-w-md bg-terminal-bg border border-terminal-muted rounded-md shadow-lg max-h-96 overflow-y-auto transition-transform duration-300 ease-in-out">
        <Calendar selectedRange={{ start: selectedRange?.start, end: selectedRange?.end }} onSelect={handleSelectDate} />
      </div>
      )}

    </div>
  );
};

export default CalendarPicker;
