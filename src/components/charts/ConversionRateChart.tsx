import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ConversionRateData } from '../../types';
import { CHART_COLORS } from '../../constants/design';

interface ConversionRateChartProps {
  data: ConversionRateData[];
}

export const ConversionRateChart: React.FC<ConversionRateChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis 
          dataKey="source" 
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={{ stroke: '#e5e7eb' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
          formatter={(value: number) => [`${value}%`, 'Conversion Rate']}
        />
        <Area 
          type="monotone" 
          dataKey="rate" 
          stroke={CHART_COLORS.secondary} 
          fill={CHART_COLORS.secondary}
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};