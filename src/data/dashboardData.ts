import type {
  SalesData,
  DeviceUsageData,
  WeeklyVisitsData,
  ConversionRateData,
  ProductSalesData,
  MetricData,
  QuickStats
} from '../types';
import { CHART_COLORS } from '../constants/design';

// Monthly sales and expense data
export const monthlySalesData: SalesData[] = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 3000, expenses: 1398 },
  { month: 'Mar', revenue: 2000, expenses: 9800 },
  { month: 'Apr', revenue: 2780, expenses: 3908 },
  { month: 'May', revenue: 1890, expenses: 4800 },
  { month: 'Jun', revenue: 2390, expenses: 3800 },
];

// Device usage distribution
export const deviceUsageData: DeviceUsageData[] = [
  { name: 'Desktop', value: 400, color: CHART_COLORS.primary },
  { name: 'Mobile', value: 300, color: CHART_COLORS.secondary },
  { name: 'Tablet', value: 200, color: CHART_COLORS.accent },
  { name: 'Other', value: 100, color: CHART_COLORS.warning },
];

// Weekly website visits
export const weeklyVisitsData: WeeklyVisitsData[] = [
  { day: 'Mon', visits: 120 },
  { day: 'Tue', visits: 190 },
  { day: 'Wed', visits: 300 },
  { day: 'Thu', visits: 500 },
  { day: 'Fri', visits: 200 },
  { day: 'Sat', visits: 300 },
  { day: 'Sun', visits: 200 },
];

// Conversion rates by traffic source
export const conversionRatesBySource: ConversionRateData[] = [
  { source: 'Google', rate: 12.5 },
  { source: 'Facebook', rate: 8.3 },
  { source: 'Twitter', rate: 6.7 },
  { source: 'Direct', rate: 15.2 },
  { source: 'Email', rate: 22.1 },
];

// Product sales data
export const productSalesData: ProductSalesData[] = [
  { name: 'Product A', sales: 400 },
  { name: 'Product B', sales: 300 },
  { name: 'Product C', sales: 500 },
  { name: 'Product D', sales: 200 },
];

// Key metrics data
export const keyMetrics: MetricData = {
  totalUsers: 12543,
  revenue: 52341,
  orders: 1234,
  conversionRate: 3.4,
};

// Quick stats data
export const quickStatsData: QuickStats = {
  uptime: 85,
  loadTime: '12.3s',
  errors: 3,
};