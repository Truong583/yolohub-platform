"use client";

import {DataTableColumnHeader} from "@/components/table";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
	CourseLevel,
	ICourse,
	getCourseDisplayStatus,
	isCourseActuallyFree,
} from "@/types/course";
import {ColumnDef} from "@tanstack/react-table";
import {BookOpen} from "lucide-react";
import DataTableRowActions from "./data-table-row-actions";
import {formatPrice} from "@/utils/format";

export const columns: ColumnDef<ICourse>[] = [
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
			<DataTableColumnHeader column={column} title="Course" />
		),
		cell: ({row}) => {
			const course = row.original;
			return (
				<div className="flex items-center space-x-3">
					<Avatar className="h-10 w-10">
						{course.image ? (
							<AvatarImage src={course.image} alt={course.title} />
						) : (
							<AvatarFallback className="bg-primary/10">
								<BookOpen className="h-5 w-5 text-primary" />
							</AvatarFallback>
						)}
					</Avatar>
					<div className="min-w-0 flex-1">
						<div className="font-medium text-foreground">{course.title}</div>
						<div className="text-sm text-muted-foreground">/{course.slug}</div>
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
			const course = row.original;
			const displayStatus = getCourseDisplayStatus(course);
			return (
				<Badge
					variant={displayStatus === "published" ? "default" : "secondary"}
				>
					{displayStatus === "published" ? "Published" : "Draft"}
				</Badge>
			);
		},
		filterFn: (row, id, value) => {
			const course = row.original;
			const displayStatus = getCourseDisplayStatus(course);
			return value.includes(displayStatus);
		},
	},
	{
		accessorKey: "isFree",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Type" />
		),
		cell: ({row}) => {
			const course = row.original;
			const isActuallyFree = isCourseActuallyFree(course);
			return (
				<Badge variant={isActuallyFree ? "outline" : "default"}>
					{isActuallyFree ? "Free" : "Paid"}
				</Badge>
			);
		},
		filterFn: (row, id, value) => {
			const course = row.original;
			const isActuallyFree = isCourseActuallyFree(course);
			const courseType = isActuallyFree ? "free" : "paid";
			return value.includes(courseType);
		},
	},
	{
		accessorKey: "author",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Author" />
		),
		cell: ({row}) => {
			const course = row.original;
			return (
				<div className="flex items-center space-x-2">
					<Avatar className="h-8 w-8">
						{course.author?.avatar ? (
							<AvatarImage
								src={course.author.avatar}
								alt={course.author.username}
							/>
						) : (
							<AvatarFallback className="bg-muted">
								{course.author?.username?.charAt(0).toUpperCase()}
							</AvatarFallback>
						)}
					</Avatar>
					<div className="min-w-0">
						<div className="font-medium text-sm">{course.author?.username}</div>
						<div className="text-xs text-muted-foreground truncate">
							{course.author?.email}
						</div>
					</div>
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
			const course = row.original;
			return (
				<Badge variant="outline">
					{course.category?.name || "No Category"}
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
			const level = row.getValue("level") as CourseLevel;
			return (
				<Badge variant="outline">
					{level === CourseLevel.BEGINNER
						? "Beginner"
						: level === CourseLevel.INTERMEDIATE
						? "Intermediate"
						: "Advanced"}
				</Badge>
			);
		},
		filterFn: (row, id, value) => {
			const level = row.getValue(id) as CourseLevel;
			return value.includes(level);
		},
	},
	{
		accessorKey: "price",
		header: ({column}) => (
			<DataTableColumnHeader column={column} title="Price" />
		),
		cell: ({row}) => {
			const course = row.original;
			return (
				<div>
					<div className="font-medium">{formatPrice(course.price)}</div>
					{course.oldPrice && course.oldPrice > course.price && (
						<div className="text-xs text-muted-foreground line-through">
							{formatPrice(course.oldPrice)}
						</div>
					)}
				</div>
			);
		},
	},

	{
		id: "actions",
		cell: ({row}) => <DataTableRowActions row={row} />,
	},
];
