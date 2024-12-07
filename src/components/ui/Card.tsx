// src/components/ui/Card.tsx

'use client';

import React, { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// 기본 Card 컴포넌트 인터페이스
interface CardProps {
  children: ReactNode;
  className?: string;
}

// Card 서브 컴포넌트 인터페이스
interface CardComponent extends FC<CardProps> {
  Header: FC<CardHeaderProps>;
  Title: FC<CardTitleProps>;
  Description: FC<CardDescriptionProps>;
  Content: FC<CardContentProps>;
  Footer: FC<CardFooterProps>;
}

// 서브 컴포넌트별 Props 정의
interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

// 기본 Card 컴포넌트 정의
const Card: CardComponent = ({ children, className }) => {
  return <div className={cn('rounded-lg shadow-md bg-white', className)}>{children}</div>;
};

// 서브 컴포넌트 정의
const CardHeader: FC<CardHeaderProps> = ({ children, className }) => {
  return <div className={cn('px-6 py-4 border-b', className)}>{children}</div>;
};

const CardTitle: FC<CardTitleProps> = ({ children, className }) => {
  return <h3 className={cn('text-lg font-bold', className)}>{children}</h3>;
};

const CardDescription: FC<CardDescriptionProps> = ({ children, className }) => {
  return <p className={cn('text-sm text-gray-500', className)}>{children}</p>;
};

const CardContent: FC<CardContentProps> = ({ children, className }) => {
  return <div className={cn('p-6', className)}>{children}</div>;
};

const CardFooter: FC<CardFooterProps> = ({ children, className }) => {
  return <div className={cn('px-6 py-4 border-t', className)}>{children}</div>;
};

// 서브 컴포넌트를 메인 Card 컴포넌트에 첨부
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
