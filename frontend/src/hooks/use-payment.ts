import {useMutation} from "@tanstack/react-query";
import {PaymentService} from "@/services/payment";
import type {
	CreatePaymentIntentRequest,
	CreatePaymentIntentResponse,
	ConfirmPaymentRequest,
	ConfirmPaymentResponse,
} from "@/services/payment";
import {toast} from "sonner";

// Hook to create payment intent
export function useCreatePaymentIntent() {
	return useMutation<
		CreatePaymentIntentResponse,
		Error,
		CreatePaymentIntentRequest
	>({
		mutationFn: (data: CreatePaymentIntentRequest) =>
			PaymentService.createPaymentIntent(data),
		onError: (error) => {
			toast.error(error.message || "Failed to create payment intent");
		},
	});
}

// Hook to confirm payment with backend
export function useConfirmPayment() {
	return useMutation<ConfirmPaymentResponse, Error, ConfirmPaymentRequest>({
		mutationFn: (data: ConfirmPaymentRequest) =>
			PaymentService.confirmPayment(data),
		onError: (error) => {
			toast.error(error.message || "Failed to confirm payment");
		},
	});
}
