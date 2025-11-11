export interface MetricData {
  totalUsers: number;
  revenue: number;
  orders: number;
  conversionRate: number;
}

export interface SalesData {
  month: string;
  revenue: number;
  expenses: number;
}

export interface DeviceUsageData {
  name: string;
  value: number;
  color: string;
}

export interface WeeklyVisitsData {
  day: string;
  visits: number;
}

export interface ConversionRateData {
  source: string;
  rate: number;
}

export interface ProductSalesData {
  name: string;
  sales: number;
}

export interface QuickStats {
  uptime: number;
  loadTime: string;
  errors: number;
}

export interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  valueColor?: string;
  iconColor?: string;
}