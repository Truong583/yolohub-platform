"use client";

import * as React from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import slugify from "slugify";

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {ImageUpload} from "@/components/ui/image-upload-simple";
import Editor from "@/components/tiptap/editor";
import Toolbar from "@/components/tiptap/toolbar";

import {IBlog, BlogStatus} from "@/types/blog";
import {useCreateBlog, useUpdateBlog} from "@/hooks/use-blogs";
import {useAllCategories} from "@/hooks/use-categories";
import {blogSchema, BlogSchema} from "@/validators/blog.validator";
import {toast} from "sonner";
import {MdAdd, MdEdit} from "react-icons/md";
import {Calendar as CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import dayjs from "dayjs";

interface BlogsActionDialogProps {
	mode?: "create" | "edit";
	blog?: IBlog;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const BlogsActionDialog = ({
	mode = "create",
	blog,
	open,
	onOpenChange,
}: BlogsActionDialogProps) => {
	const createBlogMutation = useCreateBlog();
	const updateBlogMutation = useUpdateBlog();

	// Fetch all categories from API (for dropdown)
	const {data: categories, isLoading: categoriesLoading} = useAllCategories();

	// Track if slug was manually edited
	const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false);

	const defaultValues = React.useMemo(
		() => ({
			title: "",
			slug: "",
			content: "",
			excerpt: "",
			thumbnail: "",
			status: BlogStatus.DRAFT,
			publishedAt: new Date(),
			categoryId: "",
		}),
		[]
	);

	const form = useForm<BlogSchema>({
		resolver: yupResolver(blogSchema),
		defaultValues,
		mode: "onChange",
	});

	const {
		handleSubmit,
		formState: {isSubmitting},
		reset,
		watch,
		setValue,
	} = form;

	// Watch title field for auto-slug generation
	const titleValue = watch("title");
	const statusValue = watch("status");

	// Auto-generate slug from title
	React.useEffect(() => {
		if (titleValue && !isSlugManuallyEdited) {
			const generatedSlug = slugify(titleValue, {
				lower: true,
				strict: true,
				remove: /[*+~.()'"!:@]/g,
			});
			setValue("slug", generatedSlug, {shouldValidate: true});
		}
	}, [titleValue, isSlugManuallyEdited, setValue]);

	// Reset slug manual edit state when dialog opens
	React.useEffect(() => {
		if (open) {
			setIsSlugManuallyEdited(mode === "edit" && !!blog?.slug);
		}
	}, [open, mode, blog?.slug]);

	React.useEffect(() => {
		if (open && blog) {
			const formDefaults = {
				title: blog?.title || "",
				slug: blog?.slug || "",
				content: blog?.content || "",
				excerpt: blog?.excerpt || "",
				thumbnail: blog?.thumbnail || "",
				status: blog?.status || BlogStatus.DRAFT,
				publishedAt: blog?.publishedAt
					? new Date(blog.publishedAt)
					: new Date(), // Default to current date if not set
				categoryId: blog?.category?._id || blog?.categoryIds?.[0] || "", // Use new structure or fallback to old
			};

			reset(formDefaults);
		}
	}, [open, blog, reset]);

	const onSubmit = async (data: BlogSchema) => {
		const blogData = {
			...data,
			publishedAt: data.publishedAt.toISOString(), // Always include publishedAt since it's now required
			// Convert empty string to undefined for thumbnail
			thumbnail:
				data.thumbnail && data.thumbnail !== "" ? data.thumbnail : undefined,
		};

		if (mode === "create") {
			await createBlogMutation.mutateAsync(blogData);
			toast.success("Blog created successfully!");
		} else if (blog) {
			await updateBlogMutation.mutateAsync({
				id: blog._id,
				...blogData,
			});
			toast.success("Blog updated successfully!");
		}

		onOpenChange(false);
	};

	const handleCategoryChange = (categoryId: string) => {
		setValue("categoryId", categoryId, {shouldValidate: true});
	};

	const title = mode === "create" ? "Create Blog" : "Edit Blog";
	const description =
		mode === "create"
			? "Add a new blog post to the platform."
			: "Update blog post information and content.";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[1200px] h-[90vh] flex flex-col p-0">
				<DialogHeader className="flex-shrink-0 px-6 pt-6 pb-2 border-b">
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
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="flex flex-col flex-1 min-h-0"
					>
						{/* Scrollable Content Area */}
						<div className="flex-1 overflow-y-auto px-6 py-4">
							<div className="space-y-6">
								{/* Basic Information Section */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
										Basic Information
									</h3>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
										<FormField
											control={form.control}
											name="title"
											render={({field}) => (
												<FormItem>
													<FormLabel>
														Title <span className="text-red-500">*</span>
													</FormLabel>
													<FormControl>
														<Input {...field} placeholder="Blog title" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

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
															{...field}
															placeholder="blog-slug"
															onChange={(e) => {
																field.onChange(e);
																setIsSlugManuallyEdited(true);
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="status"
											render={({field}) => (
												<FormItem>
													<FormLabel>
														Status <span className="text-red-500">*</span>
													</FormLabel>
													<Select
														value={field.value}
														onValueChange={field.onChange}
													>
														<FormControl>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Select status" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															<SelectItem value={BlogStatus.DRAFT}>
																Draft
															</SelectItem>
															<SelectItem value={BlogStatus.PUBLISHED}>
																Published
															</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										{/* Category Section */}
										<FormField
											control={form.control}
											name="categoryId"
											render={({field}) => (
												<FormItem>
													<FormLabel>
														Category <span className="text-red-500">*</span>
													</FormLabel>
													<Select
														value={field.value}
														onValueChange={(value) => {
															field.onChange(value);
															handleCategoryChange(value);
														}}
													>
														<FormControl>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Select a category" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{categoriesLoading ? (
																<SelectItem value="__loading__" disabled>
																	Loading categories...
																</SelectItem>
															) : categories?.length ? (
																categories.map((category) => (
																	<SelectItem
																		key={category._id}
																		value={category._id}
																	>
																		{category.name}
																	</SelectItem>
																))
															) : (
																<SelectItem value="__no_categories__" disabled>
																	No categories available
																</SelectItem>
															)}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Publishing Date - Required for both DRAFT and PUBLISHED */}
									<FormField
										control={form.control}
										name="publishedAt"
										render={({field}) => (
											<FormItem className="flex flex-col">
												<FormLabel>
													{statusValue === BlogStatus.PUBLISHED
														? "Published Date"
														: "Scheduled Publish Date"}{" "}
													<span className="text-red-500">*</span>
												</FormLabel>
												<Popover modal={true}>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant="outline"
																className={cn(
																	"w-full pl-3 text-left font-normal",
																	!field.value && "text-muted-foreground"
																)}
															>
																{field.value ? (
																	dayjs(field.value).format("MMM D, YYYY")
																) : (
																	<span>Pick a date</span>
																)}
																<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0">
														<Calendar
															mode="single"
															selected={field.value || undefined}
															onSelect={(date) => {
																if (date) {
																	// If selecting a new date, keep current time or set to now
																	const newDate = field.value
																		? new Date(
																				date.getFullYear(),
																				date.getMonth(),
																				date.getDate(),
																				field.value.getHours(),
																				field.value.getMinutes()
																		  )
																		: new Date(
																				date.getFullYear(),
																				date.getMonth(),
																				date.getDate(),
																				new Date().getHours(),
																				new Date().getMinutes()
																		  );
																	field.onChange(newDate);
																} else {
																	field.onChange(null);
																}
															}}
															// Remove date restrictions to allow past and future dates
															// This accommodates both published content and scheduled drafts
															initialFocus
														/>
													</PopoverContent>
												</Popover>
												<div className="text-xs text-muted-foreground">
													{statusValue === BlogStatus.PUBLISHED
														? "When this blog post was published"
														: "When this blog post should be published"}
												</div>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="excerpt"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Excerpt <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														placeholder="Brief description of the blog post"
														className="min-h-[100px]"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Thumbnail Field */}
								<div className="space-y-4">
									<FormField
										control={form.control}
										name="thumbnail"
										render={({field}) => (
											<FormItem>
												<FormLabel>Thumbnail Image</FormLabel>
												<FormControl>
													<ImageUpload
														value={field.value}
														onChange={field.onChange}
														onError={(error) =>
															console.error("Image upload error:", error)
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Content Field */}
								<div className="space-y-4">
									<FormField
										control={form.control}
										name="content"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Content <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<div className="border rounded-md overflow-hidden">
														<Toolbar />
														<Editor
															content={field.value}
															onChange={(content) => field.onChange(content)}
															className="min-h-[400px]"
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>

						{/* Fixed Footer */}
						<DialogFooter className="flex-shrink-0 border-t px-6 py-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isSubmitting}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={
									isSubmitting ||
									createBlogMutation.isPending ||
									updateBlogMutation.isPending
								}
							>
								{isSubmitting ||
								createBlogMutation.isPending ||
								updateBlogMutation.isPending
									? "Saving..."
									: mode === "create"
									? "Create Blog"
									: "Update Blog"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default BlogsActionDialog;
