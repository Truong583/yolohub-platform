"use client";

import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {PartyPopper} from "lucide-react";
import {useRouter} from "next/navigation";
import {ROUTE_CONFIG} from "@/configs/routes";

interface SuccessOverlayProps {
	countdown: number;
}

export function SuccessOverlay({countdown}: SuccessOverlayProps) {
	const router = useRouter();

	return (
		<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4">
			<Card className="max-w-md w-full">
				<CardContent className="p-6 sm:p-8 text-center">
					<div className="mb-4 sm:mb-6">
						<PartyPopper className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-3 sm:mb-4 animate-bounce" />
						<h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-1.5 sm:mb-2">
							Payment Successful!
						</h2>
						<p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
							Your order has been confirmed and is being processed.
						</p>
						<div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
							<p className="text-sm sm:text-base text-green-800">
								Automatically redirecting in{" "}
								<span className="font-bold text-lg sm:text-xl">
									{countdown}
								</span>{" "}
								seconds
							</p>
						</div>
					</div>
					<Button
						onClick={() => router.push(ROUTE_CONFIG.PROFILE.MY_ORDERS)}
						className="w-full bg-green-600 hover:bg-green-700 h-10 sm:h-11 text-sm sm:text-base"
					>
						View Order Now
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
