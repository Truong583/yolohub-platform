import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {QuizService} from "@/services/quiz";
import {
	QuizQuestion,
	QuizAttemptsData,
	QuizAnswerSubmission,
} from "@/types/quiz";

// Query keys
const QUERY_KEYS = {
	QUIZ_BY_LESSON: (lessonId: string) => ["quiz", "lesson", lessonId],
	QUIZ: (quizId: string) => ["quiz", quizId],
	QUIZ_ATTEMPTS: (quizId: string) => ["quiz", "attempts", quizId],
} as const;

// Get quiz by lesson ID hook
export function useQuizByLesson(
	lessonId: string,
	options?: {enabled?: boolean}
) {
	return useQuery({
		queryKey: QUERY_KEYS.QUIZ_BY_LESSON(lessonId),
		queryFn: () => QuizService.getQuizByLesson(lessonId),
		enabled: !!lessonId && (options?.enabled ?? true),
	});
}

// Get quiz by ID hook
export function useQuiz(quizId: string) {
	return useQuery({
		queryKey: QUERY_KEYS.QUIZ(quizId),
		queryFn: () => QuizService.getQuiz(quizId),
		enabled: !!quizId,
	});
}

// Get quiz attempts hook
export function useQuizAttempts(quizId: string) {
	return useQuery<QuizAttemptsData, Error, QuizAttemptsData>({
		queryKey: QUERY_KEYS.QUIZ_ATTEMPTS(quizId),
		queryFn: () => QuizService.getQuizAttempts(quizId),
		enabled: !!quizId,
	});
}

// Get quiz attempts by lesson ID hook
export function useQuizAttemptsByLesson(lessonId: string) {
	return useQuery({
		queryKey: ["quiz", "attempts", "lesson", lessonId],
		queryFn: () => QuizService.getQuizAttemptsByLesson(lessonId),
		enabled: !!lessonId,
	});
}

// Get quiz status hook - check if user has ongoing attempt
export function useQuizStatus(quizId: string) {
	return useQuery({
		queryKey: ["quiz", "status", quizId],
		queryFn: () => QuizService.getQuizStatus(quizId),
		enabled: !!quizId,
	});
}

// Get quiz questions for taking quiz
export function useQuizTakingQuestions(quizId: string) {
	return useQuery({
		queryKey: ["quiz", "taking", "questions", quizId],
		queryFn: () => QuizService.getQuizTakingQuestions(quizId),
		enabled: !!quizId,
	});
}

// Save quiz questions mutation
export function useSaveQuizQuestions() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({questions}: {questions: QuizQuestion[]}) =>
			QuizService.saveQuizQuestions(questions),
		onSuccess: (updatedQuiz) => {
			// Invalidate and refetch quiz queries
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.QUIZ_BY_LESSON(updatedQuiz.lessonId),
			});
			queryClient.setQueryData(QUERY_KEYS.QUIZ(updatedQuiz._id!), updatedQuiz);
			toast.success("Questions saved successfully");
		},
		onError: (error) => {
			console.error("Save quiz questions error:", error);
			toast.error("Failed to save questions");
		},
	});
}

// Update quiz questions mutation
export function useUpdateQuizQuestions() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			quizId,
			questions,
		}: {
			quizId: string;
			questions: QuizQuestion[];
		}) => QuizService.updateQuizQuestions(quizId, questions),
		onSuccess: (updatedQuiz) => {
			// Update cache
			queryClient.setQueryData(QUERY_KEYS.QUIZ(updatedQuiz._id!), updatedQuiz);
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.QUIZ_BY_LESSON(updatedQuiz.lessonId),
			});
			toast.success("Questions updated successfully");
		},
		onError: (error) => {
			console.error("Update quiz questions error:", error);
			toast.error("Failed to update questions");
		},
	});
}

// Delete quiz mutation
export function useDeleteQuiz() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (quizId: string) => QuizService.deleteQuiz(quizId),
		onSuccess: (_, quizId) => {
			// Remove from cache and invalidate related queries
			queryClient.removeQueries({queryKey: QUERY_KEYS.QUIZ(quizId)});
			queryClient.invalidateQueries({queryKey: ["quiz", "lesson"]});
			toast.success("Quiz deleted successfully");
		},
		onError: (error) => {
			console.error("Delete quiz error:", error);
			toast.error("Failed to delete quiz");
		},
	});
}

