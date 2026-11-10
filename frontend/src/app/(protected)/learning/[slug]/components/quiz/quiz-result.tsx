"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {
	MdCheckCircle,
	MdCancel,
	MdRefresh,
	MdArrowBack,
	MdTrendingUp,
	MdAccessTime,
	MdQuestionAnswer,
} from "react-icons/md";
import {secondsToDisplayTime} from "@/utils/format";

interface QuizResultProps {
	score: number; // percentage
	totalQuestions: number;
	correctAnswers: number;
	timeSpent: number; // in minutes
	passingScore: number; // percentage
	isPassed: boolean;
	onRetry?: () => void;
	onBackToOverview?: () => void;
	onViewDetails?: () => void;
}

// Quiz result component - Arrow function
const QuizResult = ({
	score,
	totalQuestions,
	correctAnswers,
	timeSpent,
	passingScore,
	isPassed,
	onRetry,
	onBackToOverview,
	onViewDetails,
}: QuizResultProps) => {
	const incorrectAnswers = totalQuestions - correctAnswers;

	return (
		<div className="w-full h-full bg-gray-50 flex items-center justify-center p-4 sm:p-6">
			<Card className="w-full max-w-2xl">
				<CardContent className="p-4 sm:p-6 md:p-8">
					<div className="text-center space-y-4 sm:space-y-6">
						{/* Result Icon and Status */}
						<div className="space-y-3 sm:space-y-4">
							<div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center">
								{isPassed ? (
									<div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center">
										<MdCheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />
									</div>
								) : (
									<div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center">
										<MdCancel className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
									</div>
								)}
							</div>

							<div>
								<h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
									{isPassed ? "Congratulations!" : "Requirements not met"}
								</h1>
								<p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">
									{isPassed
										? "You have successfully completed the quiz"
										: "You need to achieve at least " +
										  passingScore +
										  "% to pass the quiz"}
								</p>
							</div>

							{/* Score Display */}
							<div className="space-y-2 sm:space-y-3">
								<Badge
									variant={isPassed ? "default" : "destructive"}
									className={`text-xl sm:text-2xl font-bold px-4 py-2 sm:px-6 sm:py-3 ${
										isPassed
											? "bg-green-500 hover:bg-green-600 text-white"
											: "bg-red-500 hover:bg-red-600 text-white"
									}`}
								>
									{score.toFixed(1)}%
								</Badge>
								<div className="w-full max-w-md mx-auto px-2">
									<Progress value={score} className="h-2 sm:h-3" />
									<div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1">
										<span>0%</span>
										<span className="font-medium text-center">
											Required: {passingScore}%
										</span>
										<span>100%</span>
									</div>
								</div>
							</div>
						</div>

						{/* Statistics */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 py-4 sm:py-6 border-t border-gray-200">
							<div className="space-y-3 sm:space-y-4">
								<div className="bg-gray-50 rounded-lg p-3 sm:p-4">
									<div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
										<div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
											<MdQuestionAnswer className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
										</div>
										<span className="text-xs sm:text-sm text-gray-600 font-medium">
											Correct answers
										</span>
									</div>
									<p className="text-xl sm:text-2xl font-bold text-gray-900">
										{correctAnswers}/{totalQuestions}
									</p>
								</div>

								<div className="bg-gray-50 rounded-lg p-3 sm:p-4">
									<div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
										<div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center">
											<MdCancel className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-600" />
										</div>
										<span className="text-xs sm:text-sm text-gray-600 font-medium">
											Wrong answers
										</span>
									</div>
									<p className="text-xl sm:text-2xl font-bold text-gray-900">
										{incorrectAnswers}
									</p>
								</div>
							</div>

							<div className="space-y-3 sm:space-y-4">
								<div className="bg-gray-50 rounded-lg p-3 sm:p-4">
									<div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
										<div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex items-center justify-center">
											<MdAccessTime className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
										</div>
										<span className="text-xs sm:text-sm text-gray-600 font-medium">
											Completion time
										</span>
									</div>
									<p className="text-xl sm:text-2xl font-bold text-gray-900">
										{secondsToDisplayTime(timeSpent)}
									</p>
								</div>

								<div className="bg-gray-50 rounded-lg p-3 sm:p-4">
									<div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
										<div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
											<MdTrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
										</div>
										<span className="text-xs sm:text-sm text-gray-600 font-medium">
											Score achieved
										</span>
									</div>
									<p className="text-xl sm:text-2xl font-bold text-gray-900">
										{((score / 100) * totalQuestions).toFixed(1)}/
										{totalQuestions}
									</p>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
							<Button
								variant="outline"
								onClick={onBackToOverview}
								className="flex-1 h-10 sm:h-11 text-sm"
							>
								<MdArrowBack className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
								<span className="hidden sm:inline">Back to overview</span>
								<span className="sm:hidden">Back</span>
							</Button>

							{onViewDetails && (
								<Button
									variant="outline"
									onClick={onViewDetails}
									className="flex-1 h-10 sm:h-11 text-sm"
								>
									View details
								</Button>
							)}

							{onRetry && (
								<Button
									onClick={onRetry}
									className="flex-1 bg-blue-600 hover:bg-blue-700 h-10 sm:h-11 text-sm"
								>
									<MdRefresh className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
									Retake
								</Button>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default QuizResult;
