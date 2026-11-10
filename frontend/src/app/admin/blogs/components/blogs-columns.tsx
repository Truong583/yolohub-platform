"use client";

import {DataTableColumnHeader} from "@/components/table";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {IBlog, BlogStatus, IBlogAuthor, IBlogCategory} from "@/types/blog";
import {ColumnDef} from "@tanstack/react-table";
import {FileText, User, Calendar, Tags} from "lucide-react";
import DataTableRowActions from "./data-table-row-actions";
import {getStatusConfig} from "@/utils/common";
import Image from "next/image";

export const columns: ColumnDef<IBlog>[] = [
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
			<DataTableColumnHeader column={column} title="Blog" />
		),
		cell: ({row}) => {
			const blog = row.original;
			return (
				<div className="flex items-center space-x-3">
					<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
						{blog.thumbnail ? (
							<div className="h-10 w-10 rounded-lg object-cover relative">
								<Image src={blog.thumbnail} alt={blog.title} fill />
							</div>
						) : (
							<FileText className="h-5 w-5 text-primary" />
						)}
					</div>
					<div className="min-w-0 flex-1">
						<div className="font-medium text-foreground truncate max-w-[200px]">
							{blog.title}
						</div>
						<div className="text-sm text-muted-foreground truncate max-w-[200px]">
							/{blog.slug}
						</div>
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "excerpt",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Excerpt" />
		),
		cell: ({row}) => {
			const excerpt = row.getValue("excerpt") as string;
			return (
				<div className="text-sm text-muted-foreground truncate max-w-[300px]">
					{excerpt}
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
			const status = row.getValue("status") as BlogStatus;
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
		accessorKey: "author",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Author" />
		),
		cell: ({row}) => {
			const author = row.getValue("author") as IBlogAuthor;
			return (
				<div className="flex items-center space-x-2 text-sm text-muted-foreground">
					<User className="h-4 w-4" />
					<span>{author?.name || author?.email || "Unknown"}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "category",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Category" />
		),
		cell: ({row}) => {
			const category = row.getValue("category") as IBlogCategory;
			return (
				<div className="flex items-center space-x-2">
					<Tags className="h-4 w-4 text-muted-foreground" />
					<Badge variant="outline" className="font-normal">
						{category?.name || "Uncategorized"}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: "publishedAt",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Published" />
		),
		cell: ({row}) => {
			const publishedAt = row.getValue("publishedAt") as string | null;
			const status = row.getValue("status") as BlogStatus;

			if (status === BlogStatus.DRAFT || !publishedAt) {
				return (
					<div className="text-sm text-muted-foreground">Not published</div>
				);
			}

			const date = new Date(publishedAt);
			return (
				<div className="flex items-center space-x-2 text-sm text-muted-foreground">
					<Calendar className="h-4 w-4" />
					<span>{date.toLocaleDateString()}</span>
				</div>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Created" />
		),
		cell: ({row}) => {
			const date = new Date(row.getValue("createdAt"));
			return (
				<div className="text-sm text-muted-foreground">
					{date.toLocaleDateString()}
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({row}) => <DataTableRowActions row={row} />,
	},
];
