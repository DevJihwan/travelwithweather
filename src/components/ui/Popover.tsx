// src/components/ui/Popover.tsx

'use client';

import React, { ReactNode, FC, ReactElement, JSXElementConstructor } from 'react';
import { cn } from '@/lib/utils';

type PopoverProps = {
  children: ReactNode;
};

type PopoverComponent = FC<PopoverProps> & {
  Trigger: FC<PopoverTriggerProps>;
  Content: FC<PopoverContentProps>;
};

interface PopoverTriggerProps {
  asChild?: boolean;
  children: ReactElement<any, string | JSXElementConstructor<any>>;
}

interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

const Popover: PopoverComponent = ({ children }) => {
  // Popover 로직 (상태 관리 등)
  return (
    <div className="relative inline-block text-left">
      {children}
    </div>
  );
};

const PopoverTrigger: FC<PopoverTriggerProps> = ({ asChild = false, children, ...props }) => {
  // Trigger 로직 (예: 상태 변경 등)
  return asChild
    ? React.cloneElement(children, { ...props })
    : <button {...props}>{children}</button>;
};

const PopoverContent: FC<PopoverContentProps> = ({ children, className, ...props }) => {
  // Content 로직
  return (
    <div className={cn('absolute z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5', className)} {...props}>
      {children}
    </div>
  );
};

// Assign sub-components
Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;

export default Popover;
