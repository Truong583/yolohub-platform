"use client";

import CartService from "@/services/cart";
import type {AddToCartRequest, UpdateCartItemRequest} from "@/types/cart";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";

// Query keys for cart
export const cartKeys = {
	all: ["cart"] as const,
} as const;

// Hook to get cart
export function useCart(options?: {enabled?: boolean}) {
	return useQuery({
		queryKey: cartKeys.all,
		queryFn: CartService.getCart,
		enabled: options?.enabled ?? true,
	});
}

// Hook to add item to cart
export function useAddToCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: AddToCartRequest) => CartService.addToCart(data),
		onSuccess: () => {
			// Invalidate cart cache to refetch fresh data
			queryClient.invalidateQueries({queryKey: cartKeys.all});
		},
	});
}

// Hook to update cart item
export function useUpdateCartItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateCartItemRequest) =>
			CartService.updateCartItem(data),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: cartKeys.all});
			toast.success("Cart updated!");
		},
		onError: (error) => {
			toast.error(error?.message || "Failed to update cart");
		},
	});
}

// Hook to remove item from cart
export function useRemoveFromCart() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (courseId: string) => CartService.removeFromCart(courseId),
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: cartKeys.all});
			toast.success("Item removed from cart");
		},
		onError: (error) => {
			toast.error(error?.message || "Failed to remove item");
		},
	});
}
