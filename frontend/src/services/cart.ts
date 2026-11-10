import {ApiService} from "@/lib/api-service";
import type {
	AddToCartRequest,
	Cart,
	CartResponse,
	UpdateCartItemRequest,
} from "@/types/cart";

const ENDPOINTS = {
	CART: "/cart",
	ADD_ITEM: "/cart/add",
	UPDATE_ITEM: "/cart/update",
	REMOVE_ITEM: (courseId: string) => `/cart/items/${courseId}`,
	CLEAR_CART: "/cart/clear",
} as const;

export class CartService {
	// Get cart
	static async getCart(): Promise<Cart> {
		try {
			return await ApiService.get<CartResponse>(ENDPOINTS.CART);
		} catch {
			return {
				_id: "",
				userId: "",
				items: [],
				totalPrice: 0,
				createdAt: "",
				updatedAt: "",
			};
		}
	}

	// Add to cart
	static async addToCart(data: AddToCartRequest): Promise<Cart> {
		return ApiService.post<CartResponse, AddToCartRequest>(
			ENDPOINTS.ADD_ITEM,
			data
		);
	}

	// Update cart item
	static async updateCartItem(data: UpdateCartItemRequest): Promise<Cart> {
		return ApiService.put<CartResponse, UpdateCartItemRequest>(
			ENDPOINTS.UPDATE_ITEM,
			data
		);
	}

	// Remove from cart
	static async removeFromCart(courseId: string): Promise<Cart> {
		return ApiService.delete<CartResponse>(ENDPOINTS.REMOVE_ITEM(courseId));
	}

	// Clear cart
	static async clearCart(): Promise<void> {
		return ApiService.delete<void>(ENDPOINTS.CLEAR_CART);
	}
}

export default CartService;
