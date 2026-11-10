export function getPageNumbers(currentPage: number, totalPages: number) {
	const maxVisiblePages = 5; // Maximum number of page buttons to show
	const rangeWithDots = [];

	if (totalPages <= maxVisiblePages) {
		// If total pages is 5 or less, show all pages
		for (let i = 1; i <= totalPages; i++) {
			rangeWithDots.push(i);
		}
	} else {
		// Always show first page
		rangeWithDots.push(1);

		if (currentPage <= 3) {
			// Near the beginning: [1] [2] [3] [4] ... [10]
			for (let i = 2; i <= 4; i++) {
				rangeWithDots.push(i);
			}
			rangeWithDots.push("...", totalPages);
		} else if (currentPage >= totalPages - 2) {
			// Near the end: [1] ... [7] [8] [9] [10]
			rangeWithDots.push("...");
			for (let i = totalPages - 3; i <= totalPages; i++) {
				rangeWithDots.push(i);
			}
		} else {
			// In the middle: [1] ... [4] [5] [6] ... [10]
			rangeWithDots.push("...");
			for (let i = currentPage - 1; i <= currentPage + 1; i++) {
				rangeWithDots.push(i);
			}
			rangeWithDots.push("...", totalPages);
		}
	}

	return rangeWithDots;
}

export const getStatusConfig = (status: string) => {
	switch (status) {
		case "active":
		case "completed":
		case "approved":
		case "published":
			return {
				bgColor: "bg-emerald-50",
				textColor: "text-emerald-700",
				borderColor: "border-emerald-200",
				dotColor: "bg-emerald-600",
				ringColor: "focus-visible:ring-emerald-600/20",
				label: status,
			};
		case "expired":
		case "cancelled":
		case "rejected":
		case "banned":
			return {
				bgColor: "bg-red-50",
				textColor: "text-red-700",
				borderColor: "border-red-200",
				dotColor: "bg-red-600",
				ringColor: "focus-visible:ring-red-600/20",
				label: status,
			};
		case "inactive":
		case "pending":
		case "draft":
			return {
				bgColor: "bg-amber-50",
				textColor: "text-amber-700",
				borderColor: "border-amber-200",
				dotColor: "bg-amber-600",
				ringColor: "focus-visible:ring-amber-600/20",
				label: status,
			};
		default:
			return {
				bgColor: "bg-gray-50",
				textColor: "text-gray-700",
				borderColor: "border-gray-200",
				dotColor: "bg-gray-600",
				ringColor: "focus-visible:ring-gray-600/20",
				label: status,
			};
	}
};
