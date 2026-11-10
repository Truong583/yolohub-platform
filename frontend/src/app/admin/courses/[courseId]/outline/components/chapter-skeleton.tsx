"use client";

import React from "react";
import {Card, CardHeader} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";

const ChapterSkeleton = () => {
	return (
		<Card className="mb-4">
			<CardHeader className="pb-3">
				<div className="flex items-center gap-3">
					<Skeleton className="h-5 w-5" />
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-6 w-8" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-5 w-1/3" />
						<Skeleton className="h-4 w-2/3" />
						<div className="flex gap-4">
							<Skeleton className="h-3 w-20" />
							<Skeleton className="h-3 w-16" />
						</div>
					</div>
					<Skeleton className="h-8 w-24" />
					<Skeleton className="h-8 w-8" />
				</div>
			</CardHeader>
		</Card>
	);
};

export default ChapterSkeleton;
