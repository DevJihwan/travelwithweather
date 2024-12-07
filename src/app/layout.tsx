// src/app/layout.tsx

import React from 'react';
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Travel Weather Planner',
  description: '여행지의 날씨를 계획해보세요.',
}

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}

export default RootLayout;
