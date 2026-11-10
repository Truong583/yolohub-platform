import ApiService from "@/lib/api-service";

export interface CreatePaymentIntentRequest {
	orderId: string;
	currency?: string;
}

export interface CreatePaymentIntentResponse {
	clientSecret: string;
	paymentIntentId: string;
	orderId: string;
	amount: number;
	currency: string;
}

export interface ConfirmPaymentRequest {
	paymentIntentId: string;
	orderId?: string;
}

export interface ConfirmPaymentResponse {
	success: boolean;
	orderId: string;
	status: string;
	message?: string;
}

export class PaymentService {
	/**
	 * Create a payment intent for Stripe checkout
	 * Backend handles amount calculation based on orderId
	 */
	static async createPaymentIntent(
		data: CreatePaymentIntentRequest
	): Promise<CreatePaymentIntentResponse> {
		return ApiService.post<CreatePaymentIntentResponse>(
			"/payment/create-payment-intent",
			{
				orderId: data.orderId,
				currency: data.currency || "vnd",
			}
		);
	}

	/**
	 * Confirm payment with backend after successful Stripe confirmation
	 */
	static async confirmPayment(
		data: ConfirmPaymentRequest
	): Promise<ConfirmPaymentResponse> {
		return ApiService.post<ConfirmPaymentResponse>("/payment/confirm-payment", {
			paymentIntentId: data.paymentIntentId,
			orderId: data.orderId,
		});
	}
}
