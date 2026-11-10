import { ApiService } from "@/lib/api-service";
import type { DashboardStatsResponse, OverviewStatsResponse, RecentSalesResponse } from "@/types/dashboard";

// Dashboard API endpoints
const ENDPOINTS = {
  STATS: "/stats/dashboard",
  OVERVIEW: "/stats/overview",
  RECENT_SALES: "/stats/recent-sales",
} as const;

// Dashboard service
export class DashboardService {
  // Get dashboard statistics
  static async getDashboardStats(): Promise<DashboardStatsResponse> {
    try {
      return await ApiService.get<DashboardStatsResponse>(ENDPOINTS.STATS);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      // Return fallback data if API fails
      return {
        totalUsers: {
          count: 0,
          changeFromLastMonth: 0,
          changePercentage: 0,
        },
        activeCourses: {
          count: 0,
          changeFromLastMonth: 0,
          changePercentage: 0,
        },
        userRoles: {
          count: 0,
          changeFromLastMonth: 0,
          changePercentage: 0,
        },
        totalRevenue: {
          count: 0,
          changeFromLastMonth: 0,
          changePercentage: 0,
        },
      };
    }
  }

  // Get overview statistics (monthly revenue data)
  static async getOverviewStats(): Promise<OverviewStatsResponse> {
    try {
      return await ApiService.get<OverviewStatsResponse>(ENDPOINTS.OVERVIEW);
    } catch (error) {
      console.error("Failed to fetch overview stats:", error);
      // Return fallback data if API fails
      const currentYear = new Date().getFullYear();
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      
      return months.map((monthName, index) => ({
        year: currentYear,
        month: index + 1,
        monthName,
        totalRevenue: 0,
        salesCount: 0,
      }));
    }
  }

  // Get recent sales data
  static async getRecentSales(): Promise<RecentSalesResponse> {
    try {
      return await ApiService.get<RecentSalesResponse>(ENDPOINTS.RECENT_SALES);
    } catch (error) {
      console.error("Failed to fetch recent sales:", error);
      // Return fallback data if API fails
      return {
        success: false,
        message: "Failed to load recent sales data",
        statusCode: 500,
        recentSales: [],
        currentMonthSummary: {
          salesCount: 0,
          totalRevenue: 0,
        },
      };
    }
  }
}

// Export as default for consistency with other services
export default DashboardService;
