
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

console.log("Starting application without authentication...");

const root = ReactDOM.createRoot(document.getElementById('root'));

// 인증 시스템 없이 기본 앱만 실행
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
