"use client";

import {DataTableColumnHeader} from "@/components/table";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {Coupon, DiscountType} from "@/types/coupon";
import {ColumnDef} from "@tanstack/react-table";
import {Tag, Percent, DollarSign, Calendar, Users} from "lucide-react";
import DataTableRowActions from "./data-table-row-actions";
import dayjs from "dayjs";
import {getStatusConfig} from "@/utils/common";
import {formatPrice} from "@/utils/format";

// Helper function to get coupon status
function getCouponStatus(coupon: Coupon): "active" | "expired" | "inactive" {
	if (!coupon.isActive) return "inactive";

	const now = new Date();
	const endDate = coupon.endDate ? new Date(coupon.endDate) : null;

	if (endDate && endDate < now) return "expired";
	return "active";
}

// Helper function to check if coupon has usage limit
function hasUsageLimit(coupon: Coupon): boolean {
	return coupon.maxUses !== undefined && coupon.maxUses > 0;
}

// Status configuration for badges matching orders design system

export const columns: ColumnDef<Coupon>[] = [
	{
		id: "select",
		header: ({table}) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="translate-y-[2px]"
			/>
		),
		cell: ({row}) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="translate-y-[2px]"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "title",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Coupon" />
		),
		cell: ({row}) => {
			const coupon = row.original;
			return (
				<div className="flex items-center space-x-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<Tag className="h-5 w-5 text-primary" />
					</div>
					<div className="min-w-0 flex-1">
						<div className="font-medium text-foreground">{coupon.title}</div>
						<div className="text-sm text-muted-foreground font-mono">
							{coupon.code}
						</div>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "discountType",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Discount" />
		),
		cell: ({row}) => {
			const coupon = row.original;
			const isPercentage = coupon.discountType === DiscountType.PERCENT;
			return (
				<div className="flex items-center space-x-2">
					{isPercentage ? (
						<Percent className="h-4 w-4 text-blue-600" />
					) : (
						<DollarSign className="h-4 w-4 text-green-600" />
					)}
					<div>
						<div className="font-medium">
							{isPercentage
								? `${coupon.discountValue}%`
								: `${coupon.discountValue.toLocaleString()} đ`}
						</div>
						<div className="text-xs text-muted-foreground">
							{isPercentage ? "Percentage" : "Fixed Amount"}
						</div>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({row}) => {
			const coupon = row.original;
			const status = getCouponStatus(coupon);
			const config = getStatusConfig(status);

			return (
				<Badge
					className={`rounded-full capitalize border ${config.bgColor} ${config.textColor} ${config.borderColor} ${config.ringColor} focus-visible:outline-none`}
				>
					<span
						className={`size-1.5 rounded-full ${config.dotColor}`}
						aria-hidden="true"
					/>
					{config.label}
				</Badge>
			);
		},

		enableSorting: true,
	},
	{
		accessorKey: "usage",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Usage" />
		),
		cell: ({row}) => {
			const coupon = row.original;
			const hasLimit = hasUsageLimit(coupon);

			return (
				<div className="flex items-center space-x-2 ">
					<Users className="h-4 w-4 text-muted-foreground" />
					<div className="text-sm">
						<div className="font-medium">
							{coupon.usedCount}
							{hasLimit && ` / ${coupon.maxUses}`}
						</div>
						<div className="text-xs text-muted-foreground">
							{hasLimit ? "Limited" : "Unlimited"}
						</div>
					</div>
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "courseIds",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Applicable Courses" />
		),
		cell: ({row}) => {
			const coupon = row.original;
			const courseCount = coupon.courseIds?.length || 0;

			return (
				<div className="text-sm">
					{courseCount === 0 ? (
						<Badge variant="outline">All Courses</Badge>
					) : (
						<Badge variant="secondary">
							{courseCount} Course{courseCount !== 1 ? "s" : ""}
						</Badge>
					)}
				</div>
			);
		},
		enableSorting: false,
	},
	{
		accessorKey: "minPurchaseAmount",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Min. Purchase" />
		),
		cell: ({row}) => {
			const coupon = row.original;
			return (
				<div className="text-sm font-mono">
					{formatPrice(coupon.minPurchaseAmount || 0)}
				</div>
			);
		},
	},
	{
		accessorKey: "endDate",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Expires" />
		),
		cell: ({row}) => {
			const coupon = row.original;

			if (!coupon.endDate) {
				return (
					<div className="flex items-center space-x-2">
						<Calendar className="h-4 w-4 text-muted-foreground" />
						<span className="text-sm text-muted-foreground">Never</span>
					</div>
				);
			}

			const endDate = new Date(coupon.endDate);
			const isExpired = endDate < new Date();

			return (
				<div className="flex items-center space-x-2">
					<Calendar className="h-4 w-4 text-muted-foreground" />
					<div className="text-sm">
						<div className={`font-medium ${isExpired ? "text-red-600" : ""}`}>
							{dayjs(endDate).format("MMM DD, YYYY")}
						</div>
						<div className="text-xs text-muted-foreground">
							{dayjs(endDate).format("h:mm A")}
						</div>
					</div>
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({row}) => <DataTableRowActions row={row} />,
	},
];
