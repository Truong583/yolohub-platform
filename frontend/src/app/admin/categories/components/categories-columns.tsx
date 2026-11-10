"use client";

import {DataTableColumnHeader} from "@/components/table";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {ICategory} from "@/types/category";
import {CategoryStatus} from "@/types/category";
import {ColumnDef} from "@tanstack/react-table";
import {Hash} from "lucide-react";
import DataTableRowActions from "./data-table-row-actions";
import {getStatusConfig} from "@/utils/common";
import dayjs from "dayjs";

export const columns: ColumnDef<ICategory>[] = [
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
		accessorKey: "name",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		cell: ({row}) => {
			const category = row.original;
			return (
				<div className="flex items-center space-x-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						<Hash className="h-5 w-5 text-primary" />
					</div>
					<div className="min-w-0 flex-1">
						<div className="font-medium text-foreground">{category.name}</div>
						<div className="text-sm text-muted-foreground">
							/{category.slug}
						</div>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "slug",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Slug" />
		),
		cell: ({row}) => {
			return (
				<div className="font-mono text-sm text-muted-foreground">
					{row.getValue("slug")}
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
			const status = row.getValue("status") as CategoryStatus;
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
	},
	{
		accessorKey: "createdAt",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Created" />
		),
		cell: ({row}) => {
			const date = row.getValue("createdAt") as string;
			return <div className="text-sm">{dayjs(date).format("DD/MM/YYYY")}</div>;
		},
	},
	{
		id: "actions",
		cell: DataTableRowActions,
	},
];
