
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import SimpleApp from './SimpleApp';
import App from './App';
import { ConvexProvider, ConvexReactClient } from "convex/react";
// import { ConvexAuthProvider } from "@convex-dev/auth/react";

// Convex 클라이언트 초기화
const convexUrl = process.env.REACT_APP_CONVEX_URL || "https://greedy-bass-975.convex.cloud";
console.log("Convex URL:", convexUrl); // 디버깅용
const convex = new ConvexReactClient(convexUrl);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>
);
