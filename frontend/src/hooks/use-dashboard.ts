import { useQuery } from "@tanstack/react-query";
import DashboardService from "@/services/dashboard";

// Query keys for dashboard
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  overview: () => [...dashboardKeys.all, "overview"] as const,
  recentSales: () => [...dashboardKeys.all, "recent-sales"] as const,
} as const;

// Hook to get dashboard statistics
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => DashboardService.getDashboardStats(),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });
}

// Hook to get overview statistics (monthly revenue data)
export function useOverviewStats() {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: () => DashboardService.getOverviewStats(),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });
}

// Hook to get recent sales data
export function useRecentSales() {
  return useQuery({
    queryKey: dashboardKeys.recentSales(),
    queryFn: () => DashboardService.getRecentSales(),
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes (more frequent for recent sales)
    staleTime: 1 * 60 * 1000, // Consider data stale after 1 minute
  });
}

