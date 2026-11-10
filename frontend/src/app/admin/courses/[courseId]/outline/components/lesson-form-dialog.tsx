"use client";

import {yupResolver} from "@hookform/resolvers/yup";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {
	MdAdd,
	MdDelete,
	MdDescription,
	MdEdit,
	MdHelpOutline,
	MdOutlineSlowMotionVideo,
} from "react-icons/md";
import {toast} from "sonner";
import * as yup from "yup";

import {useCreateLesson, useLesson, useUpdateLesson} from "@/hooks/use-lessons";
import {QuestionType} from "@/types/quiz";
import type {
	ContentType,
	ILessonResource,
	BackendLessonData,
	QuizQuestionForm,
} from "@/types/lesson";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Checkbox} from "@/components/ui/checkbox";
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
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {Textarea} from "@/components/ui/textarea";
import {SimpleTimePicker} from "@/components/ui/simple-time-picker";
import {secondsToTimeString, timeStringToSeconds} from "@/utils/format";

// Backend-aligned types
// Extended lesson type for API responses that may include questions
interface LessonWithQuestions extends BackendLessonData {
	resource?: ILessonResource;
}

// Define the form data interface explicitly for better TypeScript support
interface LessonFormData {
	title: string;
	contentType: ContentType;
	preview: boolean;
	isPublished: boolean;
	duration?: string; // Time string in HH:MM:SS format
	resourceDescription?: string; // Made optional
	quizDescription?: string;
	videoUrl?: string;
	totalAttemptsAllowed?: number;
	passingScorePercentage?: number;
	// Quiz questions - managed separately from validation schema
	questions?: QuizQuestionForm[];
}

const lessonFormSchema: yup.ObjectSchema<LessonFormData> = yup.object({
	title: yup
		.string()
		.required("Title is required")
		.min(1, "Title cannot be empty"),
	contentType: yup
		.mixed<ContentType>()
		.oneOf(["video", "quiz", "article"] as const)
		.required("Content type is required"),
	preview: yup.boolean().default(false),
	isPublished: yup.boolean().default(false),
	// General duration field for all lessons
	duration: yup
		.string()
		.optional()
		.matches(
			/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
			"Invalid time format"
		),
	// Resource fields
	resourceDescription: yup.string().optional(),
	// Quiz specific description
	quizDescription: yup.string().when("contentType", {
		is: "quiz",
		then: (schema) => schema.optional(),
		otherwise: (schema) => schema.optional(),
	}),
	// Video specific
	videoUrl: yup.string().when("contentType", {
		is: "video",
		then: (schema) =>
			schema.url("Please enter a valid URL").required("Video URL is required"),
		otherwise: (schema) => schema.optional(),
	}),
	// Quiz specific
	totalAttemptsAllowed: yup.number().when("contentType", {
		is: "quiz",
		then: (schema) =>
			schema
				.min(1, "Must allow at least 1 attempt")
				.max(10, "Cannot exceed 10 attempts")
				.required("Total attempts is required"),
		otherwise: (schema) => schema.optional(),
	}),
	passingScorePercentage: yup.number().when("contentType", {
		is: "quiz",
		then: (schema) =>
			schema
				.min(1, "Passing score must be at least 1%")
				.max(100, "Passing score cannot exceed 100%")
				.required("Passing score is required"),
		otherwise: (schema) => schema.optional(),
	}),
	// Questions are managed separately, not validated here
	questions: yup.array().optional(),
});

interface LessonFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	lessonId?: string;
	chapterId: string;
	courseId: string;
	onSuccess?: () => void;
}

const getContentTypeIcon = (type: ContentType) => {
	switch (type) {
		case "video":
			return <MdOutlineSlowMotionVideo className="h-4 w-4" />;
		case "article":
			return <MdDescription className="h-4 w-4" />;
		case "quiz":
			return <MdHelpOutline className="h-4 w-4" />;
		default:
			return <MdDescription className="h-4 w-4" />;
	}
};

