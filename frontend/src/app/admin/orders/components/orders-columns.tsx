"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {DataTableColumnHeader} from "@/components/table/data-table-column-header";
import {IOrder} from "@/types/order";
import {formatPrice, formatDate} from "@/utils/format";
import DataTableRowActions from "./data-table-row-actions";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {User, Package, CreditCard} from "lucide-react";
import {getStatusConfig} from "@/utils/common";

// Table meta interface
interface OrderTableMeta {
	onStatusClick: (order: IOrder) => void;
}

// Payment method labels
const PAYMENT_METHOD_LABELS = {
	stripe: "Stripe",
	bank_transfer: "Bank Transfer",
} as const;

export const columns: ColumnDef<IOrder>[] = [
	// Selection column
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

	// Order Code
	{
		accessorKey: "code",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Order Code" />
		),
		cell: ({row}) => {
			return (
				<div className="flex items-center space-x-2">
					<Package className="h-4 w-4 text-muted-foreground" />
					<span className="font-mono text-sm font-medium">
						#{row.original.code}
					</span>
				</div>
			);
		},
		enableSorting: true,
		enableHiding: false,
	},

	// Customer Info
	{
		accessorKey: "user",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Customer" />
		),
		cell: ({row}) => {
			const user = row.original.user;
			return (
				<div className="flex items-center space-x-2">
					<Avatar className="h-8 w-8">
						<AvatarImage src={user.avatar} alt={user.username} />
						<AvatarFallback>
							<User className="h-4 w-4" />
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="font-medium text-sm">{user.username}</span>
						<span className="text-xs text-muted-foreground">{user.email}</span>
					</div>
				</div>
			);
		},
		enableSorting: false,
	},

	// Order Status
	{
		accessorKey: "status",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Status" />
		),
		cell: ({row, table}) => {
			const status = row.original.status;
			const config = getStatusConfig(status);

			// Access the onStatusClick function from table meta
			const onStatusClick = (table.options.meta as OrderTableMeta)
				?.onStatusClick;

			return (
				<Badge
					className={`rounded-full capitalize border ${config.bgColor} ${config.textColor} ${config.borderColor} ${config.ringColor} focus-visible:outline-none cursor-pointer hover:opacity-80 transition-opacity`}
					onClick={() => onStatusClick?.(row.original)}
				>
					<span
						className={`size-1.5 rounded-full ${config.dotColor}`}
						aria-hidden="true"
					/>
					{config.label}
				</Badge>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.original.status);
		},
		enableSorting: true,
	},

	// Payment Method
	{
		accessorKey: "paymentMethod",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Payment Method" />
		),
		cell: ({row}) => {
			const method = row.original.paymentMethod;
			const label = PAYMENT_METHOD_LABELS[method] || method;

			return (
				<div className="flex items-center space-x-2">
					<CreditCard className="h-4 w-4 text-muted-foreground" />
					<span className="text-sm">{label}</span>
				</div>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.original.paymentMethod);
		},
		enableSorting: true,
	},

	// Total Amount
	{
		accessorKey: "totalAmount",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Total Amount" />
		),
		cell: ({row}) => {
			const amount = row.original.totalAmount;
			return (
				<span className="font-semibold text-green-600">
					{formatPrice(amount)}
				</span>
			);
		},
		enableSorting: true,
	},

	// Number of Items
	{
		accessorKey: "items",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Items" />
		),
		cell: ({row}) => {
			const items = row.original.items;
			return (
				<span className="text-sm text-muted-foreground">
					{items.length} {items.length === 1 ? "item" : "items"}
				</span>
			);
		},
		enableSorting: false,
	},

	// Created Date
	{
		accessorKey: "createdAt",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Created" />
		),
		cell: ({row}) => {
			const date = row.original.createdAt;
			return (
				<div className="text-sm text-muted-foreground">{formatDate(date)}</div>
			);
		},
		enableSorting: true,
	},

	// Actions
	{
		id: "actions",
		header: "Actions",
		cell: ({row}) => <DataTableRowActions row={row} />,
		enableSorting: false,
		enableHiding: false,
	},
];
