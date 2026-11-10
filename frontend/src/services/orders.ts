import {ApiService} from "@/lib/api-service";
import type {
	OrderDetails,
	MyOrdersListResponse,
	OrdersListResponse,
	OrdersFilterParams,
	CreateOrderRequest,
	CreateOrderResponse,
	IOrder,
	AdminOrdersListResponse,
	AdminOrdersFilterParams,
	UpdateAdminOrderRequest,
} from "@/types/order";

const ENDPOINTS = {
	ORDERS: "/orders",
	ORDER_DETAILS: "/orders",
	USER_ORDERS: "/orders/my-orders",
} as const;

export class OrderService {
	// Get order by ID
	static async getOrderById(orderId: string): Promise<OrderDetails> {
		try {
			return await ApiService.get<OrderDetails>(
				`${ENDPOINTS.ORDER_DETAILS}/${orderId}`
			);
		} catch {
			throw new Error("Failed to fetch order");
		}
	}

	// Get user orders (legacy)
	static async getUserOrders(
		params?: OrdersFilterParams
	): Promise<OrdersListResponse> {
		try {
			return await ApiService.get<OrdersListResponse>(
				ENDPOINTS.USER_ORDERS,
				params as Record<string, unknown>
			);
		} catch {
			return {
				orders: [],
				pagination: {
					page: params?.page || 1,
					limit: params?.limit || 10,
					total: 0,
					totalPages: 0,
					hasNextPage: false,
					hasPrevPage: false,
				},
			};
		}
	}

	// Get my orders
	static async getMyOrders(
		params?: OrdersFilterParams
	): Promise<MyOrdersListResponse> {
		try {
			return await ApiService.get<MyOrdersListResponse>(
				ENDPOINTS.USER_ORDERS,
				params as Record<string, unknown>
			);
		} catch {
			return {
				orders: [],
				pagination: {
					page: params?.page || 1,
					limit: params?.limit || 10,
					total: 0,
					totalPages: 0,
					hasNextPage: false,
					hasPrevPage: false,
				},
			};
		}
	}

	// Cancel order
	static async cancelOrder(orderId: string): Promise<void> {
		return ApiService.put<void>(`${ENDPOINTS.ORDER_DETAILS}/${orderId}/cancel`);
	}

	// Create order (checkout process)
	static async createOrder(
		data: CreateOrderRequest
	): Promise<CreateOrderResponse> {
		return ApiService.post<CreateOrderResponse, CreateOrderRequest>(
			ENDPOINTS.ORDERS,
			data
		);
	}

	// Get admin orders
	static async getAdminOrders(
		params?: AdminOrdersFilterParams
	): Promise<AdminOrdersListResponse> {
		try {
			return await ApiService.get<AdminOrdersListResponse>(
				ENDPOINTS.ORDERS,
				params as Record<string, unknown>
			);
		} catch {
			return {
				orders: [],
				pagination: {
					page: params?.page || 1,
					limit: params?.limit || 10,
					total: 0,
					totalPages: 0,
					hasNextPage: false,
					hasPrevPage: false,
				},
			};
		}
	}

	// Get admin order by ID
	static async getAdminOrderById(orderId: string): Promise<IOrder> {
		try {
			return await ApiService.get<IOrder>(`${ENDPOINTS.ORDERS}/${orderId}`);
		} catch {
			throw new Error("Failed to fetch admin order");
		}
	}

	// Update admin order
	static async updateAdminOrder(
		orderData: UpdateAdminOrderRequest
	): Promise<IOrder> {
		const {id, ...updateData} = orderData;
		return ApiService.put<IOrder, Partial<UpdateAdminOrderRequest>>(
			`${ENDPOINTS.ORDERS}/${id}`,
			updateData
		);
	}

	// Delete admin order
	static async deleteAdminOrder(orderId: string): Promise<void> {
		return ApiService.delete<void>(`${ENDPOINTS.ORDERS}/${orderId}`);
	}

	// Bulk delete admin orders
	static async bulkDeleteAdminOrders(orderIds: string[]): Promise<void> {
		return ApiService.delete<void, {orderIds: string[]}>(
			`${ENDPOINTS.ORDERS}/bulk`,
			{orderIds}
		);
	}

	// Update order status
	static async updateOrderStatus(
		orderId: string,
		status: string
	): Promise<IOrder> {
		return ApiService.put<IOrder, {status: string}>(
			`${ENDPOINTS.ORDERS}/${orderId}/status`,
			{status}
		);
	}

	// Download invoice
	static async downloadInvoice(
		orderId: string,
		orderCode: string
	): Promise<void> {
		try {
			// Get the blob from the API
			const blob = await ApiService.downloadBlob(
				`${ENDPOINTS.ORDERS}/${orderId}/invoice`
			);

			// Create a download link
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `invoice-${orderCode}.pdf`;
			document.body.appendChild(link);
			link.click();

			// Cleanup
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch {
			throw new Error("Failed to download invoice");
		}
	}
}

export default OrderService;
