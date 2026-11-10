"use client";
import {InvalidOrderError} from "./components/invalid-order-error";
import {CheckoutContainer} from "./components/checkout-container";
import {useSearchParams} from "next/navigation";

function StripeCheckoutPage() {
	const searchParams = useSearchParams();
	const orderId = searchParams.get("orderid");

	// Validate orderId exists
	if (!orderId) {
		return <InvalidOrderError />;
	}

	return <CheckoutContainer orderId={orderId} />;
}

export default StripeCheckoutPage;
