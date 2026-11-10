"use client";

import {CheckCircle} from "lucide-react";

interface PaymentHeaderProps {
	orderCode?: string;
}

export function PaymentHeader({orderCode}: PaymentHeaderProps) {
	return (
		<div className="text-center mb-6 sm:mb-8">
			<div className="flex items-center justify-center mb-3 sm:mb-4">
				<CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />
			</div>
			<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">
				Order Placed Successfully
			</h1>
			<p className="text-sm sm:text-base text-gray-600">
				Order Code{" "}
				<span className="font-semibold text-blue-600">#{orderCode}</span>
			</p>
		</div>
	);
}