// Publish quiz mutation
export function usePublishQuiz() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (quizId: string) => QuizService.publishQuiz(quizId),
		onSuccess: (updatedQuiz) => {
			queryClient.setQueryData(QUERY_KEYS.QUIZ(updatedQuiz._id!), updatedQuiz);
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.QUIZ_BY_LESSON(updatedQuiz.lessonId),
			});
			toast.success("Quiz published successfully");
		},
		onError: (error) => {
			console.error("Publish quiz error:", error);
			toast.error("Failed to publish quiz");
		},
	});
}

// Unpublish quiz mutation
export function useUnpublishQuiz() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (quizId: string) => QuizService.unpublishQuiz(quizId),
		onSuccess: (updatedQuiz) => {
			queryClient.setQueryData(QUERY_KEYS.QUIZ(updatedQuiz._id!), updatedQuiz);
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.QUIZ_BY_LESSON(updatedQuiz.lessonId),
			});
			toast.success("Quiz unpublished successfully");
		},
		onError: (error) => {
			console.error("Unpublish quiz error:", error);
			toast.error("Failed to unpublish quiz");
		},
	});
}

// Add question mutation
export function useAddQuestion() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			quizId,
			question,
		}: {
			quizId: string;
			question: Omit<QuizQuestion, "_id">;
		}) => QuizService.addQuestion(quizId, question),
		onSuccess: (_, {quizId}) => {
			queryClient.invalidateQueries({queryKey: QUERY_KEYS.QUIZ(quizId)});
			toast.success("Question added successfully");
		},
		onError: (error) => {
			console.error("Add question error:", error);
			toast.error("Failed to add question");
		},
	});
}

// Update question mutation
export function useUpdateQuestion() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			quizId,
			questionId,
			question,
		}: {
			quizId: string;
			questionId: string;
			question: Omit<QuizQuestion, "_id">;
		}) => QuizService.updateQuestion(quizId, questionId, question),
		onSuccess: (_, {quizId}) => {
			queryClient.invalidateQueries({queryKey: QUERY_KEYS.QUIZ(quizId)});
			toast.success("Question updated successfully");
		},
		onError: (error) => {
			console.error("Update question error:", error);
			toast.error("Failed to update question");
		},
	});
}

// Delete question mutation
export function useDeleteQuestion() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({quizId, questionId}: {quizId: string; questionId: string}) =>
			QuizService.deleteQuestion(quizId, questionId),
		onSuccess: (_, {quizId}) => {
			queryClient.invalidateQueries({queryKey: QUERY_KEYS.QUIZ(quizId)});
			toast.success("Question deleted successfully");
		},
		onError: (error) => {
			console.error("Delete question error:", error);
			toast.error("Failed to delete question");
		},
	});
}

// Reorder questions mutation
export function useReorderQuestions() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			quizId,
			questionIds,
		}: {
			quizId: string;
			questionIds: string[];
		}) => QuizService.reorderQuestions(quizId, questionIds),
		onSuccess: (updatedQuiz) => {
			queryClient.setQueryData(QUERY_KEYS.QUIZ(updatedQuiz._id!), updatedQuiz);
			toast.success("Questions reordered successfully");
		},
		onError: (error) => {
			console.error("Reorder questions error:", error);
			toast.error("Failed to reorder questions");
		},
	});
}

// Start quiz attempt mutation
export function useStartQuizAttempt() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (quizId: string) => QuizService.startQuizAttempt(quizId),
		onSuccess: (attempt, quizId) => {
			// Invalidate quiz status and attempts queries
			queryClient.invalidateQueries({queryKey: ["quiz", "status", quizId]});
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.QUIZ_ATTEMPTS(quizId),
			});
		},
		onError: (error) => {
			toast.error(error.message || "Failed to start quiz attempt");
		},
	});
}

// Submit quiz attempt mutation
export function useSubmitQuizAttempt() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			attemptId,
			answers,
		}: {
			attemptId: string;
			answers: QuizAnswerSubmission[];
		}) => QuizService.submitQuizAttempt(attemptId, answers),
		onSuccess: () => {
			// Invalidate all quiz-related queries to refresh data
			queryClient.invalidateQueries({queryKey: ["quiz", "attempts"]});
			queryClient.invalidateQueries({queryKey: ["quiz", "status"]});
			toast.success("Quiz submitted successfully!");
		},
		onError: (error) => {
			console.error("Submit quiz attempt error:", error);
			toast.error("Failed to submit quiz");
		},
	});
}
