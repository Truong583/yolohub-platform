"use client";

import {useStripe, useElements} from "@stripe/react-stripe-js";
import {useState} from "react";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useConfirmPayment} from "./use-payment";
import {ROUTE_CONFIG} from "@/configs/routes";
import {useQueryClient} from "@tanstack/react-query";
import {cartKeys} from "./use-cart";

export function useStripeCheckout({orderId}: {orderId: string}) {
	const stripe = useStripe();
	const elements = useElements();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [isProcessing, setIsProcessing] = useState(false);

	// Hook to confirm payment with backend
	const {mutate: confirmPaymentWithBackend} = useConfirmPayment();

	const processPayment = async (clientSecret: string) => {
		if (!stripe || !elements) {
			toast.error("Payment system not ready. Please try again.");
			return false;
		}

		setIsProcessing(true);

		try {
			// Trigger form validation and wallet collection
			const {error: submitError} = await elements.submit();
			if (submitError) {
				toast.error(
					submitError.message || "Please complete all required fields"
				);

				return false;
			}

			// Confirm the payment with Stripe
			const {error, paymentIntent} = await stripe.confirmPayment({
				elements,
				clientSecret,
				confirmParams: {
					return_url: `${window.location.origin}/${ROUTE_CONFIG.PROFILE.MY_ORDERS}`,
				},
				redirect: "if_required",
			});

			if (error) {
				let errorMessage = "Payment failed";
				if (error.type === "card_error" || error.type === "validation_error") {
					errorMessage = error.message || "Payment failed";
				} else {
					errorMessage = "An unexpected error occurred";
				}

				toast.error(errorMessage);

				return false;
			} else if (paymentIntent && paymentIntent.status === "succeeded") {
				// Confirm payment with backend
				confirmPaymentWithBackend(
					{
						paymentIntentId: paymentIntent.id,
						orderId,
					},
					{
						onSuccess: () => {
							toast.success("Payment confirmed successfully!");

							// Refresh cart data after successful payment
							queryClient.invalidateQueries({queryKey: cartKeys.all});

							// Redirect to my orders page
							router.push(ROUTE_CONFIG.PROFILE.MY_ORDERS);
						},
						onError: () => {
							toast.error(
								"Payment processed but confirmation failed. Please contact support."
							);
						},
					}
				);

				return true;
			}
		} catch {
			toast.error("Payment failed. Please try again.");
			return false;
		} finally {
			setIsProcessing(false);
		}

		return false;
	};

	return {
		processPayment,
		isProcessing,
	};
}
