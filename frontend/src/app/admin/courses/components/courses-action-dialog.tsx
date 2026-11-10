"use client";

import * as React from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useImmer} from "use-immer";
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
import {Label} from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {ICourse, CourseLevel, CourseStatus, CourseInfo} from "@/types/course";

import {useCreateCourse, useUpdateCourse} from "@/hooks/use-courses";
import {useAllCategories} from "@/hooks/use-categories";
import {MdAdd} from "react-icons/md";
import {toast} from "sonner";
import {ImageUpload} from "@/components/ui/image-upload-simple";
import {CourseSchema, courseFormSchema} from "@/validators/course.validator";
import {NumericFormat} from "react-number-format";
import Editor from "@/components/tiptap/editor";
import Toolbar from "@/components/tiptap/toolbar";

export const createEmptyCourseInfo = (): CourseInfo => ({
	requirements: [],
	benefits: [],
	techniques: [],
	documents: [],
	qa: [],
});

// Simplified course validation schema for forms (without info field)

interface CoursesActionDialogProps {
	mode?: "create" | "edit";
	course?: ICourse;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const CoursesActionDialog = ({
	mode = "create",
	course,
	open,
	onOpenChange,
}: CoursesActionDialogProps) => {
	const createCourseMutation = useCreateCourse();
	const updateCourseMutation = useUpdateCourse();

	// Fetch all categories from API (for dropdown)
	const {data: categories, isLoading: categoriesLoading} = useAllCategories();

	const defaultValues = React.useMemo(
		() => ({
			title: "",
			slug: "",
			excerpt: "",
			description: "",
			image: "",
			introUrl: "",
			price: 0,
			oldPrice: 0,
			isFree: false,
			status: CourseStatus.DRAFT,
			categoryId: "",
			level: CourseLevel.BEGINNER,
		}),
		[]
	);

	// Separate state for course info using useImmer
	const [courseInfo, setCourseInfo] = useImmer<CourseInfo>(
		() => course?.info || createEmptyCourseInfo()
	);

	// Track if slug was manually edited
	const [isSlugManuallyEdited, setIsSlugManuallyEdited] = React.useState(false);

	const form = useForm<CourseSchema>({
		resolver: yupResolver(courseFormSchema),
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
	const isFreeValue = watch("isFree");

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

	// Handle free course toggle - reset prices when course is marked as free
	React.useEffect(() => {
		if (isFreeValue) {
			setValue("price", 0, {shouldValidate: true});
			setValue("oldPrice", 0, {shouldValidate: true});
		}
	}, [isFreeValue, setValue]);

	// Reset slug manual edit state when dialog opens
	React.useEffect(() => {
		if (open) {
			setIsSlugManuallyEdited(mode === "edit" && !!course?.slug);
		}
	}, [open, mode, course?.slug]);

	React.useEffect(() => {
		if (open) {
			const formDefaults = {
				title: course?.title || "",
				slug: course?.slug || "",
				excerpt: course?.excerpt || "",
				description: course?.description || "",
				image: course?.image || "",
				introUrl: course?.introUrl || "",
				price: course?.price || 0,
				oldPrice: course?.oldPrice || 0,
				isFree: course?.isFree || false,
				status: course?.status || CourseStatus.DRAFT,
				categoryId: course?.categoryId || "",
				level: course?.level || CourseLevel.BEGINNER,
			};

			reset(formDefaults);
			setCourseInfo(course?.info || createEmptyCourseInfo());
		}
	}, [open, course, reset, setCourseInfo]);

	const onSubmit = async (data: CourseSchema) => {
		const courseData = {
			...data,
			info: courseInfo,
		};

		if (mode === "create") {
			await createCourseMutation.mutateAsync(courseData);
			toast.success("Course created successfully!");
		} else if (course) {
			await updateCourseMutation.mutateAsync({
				id: course._id,
				...courseData,
			});
			toast.success("Course updated successfully!");
		}

		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[900px] h-[90vh] flex flex-col p-0">
				<DialogHeader className="flex-shrink-0 px-6 pt-6 pb-2 border-b">
					<DialogTitle>
						{mode === "create" ? "Create New Course" : "Edit Course"}
					</DialogTitle>
					<DialogDescription>
						{mode === "create"
							? "Add a new course to the platform."
							: "Update course information and settings."}
					</DialogDescription>
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
														<Input {...field} placeholder="Course title" />
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
															placeholder="course-slug"
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
															<SelectItem value={CourseStatus.DRAFT}>
																Draft
															</SelectItem>
															<SelectItem value={CourseStatus.PUBLISHED}>
																Published
															</SelectItem>
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="introUrl"
											render={({field}) => (
												<FormItem>
													<FormLabel>Intro Video URL</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder="https://example.com/intro-video.mp4"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
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
														onValueChange={field.onChange}
													>
														<FormControl>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Select category" />
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

										<FormField
											control={form.control}
											name="level"
											render={({field}) => (
												<FormItem>
													<FormLabel>
														Level <span className="text-red-500">*</span>
													</FormLabel>
													<Select
														value={field.value}
														onValueChange={field.onChange}
													>
														<FormControl>
															<SelectTrigger className="w-full">
																<SelectValue placeholder="Select level" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{Object.values(CourseLevel).map((level) => (
																<SelectItem key={level} value={level}>
																	{level}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									{/* Excerpt Field */}
									<FormField
										control={form.control}
										name="excerpt"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Excerpt{" "}
													<span className="text-gray-500 text-xs font-normal">
														(Short summary, max 300 characters)
													</span>
												</FormLabel>
												<FormControl>
													<textarea
														{...field}
														placeholder="Brief course summary for preview cards and listings..."
														className="w-full min-h-[80px] px-3 py-2 text-sm border border-gray-300 rounded-md    resize-y"
														maxLength={300}
													/>
												</FormControl>
												<div className="flex justify-between items-center">
													<FormMessage />
													<span className="text-xs text-gray-500">
														{field.value?.length || 0}/300
													</span>
												</div>
											</FormItem>
										)}
									/>
								</div>

								{/* Image Field */}
								<div className="space-y-4">
									<FormField
										control={form.control}
										name="image"
										render={({field}) => (
											<FormItem>
												<FormLabel>Image</FormLabel>
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

								{/* Description Field */}
								<div className="space-y-4">
									<FormField
										control={form.control}
										name="description"
										render={({field}) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<div className="border rounded-md overflow-hidden">
														<Toolbar />
														<Editor
															content={field.value}
															onChange={(content) => field.onChange(content)}
															className="min-h-[200px]"
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{/* Pricing Section */}
								<div className="space-y-4">
									<div className="flex items-center justify-between border-b pb-2">
										<h3 className="text-lg font-semibold text-gray-900">
											Pricing
										</h3>
										<div className="flex items-center space-x-6">
											<FormField
												control={form.control}
												name="isFree"
												render={({field}) => (
													<FormItem className="flex items-center space-x-2 m-0">
														<FormControl>
															<Switch
																checked={field.value}
																onCheckedChange={field.onChange}
															/>
														</FormControl>
														<FormLabel className="text-sm font-medium m-0">
															Free Course
														</FormLabel>
													</FormItem>
												)}
											/>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
										<FormField
											control={form.control}
											name="price"
											render={({
												field: {onChange, onBlur, name, value, ref},
											}) => (
												<FormItem>
													<FormLabel>
														Price{" "}
														{!form.watch("isFree") && (
															<span className="text-red-500">*</span>
														)}
													</FormLabel>
													<FormControl>
														<NumericFormat
															name={name}
															value={value}
															onBlur={onBlur}
															getInputRef={ref}
															customInput={Input}
															thousandSeparator=","
															decimalSeparator="."
															suffix=" ₫"
															allowNegative={false}
															placeholder="0 ₫"
															disabled={form.watch("isFree")}
															onValueChange={(values) =>
																onChange(values.floatValue)
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="oldPrice"
											render={({
												field: {onChange, onBlur, name, value, ref},
											}) => (
												<FormItem>
													<FormLabel>Old Price </FormLabel>
													<FormControl>
														<NumericFormat
															name={name}
															value={value}
															onBlur={onBlur}
															getInputRef={ref}
															customInput={Input}
															thousandSeparator=","
															decimalSeparator="."
															suffix=" ₫"
															allowNegative={false}
															placeholder="0 ₫"
															disabled={form.watch("isFree")}
															onValueChange={(values) =>
																onChange(values.floatValue)
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
								{/* Course Details Section */}
								<div className="space-y-4">
									<h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
										Course Details
									</h3>

									{/* Requirements and Benefits */}
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
										{/* Requirements */}
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<Label className="text-sm font-medium text-gray-700">
													Requirements
												</Label>
												<Button
													type="button"
													variant="outline"
													size="sm"
													className="h-8 w-8 p-0 border-dashed hover:border-solid"
													onClick={() =>
														setCourseInfo((draft) => {
															draft.requirements.push("");
														})
													}
												>
													<MdAdd className="h-4 w-4" />
												</Button>
											</div>
											<div className="space-y-2">
												{courseInfo.requirements.map((requirement, index) => (
													<div key={index} className="flex w-full gap-2">
														<Input
															value={requirement}
															onChange={(e) =>
																setCourseInfo((draft) => {
																	draft.requirements[index] = e.target.value;
																})
															}
															placeholder={`Requirement ${index + 1}`}
															className="text-sm"
														/>
														<Button
															type="button"
															variant="outline"
															size="sm"
															className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
															onClick={() =>
																setCourseInfo((draft) => {
																	draft.requirements.splice(index, 1);
																})
															}
														>
															×
														</Button>
													</div>
												))}
												{courseInfo.requirements.length === 0 && (
													<p className="text-sm text-gray-500 italic text-center py-4">
														No requirements added yet
													</p>
												)}
											</div>
										</div>

										{/* Benefits */}
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<Label className="text-sm font-medium text-gray-700">
													Benefits
												</Label>
												<Button
													type="button"
													variant="outline"
													size="sm"
													className="h-8 w-8 p-0 border-dashed hover:border-solid"
													onClick={() =>
														setCourseInfo((draft) => {
															draft.benefits.push("");
														})
													}
												>
													<MdAdd className="h-4 w-4" />
												</Button>
											</div>
											<div className="space-y-2">
												{courseInfo.benefits.map((benefit, index) => (
													<div key={index} className="flex gap-2">
														<Input
															value={benefit}
															onChange={(e) =>
																setCourseInfo((draft) => {
																	draft.benefits[index] = e.target.value;
																})
															}
															placeholder={`Benefit ${index + 1}`}
															className="flex-1 text-sm"
														/>
														<Button
															type="button"
															variant="outline"
															size="sm"
															className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
															onClick={() =>
																setCourseInfo((draft) => {
																	draft.benefits.splice(index, 1);
																})
															}
														>
															×
														</Button>
													</div>
												))}
												{courseInfo.benefits.length === 0 && (
													<p className="text-sm text-gray-500 italic text-center py-4">
														No benefits added yet
													</p>
												)}
											</div>
										</div>
									</div>

									{/* Techniques and Documents */}
									<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
										{/* Techniques */}
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<Label className="text-sm font-medium text-gray-700">
													Techniques
												</Label>
												<Button
													type="button"
													variant="outline"
													size="sm"
													className="h-8 w-8 p-0 border-dashed hover:border-solid"
													onClick={() =>
														setCourseInfo((draft) => {
															draft.techniques.push("");
														})
													}
												>
													<MdAdd className="h-4 w-4" />
												</Button>
											</div>
											<div className="space-y-2">
												{courseInfo.techniques.map((technique, index) => (
													<div key={index} className="flex gap-2">
														<Input
															value={technique}
															onChange={(e) =>
																setCourseInfo((draft) => {
																	draft.techniques[index] = e.target.value;
																})
															}
															placeholder={`Technique ${index + 1}`}
															className="flex-1 text-sm"
														/>
														<Button
															type="button"
															variant="outline"
															size="sm"
															className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
															onClick={() =>
																setCourseInfo((draft) => {
																	draft.techniques.splice(index, 1);
																})
															}
														>
															×
														</Button>
													</div>
												))}
												{courseInfo.techniques.length === 0 && (
													<p className="text-sm text-gray-500 italic text-center py-4">
														No techniques added yet
													</p>
												)}
											</div>
										</div>

										{/* Documents */}
										<div className="space-y-3">
											<div className="flex items-center justify-between">
												<Label className="text-sm font-medium text-gray-700">
													Documents
												</Label>
												<Button
													type="button"
													variant="outline"
													size="sm"
													className="h-8 w-8 p-0 border-dashed hover:border-solid"
													onClick={() =>
														setCourseInfo((draft) => {
															draft.documents.push("");
														})
													}
												>
													<MdAdd className="h-4 w-4" />
												</Button>
											</div>
											<div className="space-y-2">
												{courseInfo.documents.map((document, index) => (
													<div key={index} className="flex gap-2">
														<Input
															value={document}
															onChange={(e) =>
																setCourseInfo((draft) => {
																	draft.documents[index] = e.target.value;
																})
															}
															placeholder={`Document ${index + 1}`}
															className="flex-1 text-sm"
														/>
														<Button
															type="button"
															variant="outline"
															size="sm"
															className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
															onClick={() =>
																setCourseInfo((draft) => {
																	draft.documents.splice(index, 1);
																})
															}
														>
															×
														</Button>
													</div>
												))}
												{courseInfo.documents.length === 0 && (
													<p className="text-sm text-gray-500 italic text-center py-4">
														No documents added yet
													</p>
												)}
											</div>
										</div>
									</div>
								</div>

								{/* Q&A Section */}
								<div className="space-y-4">
									<div className="flex items-center justify-end">
										<Button
											type="button"
											variant="outline"
											size="sm"
											className="h-9 px-3 border-dashed hover:border-solid"
											onClick={() =>
												setCourseInfo((draft) => {
													draft.qa.push({question: "", answer: ""});
												})
											}
										>
											<MdAdd className="h-4 w-4 mr-2" />
											Add Q&A
										</Button>
									</div>

									<div className="space-y-3">
										{courseInfo.qa.map((qaItem, index) => (
											<div
												key={index}
												className="p-4 border rounded-lg bg-gray-50/50 space-y-3"
											>
												<div className="flex justify-between items-center">
													<span className="text-sm font-medium text-gray-600">
														Q&A #{index + 1}
													</span>
													<Button
														type="button"
														variant="outline"
														size="sm"
														className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
														onClick={() =>
															setCourseInfo((draft) => {
																draft.qa.splice(index, 1);
															})
														}
													>
														×
													</Button>
												</div>
												<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
													<div className="space-y-1">
														<Label className="text-xs text-gray-500">
															Question
														</Label>
														<Input
															value={qaItem.question}
															onChange={(e) =>
																setCourseInfo((draft) => {
																	draft.qa[index].question = e.target.value;
																})
															}
															placeholder="Enter question"
															className="text-sm"
														/>
													</div>
													<div className="space-y-1">
														<Label className="text-xs text-gray-500">
															Answer
														</Label>
														<Input
															value={qaItem.answer}
															onChange={(e) =>
																setCourseInfo((draft) => {
																	draft.qa[index].answer = e.target.value;
																})
															}
															placeholder="Enter answer"
															className="text-sm"
														/>
													</div>
												</div>
											</div>
										))}
										{courseInfo.qa.length === 0 && (
											<div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
												<p className="text-sm text-gray-500">
													No Q&A items added yet
												</p>
												<p className="text-xs text-gray-400 mt-1">
													Click &ldquo;Add Q&A&rdquo; to get started
												</p>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* Fixed Footer */}
						<DialogFooter className="flex-shrink-0 border-t px-6 py-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={
									isSubmitting ||
									createCourseMutation.isPending ||
									updateCourseMutation.isPending
								}
							>
								{isSubmitting ||
								createCourseMutation.isPending ||
								updateCourseMutation.isPending
									? "Saving..."
									: mode === "create"
									? "Create Course"
									: "Update Course"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default CoursesActionDialog;
