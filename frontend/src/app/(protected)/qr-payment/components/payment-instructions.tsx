"use client";

import {Card, CardContent} from "@/components/ui/card";
import {QRCodeSection} from "./qr-code-section";
import {BankTransferDetails} from "./bank-transfer-details";

interface PaymentInstructionsProps {
	qrCodeUrl: string;
	amount: string;
	orderCode?: string;
	paymentStatus: string;
}

export function PaymentInstructions({
	qrCodeUrl,
	amount,
	orderCode,
	paymentStatus,
}: PaymentInstructionsProps) {
	return (
		<Card className="mb-4 sm:mb-6">
			<CardContent className="p-4 sm:p-6">
				<h2 className="text-base sm:text-lg md:text-xl font-semibold text-center mb-4 sm:mb-6 text-gray-800">
					Bank Transfer Payment Instructions
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
					{/* Method 1: QR Code */}
					<QRCodeSection
						qrCodeUrl={qrCodeUrl}
						orderCode={orderCode}
						paymentStatus={paymentStatus}
					/>

					{/* Method 2: Manual Transfer */}
					<BankTransferDetails amount={amount} orderCode={orderCode} />
				</div>
			</CardContent>
		</Card>
	);
}
