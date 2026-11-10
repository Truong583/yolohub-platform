import {Button} from "@/components/ui/button";
import {useStripeCheckout} from "@/hooks/use-stripe-checkout";
import {ArrowLeft} from "lucide-react";
import {useRouter} from "next/navigation";
import {OrderSummaryCard} from "./order-summary-card";
import {PaymentFormCard} from "./payment-form-card";

interface OrderItem {
	_id: string;
	title: string;
	thumbnail: string;
	price: number;
	oldPrice?: number;
}

interface OrderDetails {
	code: string;
	items: OrderItem[];
	subTotal: number;
	totalDiscount: number;
	totalAmount: number;
}

interface StripeCheckoutPageProps {
	clientSecret: string;
	orderId: string;
	orderDetails: OrderDetails;
}
const StripeCheckoutForm = ({
	clientSecret,
	orderId,
	orderDetails,
}: StripeCheckoutPageProps) => {
	const router = useRouter();

	const {processPayment, isProcessing} = useStripeCheckout({
		orderId,
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await processPayment(clientSecret);
	};

	return (
		<div className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6">
				{/* Back Button */}
				<div className="mb-4 sm:mb-6">
					<Button
						onClick={() => router.push("/cart")}
						variant="outline"
						className="inline-flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm"
					>
						<ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
						Back to Cart
					</Button>
				</div>

				{/* Two Column Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
					{/* Left Column - Order Summary */}
					<div className="space-y-4 sm:space-y-6">
						<OrderSummaryCard
							code={orderDetails?.code || ""}
							items={orderDetails?.items || []}
							subTotal={orderDetails?.subTotal || 0}
							totalDiscount={orderDetails?.totalDiscount || 0}
							totalAmount={orderDetails?.totalAmount || 0}
						/>
					</div>

					{/* Right Column - Payment Information */}
					<div className="space-y-4 sm:space-y-6">
						<PaymentFormCard
							totalAmount={orderDetails?.totalAmount || 0}
							isProcessing={isProcessing}
							onSubmit={handleSubmit}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default StripeCheckoutForm;
