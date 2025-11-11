import React from 'react';
import { TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';
import {
  MetricCard,
  ChartContainer,
  QuickStatsCard,
  RevenueChart,
  DeviceUsageChart,
  WeeklyVisitsChart,
  ConversionRateChart,
  ProductSalesChart,
} from '../components';
import {
  monthlySalesData,
  deviceUsageData,
  weeklyVisitsData,
  conversionRatesBySource,
  productSalesData,
  keyMetrics,
  quickStatsData,
} from '../data/dashboardData';
import { COLORS } from '../constants/design';

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-sm lg:text-base">
            Comprehensive overview of your business metrics and performance
          </p>
        </div>
      </header>

      {/* Key Metrics Cards */}
      <section className="mb-8" aria-label="Key Metrics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <MetricCard
            title="Total Users"
            value={keyMetrics.totalUsers}
            icon={<Users className="h-8 w-8" />}
            valueColor="text-blue-600"
            iconColor="text-blue-500"
          />
          <MetricCard
            title="Revenue"
            value={`$${keyMetrics.revenue.toLocaleString()}`}
            icon={<DollarSign className="h-8 w-8" />}
            valueColor="text-green-600"
            iconColor="text-green-500"
          />
          <MetricCard
            title="Orders"
            value={keyMetrics.orders}
            icon={<ShoppingCart className="h-8 w-8" />}
            valueColor="text-purple-600"
            iconColor="text-purple-500"
          />
          <MetricCard
            title="Conversion Rate"
            value={`${keyMetrics.conversionRate}%`}
            icon={<TrendingUp className="h-8 w-8" />}
            valueColor="text-orange-600"
            iconColor="text-orange-500"
          />
        </div>
      </section>

      {/* Revenue Chart - Full Width */}
      <section className="mb-8" aria-label="Revenue vs Expenses">
        <ChartContainer title="Revenue vs Expenses (Monthly)" className="h-96">
          <RevenueChart data={monthlySalesData} />
        </ChartContainer>
      </section>

      {/* Charts Grid */}
      <section className="mb-8" aria-label="Detailed Analytics">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          
          {/* Device Usage Pie Chart */}
          <ChartContainer title="Device Usage" className="h-80 md:h-96">
            <DeviceUsageChart data={deviceUsageData} />
          </ChartContainer>

          {/* Weekly Visits Bar Chart */}
          <ChartContainer title="Weekly Visits" className="h-80 md:h-96">
            <WeeklyVisitsChart data={weeklyVisitsData} />
          </ChartContainer>

          {/* Conversion Rates Area Chart */}
          <ChartContainer title="Conversion Rates by Source" className="h-80 md:h-96">
            <ConversionRateChart data={conversionRatesBySource} />
          </ChartContainer>

          {/* Product Sales Bar Chart */}
          <ChartContainer title="Product Sales" className="h-80 md:h-96">
            <ProductSalesChart data={productSalesData} />
          </ChartContainer>

        </div>
      </section>

      {/* Quick Stats */}
      <section className="mb-8" aria-label="Quick Stats">
        <QuickStatsCard stats={quickStatsData} />
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
        <p>Dashboard built with React + Vite + TypeScript + Recharts</p>
        <p className="text-xs mt-1">Refactored with modern best practices</p>
      </footer>
    </div>
  );
};