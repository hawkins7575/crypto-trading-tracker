import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import SimpleApp from './SimpleApp';
import ErrorBoundary from './ErrorBoundary';
import { ConvexProvider, ConvexReactClient } from "convex/react";

// 에러 캐칭 강화
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Convex 클라이언트 초기화 - 안전한 버전
const convexUrl = process.env.REACT_APP_CONVEX_URL || "https://elegant-clam-570.convex.cloud";

let convex = null;
try {
  convex = new ConvexReactClient(convexUrl);
} catch (error) {
  // Convex 클라이언트 생성 실패 - 폴백 모드로 동작
}

const root = ReactDOM.createRoot(document.getElementById('root'));

// Convex Provider와 함께 렌더링
if (convex) {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <ConvexProvider client={convex}>
          <SimpleApp />
        </ConvexProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <SimpleApp />
      </ErrorBoundary>
    </React.StrictMode>
  );
}