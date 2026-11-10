"use client";

import Link from "next/link";
import {ShoppingBag, BookOpen, ArrowLeft} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {ROUTE_CONFIG} from "@/configs/routes";

// Empty cart component - Arrow function
const EmptyCart = () => {
	return (
		<div className="max-w-2xl mx-auto">
			<Card className="p-6 sm:p-8 text-center">
				<div className="flex flex-col items-center gap-4 sm:gap-6">
					<div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center">
						<ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" />
					</div>

					<div className="space-y-1.5 sm:space-y-2">
						<h2 className="text-xl sm:text-2xl font-bold">
							Your cart is empty
						</h2>
						<p className="text-muted-foreground max-w-md text-xs sm:text-sm md:text-base px-4 sm:px-0">
							Discover our amazing courses and start your learning journey
							today. Add courses to your cart to continue.
						</p>
					</div>

					<div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-sm">
						<Button
							asChild
							className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
						>
							<Link href={ROUTE_CONFIG.COURSES}>
								<BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
								Browse Courses
							</Link>
						</Button>

						<Button
							variant="outline"
							asChild
							className="flex-1 h-10 sm:h-11 text-sm sm:text-base"
						>
							<Link href={ROUTE_CONFIG.HOME}>
								<ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
								Back to Home
							</Link>
						</Button>
					</div>
				</div>
			</Card>
		</div>
	);
};

export default EmptyCart;
