// Dashboard statistics types

// Overview data types
export interface OverviewDataItem {
  year: number;
  month: number;
  monthName: string;
  totalRevenue: number;
  salesCount: number;
}

// Overview response is directly an array
export type OverviewStatsResponse = OverviewDataItem[];

// Recent Sales types
export interface RecentSalesCustomer {
  name: string;
  email: string;
  avatar: string;
}

export interface RecentSalesItem {
  id: string;
  orderCode: string;
  customer: RecentSalesCustomer;
  amount: number;
  itemCount: number;
  date: string;
}

export interface RecentSalesResponse {
  success: boolean;
  message: string;
  statusCode: number;
  recentSales: RecentSalesItem[];
  currentMonthSummary: {
    salesCount: number;
    totalRevenue: number;
  };
}

// Individual stat item structure
export interface DashboardStatItem {
  count: number;
  changeFromLastMonth: number;
  changePercentage: number;
}

// Dashboard statistics data structure
export interface DashboardStats {
  totalUsers: DashboardStatItem;
  activeCourses: DashboardStatItem;
  userRoles: DashboardStatItem;
  totalRevenue?: DashboardStatItem; // Optional as it may not always be present
}

// Dashboard stats API response type
export interface DashboardStatsResponse {
  totalUsers: DashboardStatItem;
  activeCourses: DashboardStatItem;
  userRoles: DashboardStatItem;
  totalRevenue?: DashboardStatItem;
}

// Change type for UI display
export type ChangeType = "positive" | "negative" | "neutral";

// Processed stat for UI display
export interface ProcessedDashboardStat {
  title: string;
  value: string;
  change: string;
  changeType: ChangeType;
  icon: React.ComponentType<{ className?: string }>;
}