// Question Editor Component
interface QuestionEditorProps {
	question: QuizQuestionForm;
	onSave: (question: QuizQuestionForm) => void;
	onCancel: () => void;
}

function QuestionEditor({question, onSave, onCancel}: QuestionEditorProps) {
	const [editForm, setEditForm] = useState<QuizQuestionForm>({...question});

	const updateOption = (optionIndex: number, value: string) => {
		const newOptions = [...editForm.options];
		newOptions[optionIndex] = value;
		setEditForm({...editForm, options: newOptions});
	};

	const toggleCorrectAnswer = (optionIndex: number, isChecked: boolean) => {
		let newCorrectAnswers = [...editForm.correctAnswers];

		if (isChecked && !newCorrectAnswers.includes(optionIndex)) {
			if (
				editForm.type === QuestionType.SINGLE_CHOICE ||
				editForm.type === QuestionType.TRUE_FALSE
			) {
				newCorrectAnswers = [optionIndex];
			} else {
				newCorrectAnswers.push(optionIndex);
			}
		} else if (!isChecked) {
			newCorrectAnswers = newCorrectAnswers.filter((i) => i !== optionIndex);
		}

		setEditForm({...editForm, correctAnswers: newCorrectAnswers});
	};

	const addOption = () => {
		if (editForm.options.length < 6) {
			setEditForm({
				...editForm,
				options: [...editForm.options, ""],
			});
		}
	};

	const removeOption = (optionIndex: number) => {
		if (editForm.options.length > 2) {
			const newOptions = editForm.options.filter((_, i) => i !== optionIndex);
			const newCorrectAnswers = editForm.correctAnswers
				.map((i) => (i > optionIndex ? i - 1 : i))
				.filter((i) => i < newOptions.length);

			setEditForm({
				...editForm,
				options: newOptions,
				correctAnswers: newCorrectAnswers,
			});
		}
	};

	const handleSave = () => {
		onSave(editForm);
	};

	return (
		<Card className="border-2 shadow-sm">
			<CardContent className="p-6">
				<div className="pb-3 mb-4 border-b">
					<h4 className="text-xl font-semibold text-gray-900">Edit Question</h4>
				</div>

				<div className="space-y-4">
					{/* Question Text */}
					<div className="space-y-2">
						<Label htmlFor="question" className="text-sm font-medium">
							Question Text
						</Label>
						<Textarea
							id="question"
							value={editForm.question}
							onChange={(e) =>
								setEditForm({...editForm, question: e.target.value})
							}
							placeholder="Enter your question"
							rows={3}
						/>
					</div>

					{/* Question Type and Points */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-sm font-medium">Question Type</Label>
							<Select
								value={editForm.type}
								onValueChange={(value: QuestionType) => {
									const newEditForm = {...editForm, type: value};

									if (value === QuestionType.TRUE_FALSE) {
										newEditForm.options = ["True", "False"];
										newEditForm.correctAnswers = [0];
									} else if (editForm.type === QuestionType.TRUE_FALSE) {
										newEditForm.options = [
											"Option A",
											"Option B",
											"Option C",
											"Option D",
										];
										if (value === QuestionType.SINGLE_CHOICE) {
											newEditForm.correctAnswers = [0];
										} else {
											newEditForm.correctAnswers = [0];
										}
									} else if (value === QuestionType.SINGLE_CHOICE) {
										newEditForm.correctAnswers =
											editForm.correctAnswers.length > 0
												? [editForm.correctAnswers[0]]
												: [0];
									}

									setEditForm(newEditForm);
								}}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="multiple_choice">
										Multiple Choice
									</SelectItem>
									<SelectItem value="single_choice">Single Choice</SelectItem>
									<SelectItem value="true_false">True/False</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="points" className="text-sm font-medium">
								Points
							</Label>
							<Input
								id="points"
								type="number"
								min="1"
								max="100"
								value={editForm.point}
								onChange={(e) =>
									setEditForm({
										...editForm,
										point: parseInt(e.target.value, 10) || 1,
									})
								}
							/>
						</div>
					</div>

					{/* Options */}
					<div className="space-y-2">
						<Label className="text-sm font-medium">Options</Label>
						{editForm.type === QuestionType.MULTIPLE_CHOICE ? (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
								{editForm.options.map((option, optionIndex) => (
									<div
										key={optionIndex}
										className="flex items-center gap-2 p-2 border rounded-md"
									>
										<Checkbox
											checked={editForm.correctAnswers.includes(optionIndex)}
											onCheckedChange={(checked) =>
												toggleCorrectAnswer(optionIndex, checked as boolean)
											}
										/>
										<div className="flex-1">
											<Input
												value={option}
												onChange={(e) =>
													updateOption(optionIndex, e.target.value)
												}
												placeholder={`Option ${optionIndex + 1}`}
											/>
										</div>
										{editForm.options.length > 2 &&
											editForm.type !== QuestionType.TRUE_FALSE && (
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => removeOption(optionIndex)}
													className="text-red-600"
												>
													<MdDelete className="h-3 w-3" />
												</Button>
											)}
									</div>
								))}
							</div>
						) : (
							<RadioGroup
								value={editForm.correctAnswers[0]?.toString()}
								onValueChange={(value: string) => {
									setEditForm({
										...editForm,
										correctAnswers: [parseInt(value, 10)],
									});
								}}
								className="grid grid-cols-1 md:grid-cols-2 gap-2"
							>
								{editForm.options.map((option, optionIndex) => (
									<div
										key={optionIndex}
										className="flex items-center gap-2 p-2 border rounded-md"
									>
										<RadioGroupItem value={optionIndex.toString()} />
										<div className="flex-1">
											<Input
												value={option}
												onChange={(e) =>
													updateOption(optionIndex, e.target.value)
												}
												placeholder={`Option ${optionIndex + 1}`}
											/>
										</div>
										{editForm.options.length > 2 &&
											editForm.type !== QuestionType.TRUE_FALSE && (
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => removeOption(optionIndex)}
													className="text-red-600"
												>
													<MdDelete className="h-3 w-3" />
												</Button>
											)}
									</div>
								))}
							</RadioGroup>
						)}

						{editForm.options.length < 6 &&
							editForm.type !== QuestionType.TRUE_FALSE && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={addOption}
								>
									<MdAdd className="h-3 w-3 mr-2" />
									Add Option
								</Button>
							)}
					</div>

					{/* Explanation */}
					<div className="space-y-2">
						<Label htmlFor="explanation" className="text-sm font-medium">
							Explanation
						</Label>
						<Textarea
							id="explanation"
							value={editForm.explanation}
							onChange={(e) =>
								setEditForm({...editForm, explanation: e.target.value})
							}
							placeholder="Explain the correct answer"
							rows={3}
						/>
					</div>

					<div className="flex gap-3 pt-3 border-t">
						<Button type="button" onClick={handleSave}>
							Save Question
						</Button>
						<Button type="button" variant="outline" onClick={onCancel}>
							Cancel
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

