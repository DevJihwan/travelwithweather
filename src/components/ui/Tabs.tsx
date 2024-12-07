// src/components/ui/Tabs.tsx

'use client';

import React, { ReactNode, FC, ReactElement, JSXElementConstructor } from 'react';
import { cn } from '@/lib/utils';

type TabsProps = {
  children: ReactNode;
  defaultValue?: string;
  className?: string;
};

type TabsComponent = FC<TabsProps> & {
  List: FC<TabsListProps>;
  Trigger: FC<TabsTriggerProps>;
  Content: FC<TabsContentProps>;
};

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: ReactNode;
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

const TabsContext = React.createContext<any>(null);

const Tabs: TabsComponent = ({ children, defaultValue, className }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue || '');

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList: FC<TabsListProps> = ({ children, className }) => {
  return (
    <div className={cn('flex space-x-2', className)}>
      {children}
    </div>
  );
};

const TabsTrigger: FC<TabsTriggerProps> = ({ value, className, children }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        'px-4 py-2 rounded-md focus:outline-none',
        activeTab === value ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600',
        className
      )}
    >
      {children}
    </button>
  );
};

const TabsContent: FC<TabsContentProps> = ({ value, children, className }) => {
  const { activeTab } = React.useContext(TabsContext);

  if (activeTab !== value) return null;

  return (
    <div className={cn('mt-4', className)}>
      {children}
    </div>
  );
};

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export { Tabs, TabsContent, TabsList, TabsTrigger };
