"use client";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {AlertCircle} from "lucide-react";
import {useRouter} from "next/navigation";

export function InvalidOrderError() {
	const router = useRouter();

	return (
		<div className="min-h-screen bg-gray-50 py-6 sm:py-8 flex items-center justify-center px-4">
			<Card className="max-w-md w-full">
				<CardContent className="p-6 sm:p-8 text-center">
					<AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
					<h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
						Invalid Order
					</h2>
					<p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
						The order you&apos;re trying to access is not valid or doesn&apos;t
						exist.
					</p>
					<Button
						onClick={() => router.push("/cart")}
						className="w-full h-10 sm:h-11 text-sm sm:text-base"
						variant="outline"
					>
						Back to Cart
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
