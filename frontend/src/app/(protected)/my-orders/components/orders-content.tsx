"use client";

import {useRouter} from "next/navigation";
import {useState} from "react";
import {toast} from "sonner";

import {useCancelOrder, useMyOrders} from "@/hooks/use-orders";
import Loader from "@/components/loader";
import {OrdersFilterParams} from "@/types/order";
import EmptyState from "./empty-state";
import OrderCard from "./order-card";
import OrderFilters from "./order-filters";
import PageHeader from "./page-header";
import Pagination from "./pagination";

// Orders content component (data-heavy, interactive) - Arrow function
const OrdersContent = () => {
	const router = useRouter();
	const [currentPage, setCurrentPage] = useState(1);
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<string>("createdAt");

	// Build filter params
	const filterParams: OrdersFilterParams = {
		page: currentPage,
		limit: 10,
		...(statusFilter !== "all" && {
			status: statusFilter as "pending" | "completed" | "cancelled",
		}),
		sortBy: sortBy as "createdAt" | "updatedAt" | "totalAmount",
		sortOrder: "desc",
	};

	const {data, isLoading} = useMyOrders(filterParams);
	const cancelOrderMutation = useCancelOrder();

	// Handle payment - Arrow function
	const handlePayment = (orderId: string) => {
		router.push(`/payment?orderid=${orderId}`);
	};

	// Handle cancel order - Arrow function
	const handleCancelOrder = (orderId: string, orderCode: string) => {
		cancelOrderMutation.mutate(orderId, {
			onSuccess: () => {
				toast.success(`Order ${orderCode} has been successfully cancelled`);
			},
		});
	};

	// Handle page change - Arrow function
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({top: 0, behavior: "smooth"});
	};

	// Handle explore - Arrow function
	const handleExplore = () => {
		router.push("/");
	};

	// Loading state
	if (isLoading) {
		return <Loader />;
	}

	const orders = data?.orders || [];
	const pagination = data?.pagination;

	return (
		<>
			{/* Updated Page Header with actual orders count */}
			<PageHeader ordersCount={orders.length} />

			{/* Filters */}
			<OrderFilters
				statusFilter={statusFilter}
				sortBy={sortBy}
				ordersCount={orders.length}
				totalOrders={pagination?.total || 0}
				onStatusChange={setStatusFilter}
				onSortChange={setSortBy}
			/>

			{/* Orders List */}
			{orders.length === 0 ? (
				<EmptyState onExplore={handleExplore} />
			) : (
				<div className="space-y-3 sm:space-y-4">
					{orders.map((order) => (
						<OrderCard
							key={order._id}
							order={order}
							onPayment={handlePayment}
							onCancel={handleCancelOrder}
							cancelMutation={cancelOrderMutation}
						/>
					))}
				</div>
			)}

			{/* Pagination */}
			<Pagination
				pagination={pagination}
				currentPage={currentPage}
				onPageChange={handlePageChange}
			/>
		</>
	);
};

export default OrdersContent;
