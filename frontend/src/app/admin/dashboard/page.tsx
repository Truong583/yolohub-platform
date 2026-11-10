"use client";
import dynamic from "next/dynamic";
import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

// Dashboard skeleton components
const DashboardStatsSkeleton = () => (
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

const OverviewSkeleton = () => (
	<Card className="col-span-1 lg:col-span-4">
		<CardHeader>
			<CardTitle>Overview</CardTitle>
		</CardHeader>
		<CardContent>
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
		</CardContent>
	</Card>
);

const RecentSalesSkeleton = () => (
	<Card className="col-span-1 lg:col-span-3">
		<CardHeader>
			<CardTitle>Recent Sales</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="space-y-8">
				{Array.from({length: 5}).map((_, i) => (
					<div key={i} className="flex items-center">
						<Skeleton className="h-9 w-9 rounded-full" />
						<div className="ml-4 space-y-1">
							<Skeleton className="h-4 w-[120px]" />
							<Skeleton className="h-3 w-[80px]" />
						</div>
						<Skeleton className="ml-auto h-4 w-[60px]" />
					</div>
				))}
			</div>
		</CardContent>
	</Card>
);

// Dynamic imports with loading states
const DashboardStats = dynamic(() => import("./components/dashboard-stats"), {
	loading: () => <DashboardStatsSkeleton />,
	ssr: false,
});

const Overview = dynamic(() => import("./components/overview"), {
	loading: () => <OverviewSkeleton />,
	ssr: false,
});

const RecentSales = dynamic(() => import("./components/recent-sales"), {
	loading: () => <RecentSalesSkeleton />,
	ssr: false,
});

const AdminDashboard = () => {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
				<p className="text-muted-foreground">Welcome to your admin dashboard</p>
			</div>
			<DashboardStats />
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
				<Overview />
				<RecentSales />
			</div>
		</div>
	);
};

export default AdminDashboard;
