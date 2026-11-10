"use client";

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
import {Switch} from "@/components/ui/switch";
import {yupResolver} from "@hookform/resolvers/yup";
import * as React from "react";
import {useForm} from "react-hook-form";

import {useCreateCategory, useUpdateCategory} from "@/hooks/use-categories";
import {ICategory} from "@/types/category";
import {MdAdd, MdEdit} from "react-icons/md";
import {toast} from "sonner";
import {categorySchema, CategorySchema} from "@/validators/category.validator";
import {CategoryStatus} from "@/types/category";
import slugify from "slugify";

interface CategoriesActionDialogProps {
	mode?: "create" | "edit";
	category?: ICategory;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const CategoriesActionDialog = ({
	mode = "create",
	category,
	open,
	onOpenChange,
}: CategoriesActionDialogProps) => {
	// API hooks
	const createCategoryMutation = useCreateCategory();
	const updateCategoryMutation = useUpdateCategory();

	const isLoading =
		createCategoryMutation.isPending || updateCategoryMutation.isPending;

	// Initialize form with default values
	const form = useForm<CategorySchema>({
		resolver: yupResolver(categorySchema),
		defaultValues: {
			name: "",
			slug: "",
			status: CategoryStatus.ACTIVE,
		},
	});

	// Generate slug from name
	const generateSlug = (name: string): string => {
		return slugify(name, {
			lower: true,
			strict: true,
			remove: /[*+~.()'"!:@]/g,
		});
	};

	// Watch name field to auto-generate slug
	const watchName = form.watch("name");
	React.useEffect(() => {
		if (watchName) {
			const slug = generateSlug(watchName);
			form.setValue("slug", slug);
		}
	}, [watchName, mode, form]);

	// Reset form when dialog opens/closes or category changes
	React.useEffect(() => {
		if (open) {
			form.reset({
				name: category?.name || "",
				slug: category?.slug || "",
				status: category?.status ?? CategoryStatus.ACTIVE,
			});
		}
	}, [open, category, form]);

	const onSubmit = async (data: CategorySchema) => {
		if (mode === "create") {
			createCategoryMutation.mutate(
				{
					name: data.name,
					slug: data.slug,
					status: data.status,
				},
				{
					onSuccess: () => {
						toast.success("Category created successfully!");
						onOpenChange(false);
						form.reset();
					},
				}
			);
		} else if (category) {
			updateCategoryMutation.mutate(
				{
					id: category._id,
					name: data.name,
					slug: data.slug,
					status: data.status,
				},
				{
					onSuccess: () => {
						toast.success("Category updated successfully!");
						onOpenChange(false);
						form.reset();
					},
				}
			);
		}
	};

	const title = mode === "create" ? "Create Category" : "Edit Category";
	const description =
		mode === "create"
			? "Add a new category to organize your courses."
			: "Update the category information.";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						{mode === "create" ? (
							<MdAdd className="h-5 w-5" />
						) : (
							<MdEdit className="h-5 w-5" />
						)}
						{title}
					</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid grid-cols-1 gap-4 items-start">
							{/* Category Name */}
							<FormField
								control={form.control}
								name="name"
								render={({field}) => (
									<FormItem>
										<FormLabel>
											Category Name <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter category name"
												{...field}
												disabled={isLoading}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Slug */}
							<FormField
								control={form.control}
								name="slug"
								render={({field}) => (
									<FormItem>
										<FormLabel>
											Slug <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input
												placeholder="category-slug"
												{...field}
												disabled={isLoading}
											/>
										</FormControl>
										<div className="text-xs text-muted-foreground mt-1">
											URL-friendly version of the name (lowercase, hyphens only)
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* Status */}
							<FormField
								control={form.control}
								name="status"
								render={({field}) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel className="text-base">Status</FormLabel>
											<div className="text-sm text-muted-foreground">
												Make this category visible to students
											</div>
										</div>
										<FormControl>
											<Switch
												checked={field.value === CategoryStatus.ACTIVE}
												onCheckedChange={(checked) => {
													field.onChange(
														checked
															? CategoryStatus.ACTIVE
															: CategoryStatus.INACTIVE
													);
												}}
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
								onClick={() => onOpenChange(false)}
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading}>
								{isLoading
									? "Saving..."
									: mode === "create"
									? "Create Category"
									: "Update Category"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default CategoriesActionDialog;
