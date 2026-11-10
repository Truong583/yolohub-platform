/**
 * Utility functions for formatting data
 */

import dayjs from "dayjs";

export function formatPrice(price: number): string {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(price);
}

/**
 * Format large numbers with k suffix
 */
export const formatStudentCount = (count: number) => {
	if (count >= 1000000) {
		return `${(count / 1000000).toFixed(1)}M`;
	}
	if (count >= 1000) {
		return `${(count / 1000).toFixed(1)}k`;
	}
	return count.toString();
};

/**
 * Format duration from seconds to readable string
 */
export const formatDuration = (seconds: number) => {
	const totalMinutes = Math.round(seconds / 60);

	if (totalMinutes < 60) {
		return `${totalMinutes}m`;
	}

	const hours = Math.floor(totalMinutes / 60);
	const remainingMins = totalMinutes % 60;

	if (remainingMins > 0) {
		return `${hours}h ${remainingMins}m`;
	}
	return `${hours}h`;
};

/**
 * Format date to readable string using dayjs
 */
export const formatLastUpdated = (
	date: Date | string,
	format: string = "MMM YYYY"
) => {
	return dayjs(date).format(format);
};

/**
 * Format date with more options using dayjs
 */
export const formatDate = (
	date: Date | string,
	format: string = "MMM DD, YYYY"
) => {
	return dayjs(date).format(format);
};

/**
 * Format rating with stars
 */
export const formatRating = (rating: number, maxRating: number = 5) => {
	if (rating <= 0) return "0.0";
	if (rating > maxRating) return maxRating.toFixed(1);
	return rating.toFixed(1);
};

// Helper function to convert seconds to HH:MM:SS format
export const secondsToTimeString = (seconds: number = 0): string => {
	const hours = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	return `${hours.toString().padStart(2, "0")}:${mins
		.toString()
		.padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Helper function to convert seconds to MM:SS or HH:MM:SS format (hide hours if zero)
export const secondsToDisplayTime = (seconds: number = 0): string => {
	const hours = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	// If hours is 0, only show MM:SS
	if (hours === 0) {
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	}

	// If hours > 0, show HH:MM:SS
	return `${hours.toString().padStart(2, "0")}:${mins
		.toString()
		.padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Helper function to convert HH:MM:SS format to seconds
export const timeStringToSeconds = (timeString: string): number => {
	if (!timeString) return 0;
	const parts = timeString.split(":");
	if (parts.length !== 3) return 0;
	const [hours, minutes, seconds] = parts.map(Number);
	if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return 0;
	return hours * 3600 + minutes * 60 + seconds;
};
