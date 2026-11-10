import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {formatPrice} from "@/utils/format";
import {AddressElement, PaymentElement} from "@stripe/react-stripe-js";
import {CheckCircle, CreditCard, Loader2, Shield} from "lucide-react";

interface PaymentFormCardProps {
	totalAmount: number;
	isProcessing: boolean;
	onSubmit: (event: React.FormEvent) => void;
}

export function PaymentFormCard({
	totalAmount,
	isProcessing,
	onSubmit,
}: PaymentFormCardProps) {
	return (
		<Card className="gap-0">
			<CardHeader className="px-4 sm:px-6 sm:gap-0">
				<CardTitle className="flex items-center space-x-1.5 sm:space-x-2 text-base sm:text-lg">
					<CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
					<span>Complete Your Payment</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
				<form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
					{/* Payment Element */}
					<div className="space-y-1.5 sm:space-y-2">
						<label className="text-xs sm:text-sm font-medium text-gray-700">
							Payment Information
						</label>
						<div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white">
							<PaymentElement
								options={{
									layout: "tabs",
									fields: {
										billingDetails: {
											name: "auto",
											email: "auto",
											phone: "auto",
											address: "never",
										},
									},
								}}
							/>
						</div>
					</div>

					{/* Billing Address */}
					<div className="space-y-1.5 sm:space-y-2">
						<label className="text-xs sm:text-sm font-medium text-gray-700">
							Billing Address
						</label>
						<div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white">
							<AddressElement
								options={{
									mode: "billing",
									allowedCountries: ["US", "CA", "GB", "AU", "VN"],
									fields: {
										phone: "auto",
									},
								}}
							/>
						</div>
					</div>

					{/* Security Info */}
					<div className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-gray-600 bg-blue-50 p-2.5 sm:p-3 rounded-lg">
						<Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
						<span>Your payment information is secure and encrypted</span>
					</div>

					{/* Submit Button */}
					<Button
						type="submit"
						disabled={isProcessing}
						className="w-full h-11 sm:h-12 text-base sm:text-lg font-semibold"
						size="lg"
					>
						{isProcessing ? (
							<>
								<Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 animate-spin" />
								<span className="hidden sm:inline">Processing Payment...</span>
								<span className="sm:hidden">Processing...</span>
							</>
						) : (
							<>
								<CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
								Pay {formatPrice(totalAmount)}
							</>
						)}
					</Button>
				</form>

				{/* Terms */}
				<div className="text-[10px] sm:text-xs text-gray-500 text-center space-y-0.5 sm:space-y-1">
					<p>
						By completing your payment, you agree to our Terms of Service and
						Privacy Policy
					</p>
					<p className="flex items-center justify-center space-x-1">
						<Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
						<span>Secured by Stripe • 30-day money-back guarantee</span>
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
