"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {DataTableColumnHeader} from "@/components/table";
import {IComment, CommentStatus} from "@/types/comment";
import dayjs from "dayjs";
import DataTableRowActions from "./data-table-row-actions";
import {getStatusConfig} from "@/utils/common";

export const commentsColumns: ColumnDef<IComment>[] = [
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
			/>
		),
		cell: ({row}) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "content",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Content" />
		),
		cell: ({row}) => {
			const content = row.getValue("content") as string;
			// Truncate content but keep HTML
			const truncatedContent =
				content.length > 200 ? content.substring(0, 200) + "..." : content;
			return (
				<div
					className="font-medium line-clamp-3 text-sm leading-relaxed overflow-hidden"
					dangerouslySetInnerHTML={{
						__html: truncatedContent || "No content",
					}}
				/>
			);
		},
		meta: {
			className: "w-[300px] ",
		},
	},
	{
		accessorKey: "user",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Author" />
		),
		cell: ({row}) => {
			const comment = row.original;
			const user = comment.user;
			return (
				<div className="flex flex-col">
					<span className="font-medium">
						{user?.username || "Unknown User"}
					</span>
					<span className="text-xs text-muted-foreground">
						{user?.email || "Unknown Email"}
					</span>
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
			const status = row.getValue("status") as CommentStatus;

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
		accessorKey: "level",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Level" />
		),
		cell: ({row}) => {
			const level = row.getValue("level") as number;
			return (
				<Badge variant="outline">
					{level === 0 ? "Main" : `Reply L${level}`}
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
		cell: ({row}) => {
			return <DataTableRowActions row={row} />;
		},
	},
];
