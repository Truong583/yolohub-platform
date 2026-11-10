"use client";

import {Button} from "@/components/ui/button";
import {ArrowLeft, Home} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function Error() {
	const router = useRouter();

	return (
		<div className="h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
			{/* Background decorative elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
				<div className="absolute top-1/3 -left-8 w-96 h-96 bg-gradient-to-br from-orange-400/15 to-red-400/15 rounded-full blur-3xl"></div>
				<div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-gradient-to-br from-red-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
			</div>

			<div className="relative z-10 min-h-screen flex h-full w-full flex-col items-center justify-center gap-2">
				{/* 500 Number */}
				<h1 className="text-[12rem] md:text-[16rem] leading-tight font-bold bg-gradient-to-r from-red-600 via-orange-600 to-red-800 bg-clip-text text-transparent drop-shadow-sm">
					500
				</h1>

				{/* Error Message */}
				<span className="text-2xl md:text-3xl font-medium text-gray-800 mb-2">
					Oops! Something went wrong {"{"}
					<span className="text-red-500">&apos;</span>
					<span className="text-red-500">:</span>
					<span className="text-red-500">)</span>
				</span>

				{/* Description */}
				<p className="text-base md:text-lg text-muted-foreground text-center max-w-md px-4 mb-8">
					We apologize for the inconvenience. <br className="hidden md:block" />
					Please try again later.
				</p>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 mt-6">
					{/* Go Back Button */}
					<Button
						variant="outline"
						onClick={() => router.back()}
						className="relative h-12 px-6 font-semibold transition-all duration-300 group hover:bg-gradient-to-br hover:from-gray-50 hover:via-gray-100/50 hover:to-gray-50 hover:shadow-lg hover:shadow-gray-200/20 rounded-xl border-2 border-gray-200 hover:border-gray-300"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-gray-500/0 to-gray-500/0 group-hover:from-gray-500/5 group-hover:to-gray-500/5 rounded-xl transition-all duration-300"></div>
						<ArrowLeft className="h-4 w-4 mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />
						<span className="relative z-10">Go Back</span>
					</Button>

					{/* Back to Home Button */}
					<Button
						className="bg-gradient-to-r from-red-600 via-red-700 to-orange-600 hover:from-red-700 hover:via-red-800 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-6 rounded-xl font-semibold relative overflow-hidden group border border-transparent hover:border-red-400"
						asChild
					>
						<Link href="/">
							{/* Animated shine effect */}
							<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
							<Home className="h-4 w-4 mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" />
							<span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
								Back to Home
							</span>
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
