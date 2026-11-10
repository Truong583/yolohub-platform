"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {useRecentSales} from "@/hooks/use-dashboard";
import {formatPrice} from "@/utils/format";

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase())
		.join("")
		.slice(0, 2);
}

const RecentSales = () => {
	const {data: recentSalesData, isLoading} = useRecentSales();

	if (isLoading) {
		return (
			<Card className="col-span-1 lg:col-span-3">
				<CardHeader>
					<CardTitle>Recent Sales</CardTitle>
					<Skeleton className="h-4 w-64" />
				</CardHeader>
				<CardContent>
					<div className="space-y-8">
						{Array.from({length: 5}).map((_, i) => (
							<div key={i} className="flex items-center gap-4">
								<Skeleton className="h-9 w-9 rounded-full" />
								<div className="flex flex-1 flex-wrap items-center justify-between">
									<div className="space-y-1">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-3 w-32" />
									</div>
									<Skeleton className="h-4 w-16" />
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	const recentSales = recentSalesData?.recentSales || [];

	return (
		<Card className="col-span-1 lg:col-span-3">
			<CardHeader>
				<CardTitle>Recent Sales</CardTitle>
				<CardDescription>
					{recentSalesData?.currentMonthSummary
						? `You made ${formatPrice(
								recentSalesData.currentMonthSummary.totalRevenue
						  )} from ${
								recentSalesData.currentMonthSummary.salesCount
						  } sales this month.`
						: "Loading sales data..."}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{recentSales.length === 0 ? (
					<div className="flex justify-center items-center h-40">
						<p className="text-center text-muted-foreground">
							No recent sales available.
						</p>
					</div>
				) : (
					<div className="max-h-80 overflow-y-auto pr-2">
						<div className="space-y-8">
							{recentSales.map((sale) => (
								<div key={sale.id} className="flex items-center gap-4">
									<Avatar className="h-9 w-9">
										{sale.customer.avatar && (
											<AvatarImage
												src={sale.customer.avatar}
												alt={sale.customer.name}
											/>
										)}
										<AvatarFallback>
											{getInitials(sale.customer.name)}
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-1 flex-wrap items-center justify-between">
										<div className="space-y-1">
											<p className="text-sm leading-none font-medium">
												{sale.customer.name}
											</p>
											<p className="text-muted-foreground text-sm">
												{sale.customer.email}
											</p>
										</div>
										<div className="font-medium">
											+{formatPrice(sale.amount)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default RecentSales;
