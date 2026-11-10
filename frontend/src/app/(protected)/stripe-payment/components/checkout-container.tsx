"use client";

import Loader from "@/components/loader";
import {useOrderDetails} from "@/hooks/use-orders";
import {useCreatePaymentIntent} from "@/hooks/use-payment";
import dynamic from "next/dynamic";
import {useEffect} from "react";
import {InvalidOrderError} from "./invalid-order-error";
import {StripeElementsWrapper} from "./stripe-elements-wrapper";

const StripeCheckoutForm = dynamic(() => import("./stripe-checkout-form"), {
	ssr: false,
});

interface CheckoutContainerProps {
	orderId: string;
}

export function CheckoutContainer({orderId}: CheckoutContainerProps) {
	// Fetch and validate order details first
	const {
		data: orderDetails,
		isLoading: isLoadingOrder,
		error: orderError,
	} = useOrderDetails(orderId);

	// Tanstack Query mutation for creating payment intent
	const {
		mutate: createPaymentIntent,
		data: paymentIntentData,
		isPending: isCreatingPaymentIntent,
	} = useCreatePaymentIntent();

	// Create payment intent only when order is validated
	useEffect(() => {
		if (
			orderId &&
			orderDetails &&
			!paymentIntentData &&
			!isCreatingPaymentIntent
		) {
			createPaymentIntent({
				orderId,
				currency: "vnd",
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [orderId, orderDetails]);

	// Loading state
	if (isLoadingOrder || isCreatingPaymentIntent) {
		return <Loader />;
	}

	// Error state - invalid order
	if (orderError || !orderDetails) {
		return <InvalidOrderError />;
	}

	// Success state - show checkout form
	if (paymentIntentData?.clientSecret) {
		return (
			<StripeElementsWrapper clientSecret={paymentIntentData.clientSecret}>
				<StripeCheckoutForm
					clientSecret={paymentIntentData.clientSecret}
					orderId={orderId}
					orderDetails={orderDetails}
				/>
			</StripeElementsWrapper>
		);
	}

	// Fallback loading state
	return <Loader />;
}
