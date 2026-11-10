"use client";

import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

interface ManualDiscountInputProps {
	manualDiscountCode: string;
	isApplyingDiscount: boolean;
	onManualDiscountCodeChange: (code: string) => void;
	onApplyDiscount: (code: string) => void;
}

// Manual discount input component - Arrow function
const ManualDiscountInput = ({
	manualDiscountCode,
	isApplyingDiscount,
	onManualDiscountCodeChange,
	onApplyDiscount,
}: ManualDiscountInputProps) => {
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			onApplyDiscount(manualDiscountCode);
		}
	};

	return (
		<div>
			<h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
				Enter discount code
			</h3>
			<div className="flex gap-1.5 sm:gap-2">
				<Input
					placeholder="Enter code"
					value={manualDiscountCode}
					onChange={(e) =>
						onManualDiscountCodeChange(e.target.value.toUpperCase())
					}
					className="flex-1 h-9 sm:h-10 text-xs sm:text-sm"
					onKeyPress={handleKeyPress}
				/>
				<Button
					onClick={() => onApplyDiscount(manualDiscountCode)}
					disabled={isApplyingDiscount || !manualDiscountCode.trim()}
					className="h-9 sm:h-10 text-xs sm:text-sm px-3 sm:px-4"
				>
					{isApplyingDiscount ? (
						<Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
					) : (
						"Apply"
					)}
				</Button>
			</div>
		</div>
	);
};

export default ManualDiscountInput;
