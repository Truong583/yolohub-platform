"use client";

import * as React from "react";
import {cn} from "@/lib/utils";

interface CircularProgressProps {
	value: number; // 0-100 percentage
	size?: "sm" | "md" | "lg" | "xl";
	thickness?: number;
	color?: "blue" | "orange" | "green" | "red" | "gray";
	showValue?: boolean;
	className?: string;
	children?: React.ReactNode;
}

const sizeMap = {
	sm: {radius: 20, fontSize: "text-xs"},
	md: {radius: 30, fontSize: "text-sm"},
	lg: {radius: 40, fontSize: "text-base"},
	xl: {radius: 50, fontSize: "text-lg"},
};

const colorMap = {
	blue: {
		stroke: "stroke-blue-400",
		background: "stroke-slate-600",
		text: "text-blue-400",
	},
	orange: {
		stroke: "stroke-orange-400",
		background: "stroke-slate-600",
		text: "text-orange-400",
	},
	green: {
		stroke: "stroke-green-400",
		background: "stroke-slate-600",
		text: "text-green-400",
	},
	red: {
		stroke: "stroke-red-400",
		background: "stroke-slate-600",
		text: "text-red-400",
	},
	gray: {
		stroke: "stroke-gray-400",
		background: "stroke-gray-600",
		text: "text-gray-400",
	},
};

export function CircularProgress({
	value,
	size = "md",
	thickness = 4,
	color = "blue",
	showValue = true,
	className,
	children,
}: CircularProgressProps) {
	const {radius, fontSize} = sizeMap[size];
	const {stroke, background, text} = colorMap[color];

	const circumference = 2 * Math.PI * radius;
	const strokeDasharray = circumference;
	const strokeDashoffset = circumference - (value / 100) * circumference;

	const svgSize = (radius + thickness) * 2;

	return (
		<div
			className={cn(
				"relative inline-flex items-center justify-center",
				className
			)}
		>
			<svg
				width={svgSize}
				height={svgSize}
				className="transform -rotate-90"
				viewBox={`0 0 ${svgSize} ${svgSize}`}
			>
				{/* Background circle */}
				<circle
					cx={svgSize / 2}
					cy={svgSize / 2}
					r={radius}
					fill="transparent"
					strokeWidth={thickness}
					className={background}
				/>

				{/* Progress circle */}
				<circle
					cx={svgSize / 2}
					cy={svgSize / 2}
					r={radius}
					fill="transparent"
					strokeWidth={thickness}
					strokeLinecap="round"
					strokeDasharray={strokeDasharray}
					strokeDashoffset={strokeDashoffset}
					className={cn(stroke, "transition-all duration-500 ease-in-out")}
					style={{
						filter: "drop-shadow(0 0 4px rgba(59, 130, 246, 0.3))",
					}}
				/>
			</svg>

			{/* Center content */}
			<div className="absolute inset-0 flex items-center justify-center">
				{children ? (
					children
				) : showValue ? (
					<span className={cn("font-semibold", fontSize, text)}>
						{Math.round(value)}%
					</span>
				) : null}
			</div>
		</div>
	);
}
