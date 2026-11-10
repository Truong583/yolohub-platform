// Course details embedded in cart item
export interface CourseDetails {
	_id: string;
	title: string;
	image: string;
	price: number;
	oldPrice?: number;
	status: string;
}

export interface CartItem {
	courseId: CourseDetails;
	title: string;
	price: number;
	oldPrice?: number;
	thumbnail: string;
	addedAt: string;
}

export interface Cart {
	_id: string;
	userId: string;
	items: CartItem[];
	totalPrice: number;
	createdAt: string;
	updatedAt: string;
	__v?: number;
}

// Request interfaces (courseId should be string when sending to API)
export interface AddToCartRequest {
	courseId: string;
}

export interface UpdateCartItemRequest {
	courseId: string;
}

export interface RemoveFromCartRequest {
	courseId: string;
}

// Backend response structure (for reference)
export interface BackendCartResponse {
	success: boolean;
	message: string;
	statusCode: number;
	data: Cart;
}

// What ApiService returns (already unwrapped)
export type CartResponse = Cart;

// Discount voucher interface
export interface DiscountVoucher {
	code: string;
	label: string;
	discountType: "percentage" | "fixed";
	discountValue: number;
	minOrderValue?: number;
}

// Order discount interface
export interface OrderDiscount {
	code: string;
	discountAmount: number;
	appliedSuccessfully: boolean;
}

// Helper interface for cart calculations (used in UI components)
export interface CartSummary {
	subtotal: number;
	discountAmount: number;
	total: number;
	itemCount: number;
}
