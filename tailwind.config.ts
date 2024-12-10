// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Homebrew Terminal 테마 색상
        'terminal-bg': '#282C34', // 배경색
        'terminal-text': '#ABB2BF', // 기본 텍스트 색상
        'terminal-accent': '#61AFEF', // 청록색 액센트
        'terminal-highlight': '#E06C75', // 주황색 하이라이트
        'terminal-muted': '#5C6370', // 마무드 색상
      },
      fontFamily: {
        // 터미널 느낌의 고정폭 폰트 설정
        'mono': ['Source Code Pro', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};
