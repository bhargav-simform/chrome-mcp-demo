import React from 'react';
import type { MetricCardProps } from '../../types';

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  valueColor = 'text-gray-900',
  iconColor = 'text-gray-500',
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${valueColor}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={`flex-shrink-0 ml-4 ${iconColor}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};