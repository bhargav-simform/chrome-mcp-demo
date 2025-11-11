import React from 'react';
import type { QuickStats } from '../../types';
import { COLORS } from '../../constants/design';

interface QuickStatsCardProps {
  stats: QuickStats;
}

export const QuickStatsCard: React.FC<QuickStatsCardProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Quick Stats</h3>
          <p className="text-gray-600 text-sm mt-1">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-8">
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: COLORS.primary[600] }}>
              {stats.uptime}%
            </p>
            <p className="text-sm text-gray-500">Uptime</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: COLORS.success[600] }}>
              {stats.loadTime}
            </p>
            <p className="text-sm text-gray-500">Load Time</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold" style={{ color: COLORS.error[600] }}>
              {stats.errors}
            </p>
            <p className="text-sm text-gray-500">Errors</p>
          </div>
        </div>
      </div>
    </div>
  );
};