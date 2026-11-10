// Order interfaces
export enum OrderStatus {
	PENDING = "pending",
	COMPLETED = "completed",
	CANCELLED = "cancelled",
}
export interface OrderUser {
	_id: string;
	username: string;
	email: string;
	avatar: string;
}

export interface IOrderItem {
	courseId: string;
	oldPrice: number;
	price: number;
	thumbnail: string;
	title: string;
	_id: string;
}

export interface IOrder {
	_id: string;
	code: string;
	couponCode?: string;
	createdAt: string;
	items: IOrderItem[];
	paymentMethod: "stripe" | "bank_transfer";
	status: "pending" | "completed" | "cancelled";
	subTotal: number;
	totalAmount: number;
	totalDiscount: number;
	updatedAt: string;
	user: OrderUser;
	userId: string;
}

export interface CourseInfo {
	_id: string;
	title: string;
	image: string;
}

export interface OrderItem {
	courseId: CourseInfo;
	title: string;
	price: number;
	oldPrice?: number;
	thumbnail: string;
	_id: string;
}

// New interface specifically for My Orders page API response

export interface MyOrderItem {
	courseId: string;
	title: string;
	price: number;
	oldPrice?: number;
	thumbnail: string;
	_id: string;
}

export interface MyOrder {
	_id: string;
	code: string;
	userId: string;
	items: MyOrderItem[];
	subTotal: number;
	totalDiscount: number;
	totalAmount: number;
	paymentMethod: "stripe" | "bank_transfer";
	status: "pending" | "completed" | "cancelled";
	createdAt: string;
	updatedAt: string;
	__v?: number;
}

// Order creation interfaces (moved from cart types)
export interface CreateOrderRequest {
	courseIds: string[];
	paymentMethod: "stripe" | "bank_transfer";
	couponCode?: string;
}

export interface CreateOrderResponse {
	sessionId: string;
	checkoutUrl?: string;
	_id?: string;
	amount?: string;
	message?: string;
	paymentMethod?: string;
}

export interface MyOrdersListResponse {
	orders: MyOrder[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}
export interface AdminOrdersListResponse {
	orders: IOrder[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}
export interface AdminOrdersFilterParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: string[];
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface UpdateAdminOrderRequest extends Partial<IOrder> {
	id: string;
}

export interface OrderDetails {
	_id: string;
	code: string;
	userId: string | OrderUser;
	items: OrderItem[];
	subTotal: number;
	totalDiscount: number;
	totalAmount: number;
	paymentMethod: "stripe" | "bank_transfer";
	status: "pending" | "completed" | "cancelled";
	createdAt: string;
	updatedAt: string;
	__v?: number;
}

export interface OrderResponse {
	success: boolean;
	message: string;
	statusCode: number;
	data: OrderDetails;
}

// Order service filter parameters
export interface OrdersFilterParams {
	page?: number;
	limit?: number;
	status?: "pending" | "completed" | "cancelled";
	sortBy?: "createdAt" | "updatedAt" | "totalAmount";
	sortOrder?: "asc" | "desc";
	[key: string]: unknown;
}

// Legacy order list response (for backward compatibility)
export interface OrdersListResponse {
	orders: OrderDetails[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}
