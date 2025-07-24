import React from 'react';

const FloatingActionButton = ({ icon, onClick, tooltip, className = "bg-blue-600 hover:bg-blue-700" }) => (
  <button
    onClick={onClick}
    title={tooltip}
    className={`${className} text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95`}
  >
    {icon}
  </button>
);

export default FloatingActionButton;
