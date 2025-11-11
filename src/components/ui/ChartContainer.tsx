import React from 'react';
import type { ChartContainerProps } from '../../types';

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="w-full h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};