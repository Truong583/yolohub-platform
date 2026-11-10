"use client";

import {Button} from "@/components/ui/button";
import {Copy} from "lucide-react";
import Image from "next/image";
import {toast} from "sonner";

interface BankTransferDetailsProps {
	amount: string;
	orderCode?: string;
}

export function BankTransferDetails({
	amount,
	orderCode,
}: BankTransferDetailsProps) {
	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		toast.success("Copied!");
	}

	function formatAmount(amount: string) {
		return new Intl.NumberFormat("vi-VN").format(parseInt(amount)) + "đ";
	}

	return (
		<div>
			<h3 className="font-semibold mb-4 sm:mb-6 text-sm sm:text-base text-gray-700">
				Method 2: Manual bank transfer using the following details
			</h3>

			<div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl overflow-hidden shadow-sm">
				{/* Bank Header */}
				<div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
					<div className="flex items-center justify-center gap-2 sm:gap-3">
						{/* OCB Logo */}
						<Image
							src="/images/ocb-icon.png"
							alt="OCB Bank"
							width={40}
							height={40}
							className="w-8 h-8 sm:w-10 sm:h-10"
						/>
					</div>
					<h4 className="text-center font-semibold mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-800">
						OCB Bank
					</h4>
				</div>

				{/* Bank Details */}
				<div className="p-3 sm:p-4">
					<div className="space-y-0">
						{/* Account Holder */}
						<div className="flex justify-between items-center py-2 border-b border-gray-100 gap-2">
							<span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">
								Account holder:
							</span>
							<div className="flex items-center gap-1 sm:gap-2 min-w-0">
								<span className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
									PHAN THANH TIN
								</span>
								<Button
									size="sm"
									variant="ghost"
									onClick={() => copyToClipboard("Phan Thành Tín")}
									className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 flex-shrink-0"
								>
									<Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
								</Button>
							</div>
						</div>

						{/* Account Number */}
						<div className="flex justify-between items-center py-2 border-b border-gray-100 gap-2">
							<span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">
								Account number:
							</span>
							<div className="flex items-center gap-1 sm:gap-2 min-w-0">
								<span className="font-semibold text-xs sm:text-sm text-gray-900">
									0004100035001
								</span>
								<Button
									size="sm"
									variant="ghost"
									onClick={() => copyToClipboard("0004100035001")}
									className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 flex-shrink-0"
								>
									<Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
								</Button>
							</div>
						</div>

						{/* Amount */}
						<div className="flex justify-between items-center py-2 border-b border-gray-100 gap-2">
							<span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">
								Amount:
							</span>
							<div className="flex items-center gap-1 sm:gap-2 min-w-0">
								<span className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
									{formatAmount(amount || "0")}
								</span>
								<Button
									size="sm"
									variant="ghost"
									onClick={() => copyToClipboard(amount || "")}
									className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 flex-shrink-0"
								>
									<Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
								</Button>
							</div>
						</div>

						{/* Transfer Content */}
						<div className="flex justify-between items-center py-2 gap-2">
							<span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0">
								Transfer note:
							</span>
							<div className="flex items-center gap-1 sm:gap-2 min-w-0">
								<span className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
									{orderCode}
								</span>
								<Button
									size="sm"
									variant="ghost"
									onClick={() => copyToClipboard(orderCode || "")}
									className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-gray-100 flex-shrink-0"
								>
									<Copy className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
								</Button>
							</div>
						</div>
					</div>

					{/* Note Section */}
					<div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-amber-50 border border-amber-200 rounded-lg">
						<p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
							<strong>Note:</strong> Please keep the transfer note{" "}
							<span className="font-semibold bg-amber-100 px-1 rounded">
								{orderCode}
							</span>{" "}
							unchanged for automatic payment confirmation
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
