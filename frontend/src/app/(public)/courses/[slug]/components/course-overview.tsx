"use client";

import {useState} from "react";
import {
	CheckCircle,
	BookOpen,
	Target,
	AlertTriangle,
	Lightbulb,
	FileText,
	MessageCircleQuestion,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {IPublicCourse, CourseQA} from "@/types/course";
import {formatDuration} from "@/utils/format";

interface CourseOverviewProps {
	course: IPublicCourse;
	activeTab: string;
	onTabChange: (tab: string) => void;
}

const tabs = [
	{id: "overview", name: "Overview", icon: BookOpen},
	{id: "requirements", name: "Requirements", icon: AlertTriangle},
	{id: "benefits", name: "Benefits", icon: Target},
	{id: "techniques", name: "Techniques", icon: Lightbulb},
	{id: "documents", name: "Documents", icon: FileText},
	{id: "qa", name: "Q&A", icon: MessageCircleQuestion},
];

const CourseOverview = ({
	course,
	activeTab,
	onTabChange,
}: CourseOverviewProps) => {
	const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

	// Check if description is too long (more than 500 characters)
	const descriptionLength =
		course.description?.replace(/<[^>]*>/g, "").length || 0;
	const shouldTruncate = descriptionLength > 500;

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
			{/* Tab Navigation */}
			<div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
				<div className="flex min-w-max sm:grid sm:grid-cols-6">
					{tabs.map((tab) => {
						const IconComponent = tab.icon;
						return (
							<button
								key={tab.id}
								onClick={() => onTabChange(tab.id)}
								className={`flex items-center justify-center space-x-1 p-3 sm:py-4 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
									activeTab === tab.id
										? "border-blue-500 text-blue-600 bg-blue-50"
										: "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
								}`}
							>
								<IconComponent className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
								<span className="hidden sm:inline">{tab.name}</span>
								<span className="sm:hidden">{tab.name}</span>
							</button>
						);
					})}
				</div>
			</div>

			{/* Tab Content */}
			<div className="p-4 sm:p-6">
				{activeTab === "overview" && (
					<div className="space-y-4 sm:space-y-6">
						<div>
							<h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
								About this course
							</h3>
							<div className="relative">
								<div
									className={`rich-content text-sm sm:text-base text-gray-600 leading-relaxed transition-all duration-300 ${
										!isDescriptionExpanded && shouldTruncate
											? "max-h-60 overflow-hidden"
											: ""
									}`}
									dangerouslySetInnerHTML={{
										__html: course.description,
									}}
								/>
								{!isDescriptionExpanded && shouldTruncate && (
									<div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
								)}
							</div>
							{shouldTruncate && (
								<div className="mt-4 text-center">
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											setIsDescriptionExpanded(!isDescriptionExpanded)
										}
										className="inline-flex items-center gap-2 text-xs sm:text-sm"
									>
										{isDescriptionExpanded ? (
											<>
												Show Less
												<ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
											</>
										) : (
											<>
												Show More
												<ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
											</>
										)}
									</Button>
								</div>
							)}
						</div>

						{/* Course Features */}
						<div>
							<h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">
								This course includes:
							</h4>
							<div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
								{[
									`${formatDuration(
										course.totalDuration || 0
									)} of on-demand video`,
									`${course.totalLessons || 0} lessons`,
									"Full lifetime access",
									"Access on mobile and TV",
									"Certificate of completion",
									"30-day money-back guarantee",
								].map((feature, index) => (
									<div
										key={index}
										className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600"
									>
										<CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
										<span>{feature}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				)}

				{activeTab === "requirements" && (
					<div className="space-y-3 sm:space-y-4">
						<h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
							Requirements
						</h3>
						<ul className="space-y-2 sm:space-y-3">
							{(course.info?.requirements && course.info.requirements.length > 0
								? course.info.requirements
								: [
										"Basic understanding of the subject",
										"Computer with internet connection",
								  ]
							).map((requirement: string, index: number) => (
								<li
									key={index}
									className="flex items-start space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-600"
								>
									<div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
									<span>{requirement}</span>
								</li>
							))}
						</ul>
					</div>
				)}

				{activeTab === "benefits" && (
					<div className="space-y-3 sm:space-y-4">
						<h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
							Benefits
						</h3>
						<div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
							{(course.info?.benefits && course.info.benefits.length > 0
								? course.info.benefits
								: [
										"Master the fundamentals",
										"Build practical projects",
										"Gain hands-on experience",
								  ]
							).map((objective: string, index: number) => (
								<div
									key={index}
									className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg"
								>
									<CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
									<span className="text-xs sm:text-sm text-gray-700">
										{objective}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				{activeTab === "techniques" && (
					<div className="space-y-3 sm:space-y-4">
						<h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
							Techniques Covered
						</h3>
						<div className="space-y-2 sm:space-y-3">
							{(course.info?.techniques && course.info.techniques.length > 0
								? course.info.techniques
								: ["Industry best practices", "Modern development techniques"]
							).map((technique: string, index: number) => (
								<div
									key={index}
									className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
								>
									<div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs sm:text-sm font-medium">
										{index + 1}
									</div>
									<span className="text-xs sm:text-sm text-gray-700">
										{technique}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				{activeTab === "documents" && (
					<div className="space-y-3 sm:space-y-4">
						<h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
							Course Documents & Resources
						</h3>
						<div className="space-y-2 sm:space-y-3">
							{(course.info?.documents && course.info.documents.length > 0
								? course.info.documents
								: ["Course materials will be available after enrollment"]
							).map((document: string, index: number) => (
								<div
									key={index}
									className="flex items-start space-x-2 sm:space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all"
								>
									<BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0 mt-0.5" />
									<div className="flex-grow">
										<p className="text-xs sm:text-sm text-gray-700">
											{document}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{activeTab === "qa" && (
					<div className="space-y-3 sm:space-y-4">
						<h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
							Frequently Asked Questions
						</h3>
						<div className="space-y-3 sm:space-y-4">
							{(course.info?.qa && course.info.qa.length > 0
								? course.info.qa
								: [
										{
											question: "How long do I have access to the course?",
											answer: "You have lifetime access to this course.",
										},
								  ]
							).map((item: CourseQA, index: number) => (
								<div
									key={index}
									className="border border-gray-200 rounded-lg p-3 sm:p-5 hover:border-blue-300 transition-all"
								>
									<h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 flex items-start">
										<span className="text-blue-500 mr-2">Q:</span>
										<span className="flex-1">{item.question}</span>
									</h4>
									<p className="text-xs sm:text-sm text-gray-600 ml-6">
										<span className="text-green-500 font-semibold mr-2">
											A:
										</span>
										{item.answer}
									</p>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CourseOverview;
