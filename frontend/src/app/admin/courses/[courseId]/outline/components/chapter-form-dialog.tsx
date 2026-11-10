"use client";

import React from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {toast} from "sonner";
import {MdAdd, MdEdit} from "react-icons/md";

import {Button} from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Switch} from "@/components/ui/switch";
import {PopulatedChapter} from "@/types/chapter";
import {useCreateChapter, useUpdateChapter} from "@/hooks/use-chapters";

const chapterFormSchema = yup.object().shape({
	title: yup
		.string()
		.required("Title is required")
		.min(1, "Title cannot be empty"),
	description: yup.string().default("").optional(),
	isPublished: yup.boolean().default(false),
});

type ChapterFormData = yup.InferType<typeof chapterFormSchema>;

interface ChapterFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	chapter?: PopulatedChapter;
	courseId: string;
}

const ChapterFormDialog = ({
	open,
	onOpenChange,
	chapter,
	courseId,
}: ChapterFormDialogProps) => {
	const isEditing = !!chapter;

	// Use hooks directly in the component
	const createChapterMutation = useCreateChapter();
	const updateChapterMutation = useUpdateChapter();

	const form = useForm<ChapterFormData>({
		resolver: yupResolver(chapterFormSchema),
		defaultValues: {
			title: "",
			description: "",
			isPublished: false,
		},
	});

	const {
		handleSubmit,
		reset,
		formState: {isSubmitting},
	} = form;

	// Determine if the form is loading
	const isLoading =
		createChapterMutation.isPending ||
		updateChapterMutation.isPending ||
		isSubmitting;

	React.useEffect(() => {
		if (open) {
			if (chapter) {
				reset({
					title: chapter.title,
					description: chapter.description,
					isPublished: chapter.isPublished,
				});
			} else {
				reset({
					title: "",
					description: "",
					isPublished: false,
				});
			}
		} else {
			// Reset form when dialog closes to prevent state conflicts
			reset({
				title: "",
				description: "",
				isPublished: false,
			});
		}
	}, [open, chapter, reset]);

	const handleDialogClose = () => {
		// Reset form and clear any pending states
		reset({
			title: "",
			description: "",
			isPublished: false,
		});
		onOpenChange(false);
	};

	const handleFormSubmit = async (data: ChapterFormData) => {
		// Ensure description is never undefined, use empty string instead
		const formData = {
			...data,
			description: data.description || "",
		};

		if (isEditing && chapter) {
			// Update existing chapter
			updateChapterMutation.mutate(
				{
					id: chapter._id,
					...formData,
				},
				{
					onSuccess: () => {
						toast.success("Chapter updated successfully!");
						handleDialogClose();
					},
					onError: () => {
						toast.error("Failed to update chapter");
					},
				}
			);
		} else {
			// Create new chapter
			createChapterMutation.mutate(
				{
					courseId,
					...formData,
				},
				{
					onSuccess: () => {
						toast.success("Chapter created successfully!");
						handleDialogClose();
					},
					onError: () => {
						toast.error("Failed to create chapter");
					},
				}
			);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(dialogOpen) => {
				if (!dialogOpen) {
					handleDialogClose();
				} else {
					onOpenChange(dialogOpen);
				}
			}}
		>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						{isEditing ? (
							<>
								<MdEdit className="h-5 w-5" />
								Edit Chapter
							</>
						) : (
							<>
								<MdAdd className="h-5 w-5" />
								Add New Chapter
							</>
						)}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update the chapter information below."
							: "Create a new chapter for your course."}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="title"
								render={({field}) => (
									<FormItem>
										<FormLabel>
											Title <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Enter chapter title"
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({field}) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												placeholder="Enter chapter description (optional)"
												rows={3}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="isPublished"
								render={({field}) => (
									<FormItem className="flex items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel className="text-base">Published</FormLabel>
											<div className="text-sm text-gray-600">
												Make this chapter visible to students
											</div>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
												disabled={isLoading}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={handleDialogClose}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading
									? isEditing
										? "Updating..."
										: "Creating..."
									: isEditing
									? "Update Chapter"
									: "Create Chapter"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default ChapterFormDialog;
