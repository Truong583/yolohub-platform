export const stripeConfig = {
	publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
	apiVersion: "2024-12-18.acacia" as const,
	currency: "vnd", // Vietnamese Dong for your LMS
	appearance: {
		theme: "stripe" as const,
		variables: {
			colorPrimary: "#3b82f6",
			colorBackground: "#ffffff",
			colorText: "#1f2937",
			colorDanger: "#ef4444",
			fontFamily: '"Inter", system-ui, sans-serif',
			spacingUnit: "4px",
			borderRadius: "8px",
		},
	},
	urls: {
		success:
			process.env.NEXT_PUBLIC_PAYMENT_SUCCESS_URL ||
			`${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
		cancel:
			process.env.NEXT_PUBLIC_PAYMENT_CANCEL_URL ||
			`${process.env.NEXT_PUBLIC_APP_URL}/cart`,
		base: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:4000",
	},
} as const;
