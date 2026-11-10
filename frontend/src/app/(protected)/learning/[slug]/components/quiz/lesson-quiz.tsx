"use client";

import React, {useState, useEffect} from "react";
import QuizOverview from "./quiz-overview";
import QuizHistoryTable from "./quiz-history-table";
import QuizTaking from "./quiz-taking";
import {
	useQuizAttempts,
	useQuizStatus,
	useStartQuizAttempt,
} from "@/hooks/use-quiz";
import {ILesson} from "@/types/lesson";
import Loader from "@/components/loader";

type QuizState = "overview" | "taking";

interface LessonQuizProps {
	lesson: ILesson;
}

const LessonQuiz = ({lesson}: LessonQuizProps) => {
	const [quizState, setQuizState] = useState<QuizState>("overview");
	const [currentAttemptId, setCurrentAttemptId] = useState<string | null>(null);

	// Get quiz ID from lesson resource
	const quizId = lesson.resourceId || lesson.resource?._id || "";

	// Check quiz status to determine initial state
	const {data: quizStatus, isLoading: isStatusLoading} = useQuizStatus(quizId);

	// Fetch quiz attempts using quiz ID
	const {
		data: attemptsData,
		isLoading: isAttemptsLoading,
		refetch: refetchAttempts,
	} = useQuizAttempts(quizId);

	const attempts = attemptsData?.attempts || [];
	const summary = attemptsData?.summary;

	// Quiz attempt mutations
	const startQuizAttempt = useStartQuizAttempt();

	// Set initial state based on quiz status
	useEffect(() => {
		if (quizStatus && !isStatusLoading) {
			if (quizStatus.canContinue && quizStatus.attemptId) {
				setCurrentAttemptId(quizStatus.attemptId);
				setQuizState("taking");
			} else {
				setCurrentAttemptId(null);
				setQuizState("overview");
			}
		}
	}, [quizStatus, isStatusLoading]);

	const handleStartQuiz = async () => {
		const attempt = await startQuizAttempt.mutateAsync(quizId);
		setCurrentAttemptId(attempt._id);
		setQuizState("taking");
	};

	const handleExitQuiz = () => {
		setCurrentAttemptId(null);
		setQuizState("overview");
	};

	const handleQuizSuccess = () => {
		// Clear attempt ID after successful submission
		setCurrentAttemptId(null);
		// Go back to overview to see updated results in history
		setQuizState("overview");
		// Refetch attempts to update the history table
		refetchAttempts();
	};

	const handleViewDetails = (attemptId: string) => {
		console.log("View attempt details:", attemptId);
		// Implementation for viewing attempt details
	};

	// Check if lesson has quiz resource
	if (!lesson.resource) {
		return (
			<div className="flex items-center justify-center h-64 px-4">
				<div className="text-center">
					<div className="text-base sm:text-lg text-gray-600 mb-2">
						This lesson has no quiz
					</div>
				</div>
			</div>
		);
	}

	// Show loading while checking quiz status
	if (isStatusLoading) {
		return <Loader />;
	}

	// Quiz Taking Mode
	if (quizState === "taking") {
		return (
			<QuizTaking
				quizId={quizId}
				attemptId={currentAttemptId}
				quizTitle={lesson.title}
				timeLimit={lesson.resource?.duration}
				startedAt={quizStatus?.startedAt}
				onSuccess={handleQuizSuccess}
				onExit={handleExitQuiz}
			/>
		);
	}

	// Default Overview Mode
	return (
		<div className="w-full h-full">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
				{/* Combined Card for Quiz Overview and History */}
				<div className="bg-white shadow-md sm:shadow-lg border-0 rounded-lg sm:rounded-xl overflow-hidden">
					{/* Quiz Overview Section */}
					<div className="border-b border-gray-100">
						<QuizOverview
							lesson={lesson}
							attempts={attempts}
							summary={summary}
							quizStatus={quizStatus}
							onStartQuiz={handleStartQuiz}
						/>
					</div>

					{/* Quiz History Section */}
					<div className="p-4 sm:p-6">
						<QuizHistoryTable
							attempts={attempts}
							summary={summary}
							isLoading={isAttemptsLoading}
							passingScore={lesson.resource?.passingScorePercentage}
							onRefresh={refetchAttempts}
							onViewDetails={handleViewDetails}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LessonQuiz;
