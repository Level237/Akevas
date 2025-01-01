import React from 'react';

interface TopLoaderProps {
  progress: number;
}

const TopLoader: React.FC<TopLoaderProps> = ({ progress }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div
        className="h-full bg-blue-600 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default TopLoader;
