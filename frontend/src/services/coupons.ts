import {ApiService} from "@/lib/api-service";
import type {
	CouponsData,
	GetActiveCouponsRequest,
	ValidateCouponRequest,
	ValidateCouponResponse,
	CreateCouponRequest,
	UpdateCouponRequest,
	CouponsListParams,
	CouponsListResponse,
	Coupon,
} from "@/types/coupon";

const ENDPOINTS = {
	COUPONS: "/coupons",
	COUPONS_ALL: "/coupons/all",
	ACTIVE_COUPONS: "/coupons/active",
	VALIDATE_COUPON: "/coupons/validate",
} as const;

export class CouponService {
	// Get coupons with pagination
	static async getCoupons(
		params?: CouponsListParams
	): Promise<CouponsListResponse> {
		try {
			return await ApiService.get<CouponsListResponse>(
				ENDPOINTS.COUPONS,
				params
			);
		} catch {
			return {
				coupons: [],
				pagination: {
					page: params?.page || 1,
					limit: params?.limit || 10,
					total: 0,
					totalPages: 0,
				},
			};
		}
	}

	// Get all coupons
	static async getAllCoupons(): Promise<Coupon[]> {
		try {
			const response = await ApiService.get<{coupons: Coupon[]}>(
				ENDPOINTS.COUPONS_ALL
			);
			return response.coupons || [];
		} catch {
			return [];
		}
	}

	// Get coupon by ID
	static async getCoupon(id: string): Promise<Coupon> {
		return ApiService.get<Coupon>(`${ENDPOINTS.COUPONS}/${id}`);
	}

	// Create coupon
	static async createCoupon(couponData: CreateCouponRequest): Promise<Coupon> {
		return ApiService.post<Coupon, CreateCouponRequest>(
			ENDPOINTS.COUPONS,
			couponData
		);
	}

	// Update coupon
	static async updateCoupon(couponData: UpdateCouponRequest): Promise<Coupon> {
		const {id, ...updateData} = couponData;
		return ApiService.put<Coupon, Omit<UpdateCouponRequest, "id">>(
			`${ENDPOINTS.COUPONS}/${id}`,
			updateData
		);
	}

	// Patch coupon
	static async patchCoupon(
		id: string,
		couponData: Partial<CreateCouponRequest>
	): Promise<Coupon> {
		return ApiService.patch<Coupon, Partial<CreateCouponRequest>>(
			`${ENDPOINTS.COUPONS}/${id}`,
			couponData
		);
	}

	// Delete coupon
	static async deleteCoupon(id: string): Promise<void> {
		return ApiService.delete<void>(`${ENDPOINTS.COUPONS}/${id}`);
	}

	// Bulk operations
	static async deleteCoupons(couponIds: string[]): Promise<void> {
		return ApiService.delete<void, {couponIds: string[]}>(
			`${ENDPOINTS.COUPONS}/bulk-delete`,
			{couponIds}
		);
	}

	// Get active coupons
	static async getActiveCoupons(
		params?: GetActiveCouponsRequest
	): Promise<CouponsData> {
		try {
			const response = await ApiService.get<CouponsData>(
				ENDPOINTS.ACTIVE_COUPONS,
				params as Record<string, unknown>
			);
			return response;
		} catch {
			return {
				coupons: [],
			};
		}
	}

	// Validate coupon code
	static async validateCoupon(
		data: ValidateCouponRequest
	): Promise<ValidateCouponResponse> {
		return ApiService.post<ValidateCouponResponse, ValidateCouponRequest>(
			ENDPOINTS.VALIDATE_COUPON,
			data
		);
	}
}

export default CouponService;
