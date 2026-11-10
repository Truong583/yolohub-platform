import {ApiService} from "@/lib/api-service";
import {
	Quiz,
	QuizQuestion,
	QuizAttempt,
	QuizAttemptsData,
	QuizAttemptCreateResponse,
	QuizAttemptSubmitResponse,
	QuizStatusResponse,
	QuizAnswerSubmission,
} from "@/types/quiz";

const ENDPOINTS = {
	QUIZZES: "/quiz-questions",
	QUIZ: (id: string) => `/quiz-questions/${id}`,
	QUIZ_BY_LESSON: (lessonId: string) => `/quiz-questions/lesson/${lessonId}`,
	QUIZ_QUESTIONS: (quizId: string) => `/quiz-questions/${quizId}/questions`,
	QUIZ_QUESTION: (quizId: string, questionId: string) =>
		`/quiz-questions/${quizId}/questions/${questionId}`,
	QUIZ_PUBLISH: (id: string) => `/quiz-questions/${id}/publish`,
	QUIZ_UNPUBLISH: (id: string) => `/quiz-questions/${id}/unpublish`,
	QUIZ_ATTEMPTS: `/quiz-attempts`,
	QUIZ_ATTEMPT: (attemptId: string) => `/quiz-attempts/${attemptId}`,
	QUIZ_STATUS: (quizId: string) => `/quiz-attempts/quiz/${quizId}/status`,
	QUIZ_TAKING_QUESTIONS: (quizId: string) =>
		`/quiz-attempts/quiz/${quizId}/questions`,
} as const;

export class QuizService {
	// Get quiz by lesson
	static async getQuizByLesson(lessonId: string): Promise<Quiz | null> {
		try {
			return await ApiService.get<Quiz>(ENDPOINTS.QUIZ_BY_LESSON(lessonId));
		} catch (error: unknown) {
			if (
				error &&
				typeof error === "object" &&
				"status" in error &&
				error.status === 404
			) {
				return null;
			}
			throw error;
		}
	}

	// Get quiz by ID
	static async getQuiz(quizId: string): Promise<Quiz> {
		return ApiService.get<Quiz>(ENDPOINTS.QUIZ(quizId));
	}

	// Save quiz questions
	static async saveQuizQuestions(questions: QuizQuestion[]): Promise<Quiz> {
		return ApiService.post<Quiz, {questions: QuizQuestion[]}>(
			ENDPOINTS.QUIZZES,
			{questions}
		);
	}

	// Update quiz questions
	static async updateQuizQuestions(
		quizId: string,
		questions: QuizQuestion[]
	): Promise<Quiz> {
		return ApiService.put<Quiz, {questions: QuizQuestion[]}>(
			`${ENDPOINTS.QUIZ(quizId)}/questions`,
			{questions}
		);
	}

	// Delete quiz
	static async deleteQuiz(quizId: string): Promise<void> {
		return ApiService.delete<void>(ENDPOINTS.QUIZ(quizId));
	}

	// Publish quiz
	static async publishQuiz(quizId: string): Promise<Quiz> {
		return ApiService.put<Quiz>(ENDPOINTS.QUIZ_PUBLISH(quizId));
	}

	// Unpublish quiz
	static async unpublishQuiz(quizId: string): Promise<Quiz> {
		return ApiService.put<Quiz>(ENDPOINTS.QUIZ_UNPUBLISH(quizId));
	}

	// Add question
	static async addQuestion(
		quizId: string,
		question: QuizQuestion
	): Promise<QuizQuestion> {
		return ApiService.post<QuizQuestion, QuizQuestion>(
			ENDPOINTS.QUIZ_QUESTIONS(quizId),
			question
		);
	}

	// Update question
	static async updateQuestion(
		quizId: string,
		questionId: string,
		question: QuizQuestion
	): Promise<QuizQuestion> {
		return ApiService.put<QuizQuestion, QuizQuestion>(
			ENDPOINTS.QUIZ_QUESTION(quizId, questionId),
			question
		);
	}

	// Delete question
	static async deleteQuestion(
		quizId: string,
		questionId: string
	): Promise<void> {
		return ApiService.delete<void>(ENDPOINTS.QUIZ_QUESTION(quizId, questionId));
	}

	// Reorder questions
	static async reorderQuestions(
		quizId: string,
		questionIds: string[]
	): Promise<Quiz> {
		return ApiService.put<Quiz, {questionIds: string[]}>(
			`${ENDPOINTS.QUIZ(quizId)}/reorder-questions`,
			{questionIds}
		);
	}

	// Get quiz attempts
	static async getQuizAttempts(quizId: string): Promise<QuizAttemptsData> {
		try {
			return await ApiService.get<QuizAttemptsData>(ENDPOINTS.QUIZ_ATTEMPTS, {
				quizId,
			} as Record<string, unknown>);
		} catch {
			return {
				attempts: [],
				summary: {
					highestScore: 0,
					averageScore: 0,
					passedAttempts: 0,
					totalAttempts: 0,
				},
			};
		}
	}

	// Get quiz attempts by lesson
	static async getQuizAttemptsByLesson(
		lessonId: string
	): Promise<QuizAttempt[]> {
		try {
			return await ApiService.get<QuizAttempt[]>(ENDPOINTS.QUIZ_ATTEMPTS, {
				lessonId,
			} as Record<string, unknown>);
		} catch {
			return [];
		}
	}

	// Get quiz attempt by ID
	static async getQuizAttempt(attemptId: string): Promise<QuizAttempt> {
		return ApiService.get<QuizAttempt>(ENDPOINTS.QUIZ_ATTEMPT(attemptId));
	}

	// Get quiz status
	static async getQuizStatus(quizId: string): Promise<QuizStatusResponse> {
		return ApiService.get<QuizStatusResponse>(ENDPOINTS.QUIZ_STATUS(quizId));
	}

	// Get quiz taking questions
	static async getQuizTakingQuestions(quizId: string): Promise<QuizQuestion[]> {
		try {
			return await ApiService.get<QuizQuestion[]>(
				ENDPOINTS.QUIZ_TAKING_QUESTIONS(quizId)
			);
		} catch {
			return [];
		}
	}

	// Start a new quiz attempt
	static async startQuizAttempt(
		quizId: string
	): Promise<QuizAttemptCreateResponse> {
		return ApiService.post<QuizAttemptCreateResponse, {quizId: string}>(
			`${ENDPOINTS.QUIZ_ATTEMPTS}`,
			{quizId}
		);
	}

	// Submit quiz answers and complete attempt
	static async submitQuizAttempt(
		attemptId: string,
		answers: QuizAnswerSubmission[]
	): Promise<QuizAttemptSubmitResponse> {
		return ApiService.post<
			QuizAttemptSubmitResponse,
			{answers: QuizAnswerSubmission[]}
		>(`${ENDPOINTS.QUIZ_ATTEMPT(attemptId)}/complete`, {answers});
	}
}

export default QuizService;
