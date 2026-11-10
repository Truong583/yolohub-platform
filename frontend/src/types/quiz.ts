// Quiz question types (theo backend model của bạn)
export enum QuestionType {
	MULTIPLE_CHOICE = "multiple_choice",
	TRUE_FALSE = "true_false",
	SINGLE_CHOICE = "single_choice",
}

// Quiz question interface (theo backend model của bạn)
export interface QuizQuestion {
	_id?: string;
	quizId: string;
	question: string;
	explanation: string;
	type: QuestionType;
	options: string[];
	correctAnswers: number[];
	point: number;
}

// Simple quiz interface - chỉ chứa questions vì settings đã có trong lesson
export interface Quiz {
	_id?: string;
	lessonId: string;
	questions: QuizQuestion[];
	createdAt?: string;
	updatedAt?: string;
}

// Quiz attempt interfaces (matching API response)
export interface QuizAttempt {
	_id: string;
	startedAt: string; // ISO date string
	totalQuestions: number;
	correctAnswers: number;
	wrongAnswers: number;
	earnedPoints: number;
	totalPoints: number;
	duration: number; // in seconds
	result: "pass" | "fail";
	status: "completed" | "in_progress" | "abandoned";
	wasAutoCompleted: boolean;
}

export interface QuizAttemptAnswer {
	questionId: string;
	selectedAnswers: number[]; // indices của options được chọn
	isCorrect: boolean;
	pointsEarned: number;
}

// Summary data for overview component
export interface QuizSummary {
	highestScore: number;
	averageScore: number;
	passedAttempts: number;
	totalAttempts: number;
}

// API Response for quiz attempts (direct structure)
export interface QuizAttemptsData {
	attempts: QuizAttempt[];
	summary: QuizSummary;
}

// Full API Response wrapper (if needed)
export interface QuizAttemptsResponse {
	success: boolean;
	message: string;
	data: QuizAttemptsData;
}

// Quiz attempt creation response from backend
export interface QuizAttemptCreateResponse {
	_id: string;
	userId: string;
	quizId: string;
	startedAt: string;
	status: string;
	score: number;
	answers: unknown[];
	createdAt: string;
	updatedAt: string;
	__v: number;
}

// Quiz status response
export interface QuizStatusResponse {
	canContinue: boolean;
	attemptId: string | null;
	startedAt?: string; // ISO date string - when the quiz attempt was started
}

// Quiz attempt submission response from backend
export interface QuizAttemptSubmitResponse {
	score: number;
	totalQuestions: number;
	correctAnswers: number;
	timeSpent: number;
	isPassed: boolean;
	passingScore: number;
	attemptData: QuizAttempt;
}

// Quiz answer format for backend submission
export interface QuizAnswerSubmission {
	questionId: string;
	selectedOptionIndexes: number[]; // Array of selected option indices (for multiple choice support)
}
