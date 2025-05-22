
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// root 요소가 존재하는지 확인
const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(<App />);
} else {
  console.error("루트 요소를 찾을 수 없습니다. ID가 'root'인 요소가 HTML에 있는지 확인하세요.");
}
