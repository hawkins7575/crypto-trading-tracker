
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import { ConvexProvider, ConvexReactClient } from "convex/react";

console.log("Starting application with Convex but without authentication...");

// Convex 클라이언트 초기화 - 인증 없음
const convexUrl = process.env.REACT_APP_CONVEX_URL || "https://elegant-clam-570.convex.cloud";
console.log("Convex URL:", convexUrl);

let convex;
try {
  convex = new ConvexReactClient(convexUrl);
  console.log("Convex client created successfully");
} catch (error) {
  console.error("Failed to create Convex client:", error);
}

const root = ReactDOM.createRoot(document.getElementById('root'));

// Convex Provider만 추가 (Auth Provider 제외)
if (convex) {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <ConvexProvider client={convex}>
          <App />
        </ConvexProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
}
