"use client";

import React, {useState, useEffect} from "react";

interface LessonVideoPlayerProps {
	videoUrl: string;
	title: string;
	description?: string;
	onComplete?: () => void;
	isSidebarOpen?: boolean;
}

// Lesson video player component - Arrow function
const LessonVideoPlayer = ({
	videoUrl,
	title,
	description,
	onComplete,
}: LessonVideoPlayerProps) => {
	const [isVideoLoaded, setIsVideoLoaded] = useState(false);

	// Extract YouTube video ID from URL
	const getYouTubeVideoId = (url: string) => {
		const regex =
			/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
		const match = url.match(regex);
		return match ? match[1] : null;
	};

	const videoId = getYouTubeVideoId(videoUrl);

	const handleVideoLoad = () => {
		setIsVideoLoaded(true);
	};

	// Auto-complete video when it ends (YouTube API would be needed for proper tracking)
	useEffect(() => {
		if (isVideoLoaded) {
			// Simulate completion after some time - in real app, use YouTube API
			const timer = setTimeout(() => {
				onComplete?.();
			}, 5000); // Demo: auto-complete after 5 seconds

			return () => clearTimeout(timer);
		}
	}, [isVideoLoaded, onComplete]);

	if (!videoId) {
		return (
			<div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
				<div
					className="relative w-full bg-gray-900 rounded-lg"
					style={{paddingBottom: "56.25%"}}
				>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="text-white text-center px-4">
							<h3 className="text-base sm:text-lg font-medium mb-2">
								Invalid video
							</h3>
							<p className="text-sm sm:text-base text-gray-400">
								YouTube video URL is not in correct format
							</p>
						</div>
					</div>
				</div>

				{/* Title and Description */}
				<div className="mt-4 sm:mt-6 bg-white p-4 sm:p-6 rounded-lg">
					<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
						{title}
					</h1>
					{description && (
						<div className="prose prose-sm sm:prose prose-gray max-w-none">
							<div
								className="text-sm sm:text-base text-gray-700 leading-relaxed"
								dangerouslySetInnerHTML={{__html: description}}
							/>
						</div>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-full">
			{/* Video Player */}
			<div className="w-full bg-black px-0 sm:px-4 md:px-8 lg:px-12 xl:px-16">
				<div className="relative pt-[56.25%]">
					<iframe
						src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0&showinfo=0&modestbranding=1`}
						title={title}
						className="absolute top-0 left-0 w-full h-full"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						onLoad={handleVideoLoad}
					/>
				</div>
			</div>

			{/* Title and Description */}
			<div className="w-full mt-4 sm:mt-6 pb-6 sm:pb-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
				<h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
					{title}
				</h1>
				{description && (
					<div className="prose prose-sm sm:prose prose-gray max-w-none">
						<div
							className="text-sm sm:text-base text-gray-700 leading-relaxed"
							dangerouslySetInnerHTML={{__html: description}}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default LessonVideoPlayer;
