import React from 'react';

export default function App() {
  console.log("App component is rendering...");
  
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">App Loading Test</h1>
        <p className="text-xl text-gray-300 mb-4">앱이 렌더링되고 있습니다</p>
        <div className="bg-green-600 text-white px-6 py-3 rounded-lg inline-block">
          ✅ React 앱이 정상 작동 중
        </div>
      </div>
    </div>
  );
}