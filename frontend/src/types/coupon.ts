// Coupon types based on backend API structure

export interface Coupon {
	_id: string;
	title: string;
	code: string;
	discountType: "percent" | "fixed";
	discountValue: number;
	courseIds: Array<{
		_id: string;
		title: string;
		price?: number;
	}>;
	minPurchaseAmount: number;
	maxUses: number;
	usedCount: number;
	startDate: string;
	endDate: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

// API Response structure
export interface CouponsResponse {
	success: boolean;
	message: string;
	statusCode: number;
	data: {
		coupons: Coupon[];
	};
}

// What ApiService returns (already unwrapped)
export interface CouponsData {
	coupons: Coupon[];
}

// Request types
export interface GetActiveCouponsRequest {
	minAmount?: number;
}

// Validation request
export interface ValidateCouponRequest {
	code: string;
	courseIds?: string[];
}

// Extended coupon with populated courseIds for validation response
export interface ValidatedCoupon extends Omit<Coupon, "courseIds"> {
	courseIds: Array<{
		_id: string;
		title: string;
		price: number;
	}>;
}

// API validation response structure
export interface ValidateCouponApiResponse {
	success: boolean;
	message: string;
	statusCode: number;
	data: ValidatedCoupon;
}

// What ApiService returns (already unwrapped) - just the coupon data
export type ValidateCouponResponse = ValidatedCoupon;

// Admin CRUD types
export interface CreateCouponRequest {
	title: string;
	code: string;
	discountType: "percent" | "fixed";
	discountValue: number;
	courseIds?: string[];
	minPurchaseAmount?: number;
	maxUses?: number;
	startDate?: string;
	endDate?: string;
	isActive?: boolean;
}

export interface UpdateCouponRequest extends Partial<CreateCouponRequest> {
	id: string;
}

export interface CouponsListParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: string[];
	discountType?: string[];
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	[key: string]: unknown;
}

// Pagination interface for coupon lists
export interface CouponPagination {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage?: boolean;
	hasPrevPage?: boolean;
}

// Coupons list response
export interface CouponsListResponse {
	coupons: Coupon[];
	pagination: CouponPagination;
}

// Enum-like objects for better type safety
export const DiscountType = {
	PERCENT: "percent" as const,
	FIXED: "fixed" as const,
} as const;

export const CouponStatus = {
	ACTIVE: "active" as const,
	INACTIVE: "inactive" as const,
	EXPIRED: "expired" as const,
} as const;

export type DiscountTypeValue =
	(typeof DiscountType)[keyof typeof DiscountType];
export type CouponStatusValue =
	(typeof CouponStatus)[keyof typeof CouponStatus];