const LessonFormDialog = ({
	open,
	onOpenChange,
	lessonId,
	chapterId,
	courseId,
	onSuccess,
}: LessonFormDialogProps) => {
	const isEditing = !!lessonId;

	// Fetch lesson data when editing (include questions for quiz lessons)
	const {data: lesson, isLoading: isLessonLoading} = useLesson(lessonId || "", {
		includeQuestions: true,
	});

	// Quiz questions state (managed separately from form)
	const [questions, setQuestions] = useState<QuizQuestionForm[]>([]);
	const [editingQuestionIndex, setEditingQuestionIndex] = useState<
		number | null
	>(null);

	// Use mutations directly
	const createLessonMutation = useCreateLesson();
	const updateLessonMutation = useUpdateLesson();
	const isLoading =
		createLessonMutation.isPending ||
		updateLessonMutation.isPending ||
		isLessonLoading;

	const form = useForm<LessonFormData>({
		resolver: yupResolver(lessonFormSchema),
		defaultValues: {
			title: "",
			contentType: "video" as ContentType,
			preview: false,
			isPublished: false,
			duration: "00:00:00",
			resourceDescription: "",
			quizDescription: "",
			videoUrl: "",
			totalAttemptsAllowed: 3,
			passingScorePercentage: 70,
			questions: [],
		},
	});

	const {
		handleSubmit,
		reset,
		watch,
		formState: {isSubmitting},
	} = form;
	const selectedContentType = watch("contentType");

	React.useEffect(() => {
		if (open) {
			if (isEditing && lesson && !isLessonLoading) {
				// Editing mode with loaded lesson data
				reset({
					title: lesson.title,
					contentType: lesson.contentType,
					preview: lesson.preview,
					isPublished: lesson.isPublished,
					duration: secondsToTimeString(lesson.duration || 0),
					resourceDescription: lesson.resource?.description || "",
					quizDescription: lesson.resource?.description || "",
					videoUrl: lesson.resource?.url || "",
					totalAttemptsAllowed: lesson.resource?.totalAttemptsAllowed || 3,
					passingScorePercentage: lesson.resource?.passingScorePercentage || 70,
					questions: [],
				});
				// Load existing questions if any (if available in API response)
				const lessonWithQuestions = lesson as LessonWithQuestions;
				const existingQuestions = lessonWithQuestions.resource?.questions || [];
				setQuestions(
					existingQuestions.map((q, index) => ({
						...q,
						id: q.id || `existing-${index}`,
					}))
				);
				setEditingQuestionIndex(null);
			} else if (!isEditing) {
				// Create mode
				reset({
					title: "",
					contentType: "video" as ContentType,
					preview: false,
					isPublished: false,
					duration: "00:00:00",
					resourceDescription: "",
					quizDescription: "",
					videoUrl: "",
					totalAttemptsAllowed: 3,
					passingScorePercentage: 70,
					questions: [],
				});
				// Reset questions state
				setQuestions([]);
				setEditingQuestionIndex(null);
			}
			// Don't reset if we're in editing mode but still loading lesson data
		}
	}, [open, isEditing, lesson, isLessonLoading, reset]);

	// Quiz questions management functions
	const addNewQuestion = () => {
		const newQuestion: QuizQuestionForm = {
			id: `temp-${Date.now()}`,
			question: "",
			explanation: "",
			type: QuestionType.MULTIPLE_CHOICE,
			options: ["Option A", "Option B", "Option C", "Option D"],
			correctAnswers: [0],
			point: 1,
		};
		setQuestions([...questions, newQuestion]);
		setEditingQuestionIndex(questions.length);
	};

	const editQuestion = (index: number) => {
		setEditingQuestionIndex(index);
	};

	const deleteQuestion = (index: number) => {
		const newQuestions = questions.filter((_, i) => i !== index);
		setQuestions(newQuestions);
		if (editingQuestionIndex === index) {
			setEditingQuestionIndex(null);
		}
	};

	const updateQuestion = (index: number, updatedQuestion: QuizQuestionForm) => {
		const newQuestions = [...questions];
		newQuestions[index] = updatedQuestion;
		setQuestions(newQuestions);
	};

	const handleFormSubmit = (data: LessonFormData) => {
		// Convert duration from HH:MM:SS to seconds for backend
		const durationInSeconds = timeStringToSeconds(data.duration || "00:00:00");

		// Transform form data to backend structure
		const lessonData: BackendLessonData = {
			title: data.title,
			chapterId,
			courseId,
			contentType: data.contentType,
			order: lesson?.order || 0, // Use existing order or 0 for new lessons (backend will handle)
			preview: data.preview,
			isPublished: data.isPublished,
			duration: durationInSeconds, // Backend expects seconds
			resource: {
				description:
					data.contentType === "quiz"
						? data.quizDescription
						: data.resourceDescription,
				...(data.contentType === "video" && {url: data.videoUrl}),
				...(data.contentType === "quiz" && {
					totalAttemptsAllowed: data.totalAttemptsAllowed,
					passingScorePercentage: data.passingScorePercentage,
					questions: questions.map((q) => ({
						question: q.question,
						explanation: q.explanation,
						type: q.type,
						options: q.options,
						correctAnswers: q.correctAnswers,
						point: q.point,
					})),
				}),
			},
		};

		if (isEditing && lesson) {
			lessonData._id = lesson._id;
			lessonData.resourceId = lesson.resourceId;

			updateLessonMutation.mutate(
				{
					id: lesson._id!,
					...lessonData,
				},
				{
					onSuccess: () => {
						toast.success("Lesson updated successfully!");
						onOpenChange(false);
						onSuccess?.();
					},
					onError: (error) => {
						console.error("Error updating lesson:", error);
						toast.error("Failed to update lesson");
					},
				}
			);
		} else {
			createLessonMutation.mutate(lessonData, {
				onSuccess: () => {
					toast.success("Lesson created successfully!");
					onOpenChange(false);
					onSuccess?.();
				},
				onError: (error) => {
					console.error("Error creating lesson:", error);
					toast.error("Failed to create lesson");
				},
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						{isEditing ? (
							<>
								<MdEdit className="h-5 w-5" />
								Edit Lesson
							</>
						) : (
							<>
								<MdAdd className="h-5 w-5" />
								Add New Lesson
							</>
						)}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? "Update the lesson information below."
							: "Create a new lesson for this chapter."}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
						<div className="space-y-4">
							{/* Basic Information */}
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
												placeholder="Enter lesson title"
												disabled={isLoading || isSubmitting}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="contentType"
									render={({field}) => (
										<FormItem>
											<FormLabel>
												Content Type <span className="text-red-500">*</span>
											</FormLabel>
											<Select
												value={field.value}
												onValueChange={field.onChange}
												disabled={isLoading || isSubmitting}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select content type" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{(["video", "article", "quiz"] as const).map(
														(type) => (
															<SelectItem key={type} value={type}>
																<div className="flex items-center gap-2">
																	{getContentTypeIcon(type)}
																	<span className="capitalize">{type}</span>
																</div>
															</SelectItem>
														)
													)}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Duration */}
								<FormField
									control={form.control}
									name="duration"
									render={({field}) => {
										console.log(
											"Rendering duration field with value:",
											field.value
										);
										return (
											<FormItem>
												<FormLabel>Duration</FormLabel>
												<FormControl>
													<SimpleTimePicker
														value={field.value || "00:00:00"}
														onChange={field.onChange}
														disabled={isLoading || isSubmitting}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
							</div>

							{/* Resource Fields */}
							<div className="space-y-4">
								{/* Video specific fields */}
								{selectedContentType === "video" && (
									<FormField
										control={form.control}
										name="videoUrl"
										render={({field}) => (
											<FormItem>
												<FormLabel>
													Video URL <span className="text-red-500">*</span>
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder="https://example.com/video.mp4"
														disabled={isLoading || isSubmitting}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}

								{/* Quiz specific fields */}
								{selectedContentType === "quiz" && (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<FormField
											control={form.control}
											name="totalAttemptsAllowed"
											render={({field}) => (
												<FormItem>
													<FormLabel>
														Max Attempts <span className="text-red-500">*</span>
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															type="number"
															min="1"
															max="10"
															disabled={isLoading || isSubmitting}
															onChange={(e) =>
																field.onChange(parseInt(e.target.value, 10))
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="passingScorePercentage"
											render={({field}) => (
												<FormItem>
													<FormLabel>
														Passing Score (%){" "}
														<span className="text-red-500">*</span>
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															type="number"
															min="1"
															max="100"
															disabled={isLoading || isSubmitting}
															onChange={(e) =>
																field.onChange(parseInt(e.target.value, 10))
															}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								)}

								{selectedContentType === "quiz" && (
									<FormField
										control={form.control}
										name="quizDescription"
										render={({field}) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														placeholder="Enter quiz description"
														rows={3}
														disabled={isLoading || isSubmitting}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}

								{/* Quiz Questions Section */}
								{selectedContentType === "quiz" && (
									<div className="space-y-4">
										<div className="flex items-center justify-between">
											<div>
												<h3 className="text-lg font-medium">
													Questions ({questions.length})
												</h3>
												<p className="text-sm text-gray-500">
													Add questions for your quiz
												</p>
											</div>
											<Button
												type="button"
												variant="outline"
												onClick={addNewQuestion}
												disabled={isLoading || isSubmitting}
											>
												<MdAdd className="h-4 w-4 mr-2" />
												Add Question
											</Button>
										</div>

										{questions.length === 0 ? (
											<div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
												<p>No questions yet. Add your first question!</p>
											</div>
										) : (
											<div className="space-y-3">
												{questions.map((question, index) => (
													<Card key={question.id} className="p-4">
														<div className="flex items-start gap-3">
															<div className="flex-1">
																<div className="flex items-center gap-2 mb-2">
																	<Badge variant="outline">
																		Question {index + 1}
																	</Badge>
																	<Badge
																		variant="secondary"
																		className="capitalize"
																	>
																		{question.type.replace("_", " ")}
																	</Badge>
																	<Badge variant="outline">
																		{question.point} pts
																	</Badge>
																</div>
																<p className="font-medium text-gray-900 mb-2 line-clamp-2">
																	{question.question || "No content yet"}
																</p>
																<div className="text-sm text-gray-600">
																	{question.options.length} options,{" "}
																	{question.correctAnswers.length} correct
																	answers
																</div>
															</div>
															<div className="flex items-center gap-2">
																<Button
																	type="button"
																	variant="outline"
																	size="sm"
																	onClick={() => editQuestion(index)}
																	disabled={isLoading || isSubmitting}
																>
																	<MdEdit className="h-3 w-3" />
																</Button>
																<Button
																	type="button"
																	variant="outline"
																	size="sm"
																	onClick={() => deleteQuestion(index)}
																	disabled={isLoading || isSubmitting}
																	className="text-red-600 hover:text-red-700"
																>
																	<MdDelete className="h-3 w-3" />
																</Button>
															</div>
														</div>
													</Card>
												))}
											</div>
										)}

										{/* Question Editor */}
										{editingQuestionIndex !== null && (
											<QuestionEditor
												question={questions[editingQuestionIndex]}
												onSave={(updatedQuestion: QuizQuestionForm) => {
													updateQuestion(editingQuestionIndex, updatedQuestion);
													setEditingQuestionIndex(null);
												}}
												onCancel={() => setEditingQuestionIndex(null)}
											/>
										)}
									</div>
								)}

								{selectedContentType !== "quiz" && (
									<FormField
										control={form.control}
										name="resourceDescription"
										render={({field}) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Textarea
														{...field}
														placeholder="Enter content description"
														rows={3}
														disabled={isLoading || isSubmitting}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
							</div>

							{/* Settings */}
							<div className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="isPublished"
										render={({field}) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div className="space-y-0.5">
													<FormLabel className="text-base">Published</FormLabel>
													<div className="text-sm text-gray-600">
														Make this lesson visible to students
													</div>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
														disabled={isLoading || isSubmitting}
													/>
												</FormControl>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="preview"
										render={({field}) => (
											<FormItem className="flex items-center justify-between rounded-lg border p-4">
												<div className="space-y-0.5">
													<FormLabel className="text-base">
														Preview Lesson
													</FormLabel>
													<div className="text-sm text-gray-600">
														Allow free access to this lesson as a preview
													</div>
												</div>
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
														disabled={isLoading || isSubmitting}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</div>
							</div>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => onOpenChange(false)}
								disabled={isLoading || isSubmitting}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isLoading || isSubmitting}>
								{isLoading || isSubmitting
									? "Saving..."
									: isEditing
									? "Update Lesson"
									: "Create Lesson"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default LessonFormDialog;
