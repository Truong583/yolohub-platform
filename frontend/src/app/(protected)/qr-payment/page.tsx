"use client";

import Loader from "@/components/loader";
import {Button} from "@/components/ui/button";
import {useOrderDetails} from "@/hooks/use-orders";
import {ArrowLeft} from "lucide-react";
import {useRouter, useSearchParams} from "next/navigation";
import {Suspense, useCallback, useEffect, useRef, useState} from "react";
import {toast} from "sonner";
import {PaymentHeader} from "./components/payment-header";
import {PaymentInstructions} from "./components/payment-instructions";
import {SuccessOverlay} from "./components/success-overlay";
import {ROUTE_CONFIG} from "@/configs/routes";
import {useQueryClient} from "@tanstack/react-query";
import {cartKeys} from "@/hooks/use-cart";
import {OrderStatus} from "@/types/order";

function PaymentSuccessPageInner() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [paymentStatus, setPaymentStatus] = useState("Waiting for payment...");
	const [isOrderCompleted, setIsOrderCompleted] = useState(false);
	const [countdown, setCountdown] = useState(5);
	const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

	const orderId = searchParams.get("orderid");

	// Fetch order details dynamically
	const {data: orderDetails, error, refetch} = useOrderDetails(orderId);

	// QR code configuration
	const accountNumber = "SEPTIN7DEV";
	const bankName = "OCB";

	// Dynamic values from order details

	const amount = orderDetails?.totalAmount?.toString();
	// &template=compact
	// QR Code URL with dynamic data
	const qrCodeUrl = `https://qr.sepay.vn/img?acc=${accountNumber}&bank=${bankName}&amount=${
		amount || ""
	}&des=${orderDetails?.code || ""}`;

	// Handle order completion using useCallback to avoid dependency issues
	const handleOrderCompleted = useCallback(() => {
		setIsOrderCompleted(true);
		setPaymentStatus("Payment successful!");
		toast.success("Payment successful! Redirecting...");

		// Stop polling
		if (pollingIntervalRef.current) {
			clearInterval(pollingIntervalRef.current);
		}

		// Refresh cart data after successful payment
		queryClient.invalidateQueries({queryKey: cartKeys.all});

		// Start countdown
		countdownIntervalRef.current = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					// Redirect to my-order page
					router.push(ROUTE_CONFIG.PROFILE.MY_ORDERS);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	}, [router, queryClient]);

	// Polling effect to check order status
	useEffect(() => {
		if (!orderDetails || isOrderCompleted) return;

		// Check initial status
		if (orderDetails.status === OrderStatus.COMPLETED) {
			handleOrderCompleted();
			return;
		}

		// Set up polling every 5 seconds
		pollingIntervalRef.current = setInterval(() => {
			// Refetch order details to check for status updates
			refetch();
		}, 5000);

		return () => {
			if (pollingIntervalRef.current) {
				clearInterval(pollingIntervalRef.current);
			}
		};
	}, [orderDetails, isOrderCompleted, handleOrderCompleted, refetch]);

	// Effect to handle order status changes
	useEffect(() => {
		if (!orderDetails) return;

		if (orderDetails.status === OrderStatus.COMPLETED && !isOrderCompleted) {
			handleOrderCompleted();
		} else if (orderDetails.status === OrderStatus.PENDING) {
			setPaymentStatus("Waiting for payment...");
		} else if (orderDetails.status === OrderStatus.CANCELLED) {
			setPaymentStatus("Order has been cancelled");
		}
	}, [
		orderDetails,
		orderDetails?.status,
		isOrderCompleted,
		handleOrderCompleted,
	]);

	// Cleanup effect
	useEffect(() => {
		return () => {
			if (pollingIntervalRef.current) {
				clearInterval(pollingIntervalRef.current);
			}
			if (countdownIntervalRef.current) {
				clearInterval(countdownIntervalRef.current);
			}
		};
	}, []);

	// Show error state if failed to fetch order
	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 py-6 sm:py-8 flex items-center justify-center px-4">
				<div className="text-center">
					<p className="text-sm sm:text-base text-red-600 mb-3 sm:mb-4">
						Unable to load order information
					</p>
					<Button
						onClick={() => router.push("/")}
						variant="outline"
						className="h-9 sm:h-10 text-xs sm:text-sm"
					>
						<ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
						Return to homepage
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
			{/* Success Overlay */}
			{isOrderCompleted && <SuccessOverlay countdown={countdown} />}

			<div className="max-w-5xl mx-auto px-4 sm:px-6">
				{/* Back Button */}
				<div className="mb-4 sm:mb-6">
					<Button
						onClick={() => router.push("/")}
						variant="outline"
						className="inline-flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm"
						disabled={isOrderCompleted}
					>
						<ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						Go back
					</Button>
				</div>

				{/* Header */}
				<PaymentHeader orderCode={orderDetails?.code} />

				{/* Payment Instructions */}
				<PaymentInstructions
					qrCodeUrl={qrCodeUrl}
					amount={amount || "0"}
					orderCode={orderDetails?.code}
					paymentStatus={paymentStatus}
				/>
			</div>
		</div>
	);
}

export default function PaymentSuccessPage() {
	return (
		<Suspense fallback={<Loader />}>
			<PaymentSuccessPageInner />
		</Suspense>
	);
}
