"use client";

import dynamic from "next/dynamic";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useOverviewStats} from "@/hooks/use-dashboard";
import {Skeleton} from "@/components/ui/skeleton";
import type {OverviewDataItem} from "@/types/dashboard";

// 1. Dynamically import the component
const Chart = dynamic(() => import("./dynamic-bar-chart"), {
	// 2. CRITICAL: Prevents the large Recharts bundle from being included
	//    in the server's initial HTML or page-level JavaScript bundle.
	ssr: false,
	// 3. Optional: Provide a fallback UI while the chart bundle loads
	loading: () => (
		<div className="h-[350px] bg-gray-50 animate-pulse rounded-md flex items-center justify-center">
			<p className="text-sm text-muted-foreground">Loading chart...</p>
		</div>
	),
});

export default function Overview() {
	// Data can be fetched efficiently on the server (Server Component)
	const {data: overviewData, isLoading} = useOverviewStats();

	const renderChartContent = () => {
		if (isLoading) {
			return (
				<div className="h-[350px] flex flex-col">
					<div className="flex justify-between items-end mb-4 h-6">
						<Skeleton className="h-3 w-8" />
						<Skeleton className="h-3 w-10" />
						<Skeleton className="h-3 w-8" />
						<Skeleton className="h-3 w-6" />
					</div>
					<div className="flex-1 flex items-end justify-between gap-2 mb-4">
						{Array.from({length: 12}).map((_, i) => {
							const heights = [
								"h-16",
								"h-20",
								"h-24",
								"h-32",
								"h-40",
								"h-48",
								"h-56",
								"h-16",
								"h-12",
								"h-8",
								"h-20",
								"h-28",
							];
							return (
								<Skeleton key={i} className={`w-6 ${heights[i]} rounded-t`} />
							);
						})}
					</div>
					<div className="flex justify-between">
						{[
							"Jan",
							"Feb",
							"Mar",
							"Apr",
							"May",
							"Jun",
							"Jul",
							"Aug",
							"Sep",
							"Oct",
							"Nov",
							"Dec",
						].map((month) => (
							<Skeleton key={month} className="h-3 w-6" />
						))}
					</div>
				</div>
			);
		}

		const chartData: OverviewDataItem[] = overviewData || [];

		if (chartData.length === 0) {
			return (
				<div className="flex justify-center items-center h-[350px]">
					<p className="text-center text-muted-foreground">
						No overview data available.
					</p>
				</div>
			);
		}

		// The Recharts component is now lazy-loaded
		return <Chart data={chartData} />;
	};

	return (
		<Card className="col-span-1 lg:col-span-4">
			<CardHeader>
				<CardTitle>Overview</CardTitle>
			</CardHeader>
			<CardContent className="ps-2">{renderChartContent()}</CardContent>
		</Card>
	);
}
