import React from 'react';
import { Upload } from 'lucide-react';
import useDragAndDrop from '../hooks/useDragAndDrop';

const DragDropUpload = ({ onFileDrop, className = "" }) => {
  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useDragAndDrop(onFileDrop);

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
        isDragging 
          ? 'border-blue-500 bg-blue-500/10' 
          : 'border-slate-600 hover:border-slate-500'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="mx-auto mb-3 text-slate-400" size={32} />
      <p className="text-slate-300 font-medium mb-1">
        CSV 파일을 여기에 드래그하여 가져오기
      </p>
      <p className="text-slate-500 text-sm">
        또는 클릭하여 파일 선택
      </p>
    </div>
  );
};

export default DragDropUpload;
