import {stripeConfig} from "@/lib/config/stripe";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import {ReactNode} from "react";

const stripePromise = loadStripe(stripeConfig.publishableKey);

interface StripeElementsWrapperProps {
	clientSecret: string;
	children: ReactNode;
}

export function StripeElementsWrapper({
	clientSecret,
	children,
}: StripeElementsWrapperProps) {
	return (
		<Elements
			stripe={stripePromise}
			options={{
				clientSecret,
				appearance: stripeConfig.appearance,
			}}
		>
			{children}
		</Elements>
	);
}
