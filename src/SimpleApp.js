import React from 'react';

export default function SimpleApp() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Crypto Trading Tracker</h1>
        <p className="text-xl text-gray-300 mb-8">앱이 정상적으로 로드되었습니다!</p>
        <div className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block">
          테스트 성공 ✅
        </div>
      </div>
    </div>
  );
}