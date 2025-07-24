
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Convex 클라이언트 초기화
const convexUrl = process.env.REACT_APP_CONVEX_URL || "https://greedy-bass-975.convex.cloud";
console.log("Convex URL:", convexUrl); // 디버깅용

let convex;
try {
  convex = new ConvexReactClient(convexUrl);
  console.log("Convex client created successfully");
} catch (error) {
  console.error("Failed to create Convex client:", error);
}

const root = ReactDOM.createRoot(document.getElementById('root'));

if (convex) {
  root.render(
    <React.StrictMode>
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    </React.StrictMode>
  );
} else {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
