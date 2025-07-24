
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

console.log("Starting application...");

const root = ReactDOM.createRoot(document.getElementById('root'));

// 임시로 인증 시스템 없이 실행 (GitHub OAuth 설정 완료 후 활성화)
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
