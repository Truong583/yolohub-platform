"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	MdMoreVert,
	MdEdit,
	MdDelete,
	MdVisibility,
	MdPeople,
} from "react-icons/md";

// Mock data - replace with actual data from your API
const courses = [
	{
		id: 1,
		title: "Introduction to React",
		instructor: "John Doe",
		students: 45,
		status: "Published",
		duration: "8 weeks",
		createdDate: "2024-01-15",
	},
	{
		id: 2,
		title: "Advanced JavaScript",
		instructor: "Jane Smith",
		students: 32,
		status: "Draft",
		duration: "12 weeks",
		createdDate: "2024-02-20",
	},
	{
		id: 3,
		title: "Node.js Fundamentals",
		instructor: "Bob Johnson",
		students: 28,
		status: "Published",
		duration: "10 weeks",
		createdDate: "2024-03-10",
	},
	{
		id: 4,
		title: "Database Design",
		instructor: "Alice Brown",
		students: 15,
		status: "Archived",
		duration: "6 weeks",
		createdDate: "2024-03-25",
	},
];

export function CoursesTable() {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Course</TableHead>
						<TableHead>Instructor</TableHead>
						<TableHead>Students</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Duration</TableHead>
						<TableHead>Created</TableHead>
						<TableHead className="w-[70px]">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{courses.map((course) => (
						<TableRow key={course.id}>
							<TableCell>
								<div>
									<div className="font-medium">{course.title}</div>
								</div>
							</TableCell>
							<TableCell>{course.instructor}</TableCell>
							<TableCell>
								<div className="flex items-center gap-1">
									<MdPeople className="h-4 w-4 text-muted-foreground" />
									{course.students}
								</div>
							</TableCell>
							<TableCell>
								<Badge
									variant={
										course.status === "Published"
											? "default"
											: course.status === "Draft"
											? "secondary"
											: "destructive"
									}
								>
									{course.status}
								</Badge>
							</TableCell>
							<TableCell>{course.duration}</TableCell>
							<TableCell>{course.createdDate}</TableCell>
							<TableCell>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon">
											<MdMoreVert className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem>
											<MdVisibility className="mr-2 h-4 w-4" />
											View
										</DropdownMenuItem>
										<DropdownMenuItem>
											<MdEdit className="mr-2 h-4 w-4" />
											Edit
										</DropdownMenuItem>
										<DropdownMenuItem className="text-destructive">
											<MdDelete className="mr-2 h-4 w-4" />
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
