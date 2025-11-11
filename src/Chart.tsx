import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Intentionally poorly named component with inconsistent props
interface ChartThing {
  info: any[];
  w?: number;
  h?: number;
  dataKey1: string;
}

export const SimpleChart: React.FC<ChartThing> = ({ info, w = 300, h = 200, dataKey1 }) => {
  return (
    <BarChart
      width={w}
      height={h}
      data={info}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey={dataKey1} fill="#8884d8" />
    </BarChart>
  );
};