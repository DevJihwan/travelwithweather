// src/app/layout.tsx

import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Travel with Weather',
  description: 'Plan your travel with weather information',
  links: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;600&display=swap',
    },
  ],
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
