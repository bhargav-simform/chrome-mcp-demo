import React from 'react';
import { createRoot } from 'react-dom/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, DollarSign, ShoppingCart, Calendar } from 'lucide-react';
import { salesStuff, userStats, weeklyData, conversionRates } from './data';
import { SimpleChart } from './Chart';

const Dashboard: React.FC = () => {
  // Intentionally inconsistent variable naming and inline styles
  const randomMetrics = {
    totalUsers: 12543,
    rev: 52341,
    orders: 1234,
    conv: 3.4
  };

  // More random data for the extra chart
  const extraData = [
    { name: 'Product A', sales: 400 },
    { name: 'Product B', sales: 300 },
    { name: 'Product C', sales: 500 },
    { name: 'Product D', sales: 200 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header - intentionally using inline styles mixed with Tailwind */}
      <div className="mb-6" style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '1rem' }}>
        <h1 className="text-3xl font-bold text-gray-800" style={{ color: '#1f2937' }}>
          Analytics Dashboard (Unpolished)
        </h1>
        <p className="text-gray-600 mt-2">Some random dashboard with messy code</p>
      </div>

      {/* Metrics Cards - inconsistent sizing */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md" style={{ height: '120px' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-blue-600">{randomMetrics.totalUsers.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md" style={{ height: '140px', backgroundColor: '#fefefe' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-3xl font-bold text-green-600">${randomMetrics.rev.toLocaleString()}</p>
            </div>
            <DollarSign className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md" style={{ height: '100px' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Orders</p>
              <p className="text-xl font-bold text-purple-600">{randomMetrics.orders}</p>
            </div>
            <ShoppingCart className="h-6 w-6 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md" style={{ height: '130px', padding: '1.5rem' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Conversion</p>
              <p className="text-2xl font-bold text-orange-600">{randomMetrics.conv}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts Section - intentionally inconsistent layouts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart - larger */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-2" style={{ minHeight: '400px' }}>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Revenue vs Expenses (Monthly)</h3>
          <LineChart
            width={800}
            height={300}
            data={salesStuff}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} />
            <Line type="monotone" dataKey="expenses" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* User Stats Pie Chart - smaller */}
        <div className="bg-white p-4 rounded-lg shadow-md" style={{ height: '320px' }}>
          <h3 className="text-md font-semibold mb-2 text-gray-700">Device Usage</h3>
          <PieChart width={250} height={250}>
            <Pie
              data={userStats}
              cx={120}
              cy={120}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {userStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Weekly Visits Bar Chart - medium size */}
        <div className="bg-white p-5 rounded-lg shadow-md" style={{ height: '350px', backgroundColor: '#fdfdfd' }}>
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Weekly Visits</h3>
          <BarChart
            width={280}
            height={280}
            data={weeklyData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="visits" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Conversion Rates Area Chart - different size */}
        <div className="bg-white p-6 rounded-lg shadow-md" style={{ height: '300px' }}>
          <h3 className="text-sm font-semibold mb-4 text-gray-700" style={{ fontSize: '16px' }}>
            Conversion Rates by Source
          </h3>
          <AreaChart
            width={270}
            height={220}
            data={conversionRates}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="rate" stroke="#82ca9d" fill="#82ca9d" />
          </AreaChart>
        </div>

        {/* Extra Chart using our component - intentionally different size */}
        <div className="bg-white p-3 rounded-lg shadow-md" style={{ height: '280px', padding: '12px' }}>
          <h3 className="text-base font-semibold mb-3 text-gray-700">Product Sales</h3>
          <SimpleChart 
            info={extraData} 
            w={250} 
            h={200} 
            dataKey1="sales" 
          />
        </div>
      </div>

      {/* Random bottom section with mixed styling */}
      <div className="bg-white p-6 rounded-lg shadow-md" style={{ marginTop: '2rem', border: '1px solid #e5e7eb' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Quick Stats</h3>
            <p className="text-gray-600 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex space-x-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">85%</p>
              <p className="text-sm text-gray-500">Uptime</p>
            </div>
            <div className="text-center" style={{ marginLeft: '2rem' }}>
              <p className="text-2xl font-bold text-green-600">12.3s</p>
              <p className="text-sm text-gray-500">Load Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600" style={{ color: '#dc2626' }}>3</p>
              <p className="text-sm text-gray-500">Errors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Extra footer with more inconsistencies */}
      <div style={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
        <p className="text-sm">Dashboard built with React + Vite + TypeScript + Recharts</p>
        <p style={{ fontSize: '12px', marginTop: '5px' }}>Note: This is intentionally unpolished code</p>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<Dashboard />);
