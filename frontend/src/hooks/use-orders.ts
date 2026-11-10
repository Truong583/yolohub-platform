import {OrderService} from "@/services/orders";
import type {
	AdminOrdersFilterParams,
	CreateOrderRequest,
	CreateOrderResponse,
	IOrder,
	MyOrdersListResponse,
	OrderDetails,
	OrdersFilterParams,
	OrdersListResponse,
} from "@/types/order";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

import {keepPreviousData} from "@tanstack/react-query";
import {toast} from "sonner";

// Query keys for orders
export const orderKeys = {
	all: ["orders"] as const,
	lists: () => [...orderKeys.all, "list"] as const,
	list: (filters: OrdersFilterParams) =>
		[...orderKeys.lists(), filters] as const,
	details: () => [...orderKeys.all, "detail"] as const,
	detail: (id: string) => [...orderKeys.details(), id] as const,
	// User-specific keys
	userOrders: (filters: OrdersFilterParams) =>
		[...orderKeys.lists(), "user", filters] as const,
	myOrders: (filters: OrdersFilterParams) =>
		[...orderKeys.lists(), "my-orders", filters] as const,
};

// Default empty params for stable reference
const DEFAULT_PARAMS: OrdersFilterParams = {};

// Hook to get order details by ID
export function useOrderDetails(orderId: string | null) {
	return useQuery<OrderDetails>({
		queryKey: orderKeys.detail(orderId || ""),
		queryFn: () => OrderService.getOrderById(orderId!),
		enabled: !!orderId,
	});
}

// Hook to get user's orders (legacy)
export function useUserOrders(params?: OrdersFilterParams) {
	const normalizedParams = params || DEFAULT_PARAMS;

	return useQuery<OrdersListResponse>({
		queryKey: orderKeys.userOrders(normalizedParams),
		queryFn: () => OrderService.getUserOrders(normalizedParams),
		placeholderData: keepPreviousData,
	});
}

// Hook to get my orders with proper typing
export function useMyOrders(params?: OrdersFilterParams) {
	const normalizedParams = params || DEFAULT_PARAMS;

	return useQuery<MyOrdersListResponse>({
		queryKey: orderKeys.myOrders(normalizedParams),
		queryFn: () => OrderService.getMyOrders(normalizedParams),
		placeholderData: keepPreviousData,
	});
}

// Hook to cancel an order
export function useCancelOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orderId: string) => OrderService.cancelOrder(orderId),
		onSuccess: (_, orderId) => {
			// Invalidate and refetch my orders
			queryClient.invalidateQueries({
				queryKey: orderKeys.lists(),
			});

			// Also invalidate the specific order details if cached
			queryClient.invalidateQueries({
				queryKey: orderKeys.detail(orderId),
			});
		},
		onError: (error) => {
			console.error("Cancel order error:", error);
			toast.error("Không thể hủy đơn hàng. Vui lòng thử lại.");
		},
	});
}

// Hook to create order through checkout
export function useCreateOrder() {
	const queryClient = useQueryClient();

	return useMutation<CreateOrderResponse, Error, CreateOrderRequest>({
		mutationFn: (data: CreateOrderRequest) => OrderService.createOrder(data),
		onSuccess: () => {
			// Invalidate cart queries since items are moved to order

			// Invalidate orders lists to show the new order
			queryClient.invalidateQueries({
				queryKey: orderKeys.lists(),
			});

			toast.success("Order created! Redirecting to payment...");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create order");
		},
	});
}

// ===== ADMIN-SPECIFIC HOOKS =====

// Hook to fetch admin orders list
export function useAdminOrders(params?: AdminOrdersFilterParams) {
	const normalizedParams = params || {};

	return useQuery({
		queryKey: [...orderKeys.lists(), "admin", normalizedParams],
		queryFn: () => OrderService.getAdminOrders(normalizedParams),
		placeholderData: keepPreviousData,
	});
}

// Hook to fetch single admin order details
export function useAdminOrderDetails(orderId: string) {
	return useQuery({
		queryKey: orderKeys.detail(orderId),
		queryFn: () => OrderService.getAdminOrderById(orderId),
		enabled: !!orderId,
	});
}

// Hook to update admin order
export function useUpdateAdminOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			orderId,
			orderData,
		}: {
			orderId: string;
			orderData: Partial<IOrder>;
		}) => OrderService.updateAdminOrder({id: orderId, ...orderData}),
		onSuccess: (_, {orderId}) => {
			// Invalidate and refetch admin orders list
			queryClient.invalidateQueries({
				queryKey: orderKeys.lists(),
			});

			// Also invalidate the specific order details
			queryClient.invalidateQueries({
				queryKey: orderKeys.detail(orderId),
			});

			toast.success("Order updated successfully");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update order. Please try again.");
		},
	});
}

// Hook to delete admin order
export function useDeleteAdminOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orderId: string) => OrderService.deleteAdminOrder(orderId),
		onSuccess: (_, orderId) => {
			// Invalidate and refetch admin orders list
			queryClient.invalidateQueries({
				queryKey: orderKeys.lists(),
			});

			// Remove the specific order details from cache
			queryClient.removeQueries({
				queryKey: orderKeys.detail(orderId),
			});

			toast.success("Order deleted successfully");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete order. Please try again.");
		},
	});
}

// Hook to bulk delete admin orders
export function useBulkDeleteAdminOrders() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (orderIds: string[]) =>
			OrderService.bulkDeleteAdminOrders(orderIds),
		onSuccess: (_, orderIds) => {
			// Invalidate and refetch admin orders list
			queryClient.invalidateQueries({
				queryKey: orderKeys.lists(),
			});

			// Remove specific order details from cache
			orderIds.forEach((orderId) => {
				queryClient.removeQueries({
					queryKey: orderKeys.detail(orderId),
				});
			});

			toast.success(
				`Successfully deleted ${orderIds.length} order${
					orderIds.length === 1 ? "" : "s"
				}`
			);
		},
		onError: (error) => {
			toast.error(
				error.message || "Failed to delete orders. Please try again."
			);
		},
	});
}

// Hook to update order status
export function useUpdateOrderStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({orderId, status}: {orderId: string; status: string}) =>
			OrderService.updateOrderStatus(orderId, status),
		onSuccess: (_, {orderId}) => {
			// Invalidate and refetch admin orders list
			queryClient.invalidateQueries({
				queryKey: orderKeys.lists(),
			});

			// Invalidate the specific order details
			queryClient.invalidateQueries({
				queryKey: orderKeys.detail(orderId),
			});

			toast.success("Order status updated successfully");
		},
		onError: (error) => {
			toast.error(
				error.message || "Failed to update order status. Please try again."
			);
		},
	});
}
