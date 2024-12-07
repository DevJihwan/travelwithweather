// src/components/ui/Button.tsx

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
  icon?: React.ReactNode; // 올바른 타입 사용
};

const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'default',
  children,
  icon,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        variant === 'default' && 'bg-indigo-600 text-white hover:bg-indigo-700',
        variant === 'outline' && 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50',
        variant === 'ghost' && 'text-indigo-600 hover:bg-indigo-50',
        className
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>} {/* 올바른 렌더링 */}
      {children}
    </button>
  );
};

export default Button;
