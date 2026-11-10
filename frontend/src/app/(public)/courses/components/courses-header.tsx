"use client";

import {BookOpen, Users, Star, TrendingUp} from "lucide-react";
import {AnimatedCounter} from "@/components/animated-counter";

const CoursesHeader = () => {
	return (
		<div className="relative bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-800 overflow-hidden">
			{/* Background patterns and decorative elements */}
			<div className="absolute inset-0">
				{/* Gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-purple-600/30" />

				{/* Animated background shapes */}
				<div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

				{/* Grid pattern */}
				<div className="absolute inset-0 opacity-10">
					<div className="grid grid-cols-12 h-full gap-4 transform rotate-12 scale-150">
						{Array.from({length: 144}).map((_, i) => (
							<div key={i} className="bg-white/20 rounded-sm" />
						))}
					</div>
				</div>
			</div>

			<div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 xl:py-24">
				{/* Main content */}
				<div className="text-center max-w-4xl mx-auto">
					{/* Badge */}
					<div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
						<BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-blue-200" />
						<span className="text-xs sm:text-sm font-medium text-blue-100">
							Learning Platform
						</span>
					</div>

					{/* Main heading */}
					<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
						Discover Amazing
						<span className="block bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
							Courses
						</span>
					</h1>

					{/* Subtitle */}
					<p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
						Master new skills with thousands of expert-led courses designed to
						help you grow professionally and personally
					</p>

					{/* Stats */}
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 max-w-2xl mx-auto">
						<div className="text-center group">
							<div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl mb-1.5 sm:mb-2 group-hover:bg-white/20 transition-colors duration-300">
								<BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-200" />
							</div>
							<div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
								<AnimatedCounter value="500+" duration={2000} />
							</div>
							<div className="text-xs sm:text-sm text-blue-200">Courses</div>
						</div>

						<div className="text-center group">
							<div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl mb-1.5 sm:mb-2 group-hover:bg-white/20 transition-colors duration-300">
								<Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-200" />
							</div>
							<div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
								<AnimatedCounter value="50K+" duration={2200} />
							</div>
							<div className="text-xs sm:text-sm text-blue-200">Students</div>
						</div>

						<div className="text-center group">
							<div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl mb-1.5 sm:mb-2 group-hover:bg-white/20 transition-colors duration-300">
								<Star className="h-5 w-5 sm:h-6 sm:w-6 text-blue-200" />
							</div>
							<div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
								<AnimatedCounter value="4.8" duration={1800} />
							</div>
							<div className="text-xs sm:text-sm text-blue-200">Rating</div>
						</div>

						<div className="text-center group">
							<div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl mb-1.5 sm:mb-2 group-hover:bg-white/20 transition-colors duration-300">
								<TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-200" />
							</div>
							<div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
								<AnimatedCounter value="95%" duration={2400} />
							</div>
							<div className="text-xs sm:text-sm text-blue-200">
								Success Rate
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Modern wave design */}
			<div className="absolute bottom-0 left-0 right-0">
				<svg viewBox="0 0 1440 120" className="w-full h-auto">
					<defs>
						<linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="rgb(249, 250, 251)" />
							<stop offset="100%" stopColor="rgb(248, 250, 252)" />
						</linearGradient>
					</defs>
					<path
						fill="url(#waveGradient)"
						d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,85.3C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
					/>
				</svg>
			</div>
		</div>
	);
};

export default CoursesHeader;
