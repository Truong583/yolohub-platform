"use client";

import {Button} from "@/components/ui/button";
import {Download} from "lucide-react";
import Image from "next/image";
import {toast} from "sonner";

interface QRCodeSectionProps {
	qrCodeUrl: string;
	orderCode?: string;
	paymentStatus: string;
}

export function QRCodeSection({
	qrCodeUrl,
	orderCode,
	paymentStatus,
}: QRCodeSectionProps) {
	function downloadQR() {
		const link = document.createElement("a");
		link.href = qrCodeUrl;
		link.download = `QR-${orderCode}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Downloading QR code...");
	}

	return (
		<div className="text-center">
			<h3 className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base text-gray-700">
				Method 1: Open banking app and scan QR code
			</h3>

			{/* QR Code */}
			<div className="relative inline-block">
				<div className="bg-white w-64 h-64 sm:w-80 sm:h-80 p-3 sm:p-4 rounded-lg border-gray-200 shadow-sm relative">
					<div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-2 sm:border-l-4 border-t-2 sm:border-t-4 border-blue-500 z-10"></div>
					<div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-2 sm:border-r-4 border-t-2 sm:border-t-4 border-blue-500 z-10"></div>
					<div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-2 sm:border-l-4 border-b-2 sm:border-b-4 border-blue-500 z-10"></div>
					<div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-2 sm:border-r-4 border-b-2 sm:border-b-4 border-blue-500 z-10"></div>
					<Image
						src={qrCodeUrl}
						alt="Payment QR Code"
						width={300}
						height={300}
						className="mx-auto"
						sizes="(max-width: 640px) 228px, 284px"
					/>
					<div className="absolute inset-0 overflow-hidden pointer-events-none">
						<div className="absolute w-full h-16 sm:h-20 bg-gradient-to-b from-blue-100/30 to-blue-400/90 qr-scan-animation"></div>
					</div>
				</div>

				<Button
					onClick={downloadQR}
					variant="outline"
					className="mt-3 sm:mt-4 w-full h-9 sm:h-10 text-xs sm:text-sm"
				>
					<Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
					Download QR
				</Button>
			</div>

			<div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
				<div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2">
					<span>Status: {paymentStatus}</span>
					<div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				</div>
			</div>
		</div>
	);
}
