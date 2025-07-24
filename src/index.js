
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

console.log("Starting application...");

const root = ReactDOM.createRoot(document.getElementById('root'));

// 임시로 Convex 완전히 제거하고 기본 React만 테스트
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
