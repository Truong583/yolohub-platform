"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {MdPeople, MdSchool, MdSecurity, MdTrendingUp} from "react-icons/md";
import {useDashboardStats} from "@/hooks/use-dashboard";
import {formatPrice} from "@/utils/format";

import type {
	ProcessedDashboardStat,
	ChangeType,
	DashboardStatItem,
	DashboardStatsResponse,
} from "@/types/dashboard";

function getChangeType(changePercentage: number): ChangeType {
	if (changePercentage > 0) return "positive";
	if (changePercentage < 0) return "negative";
	return "neutral";
}

function formatChange(changePercentage: number): string {
	if (changePercentage === 0) return "0%";
	const sign = changePercentage > 0 ? "+" : "";
	return `${sign}${changePercentage}%`;
}

function formatValue(count: number, isRevenue: boolean = false): string {
	return isRevenue ? formatPrice(count) : count.toLocaleString();
}

function processStats(
	rawStats: DashboardStatsResponse
): ProcessedDashboardStat[] {
	const statsConfig = [
		{
			key: "totalUsers",
			title: "Total Users",
			icon: MdPeople,
		},
		{
			key: "activeCourses",
			title: "Active Courses",
			icon: MdSchool,
		},
		{
			key: "userRoles",
			title: "User Roles",
			icon: MdSecurity,
		},
		{
			key: "totalRevenue",
			title: "Total Revenue",
			icon: MdTrendingUp,
		},
	];

	return statsConfig
		.filter((config) => rawStats[config.key as keyof DashboardStatsResponse]) // Only include stats that exist in the API response
		.map((config) => {
			const statData: DashboardStatItem = rawStats[
				config.key as keyof DashboardStatsResponse
			] as DashboardStatItem;
			const isRevenue = config.key === "totalRevenue";
			return {
				title: config.title,
				value: formatValue(statData.count, isRevenue),
				change: formatChange(statData.changePercentage),
				changeType: getChangeType(statData.changePercentage),
				icon: config.icon,
			};
		});
}

const DashboardStats = () => {
	const {data: rawStats, isLoading} = useDashboardStats();

	if (isLoading) {
		return (
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{Array.from({length: 4}).map((_, i) => (
					<Card key={i}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-4" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-20 mb-2" />
							<Skeleton className="h-3 w-28" />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	const processedStats = rawStats ? processStats(rawStats) : [];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{processedStats.map((stat) => (
				<Card key={stat.title}>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							{stat.title}
						</CardTitle>
						<stat.icon className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stat.value}</div>
						<p
							className={`text-xs ${
								stat.changeType === "positive"
									? "text-green-600"
									: stat.changeType === "negative"
									? "text-red-600"
									: "text-muted-foreground"
							}`}
						>
							{stat.change} from last month
						</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default DashboardStats;
