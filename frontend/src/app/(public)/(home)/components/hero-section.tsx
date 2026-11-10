"use client";

import {AnimatedCounter} from "@/components/animated-counter";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {ROUTE_CONFIG} from "@/configs/routes";
import {ArrowRight, BookOpen, CheckCircle, Star, Users} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {SlSocialYoutube} from "react-icons/sl";
// Hero section component - Arrow function
const HeroSection = () => {
	const stats = [
		{icon: Users, label: "Students", value: "50,000+"},
		{icon: BookOpen, label: "Courses", value: "1,200+"},
		{icon: Star, label: "Rating", value: "4.9/5"},
	];

	const features = [
		"Expert-led courses",
		"Lifetime access",
		"Certificate of completion",
		"Mobile & desktop learning",
	];

	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

			<div className="container mx-auto px-4 sm:px-6  py-12 sm:py-16 md:py-20 lg:py-20">
				<div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
					{/* Left Content */}
					<div className="space-y-6 sm:space-y-8 text-center lg:text-left">
						{/* Badge */}
						<Badge
							variant="secondary"
							className="inline-flex items-center space-x-1 text-xs sm:text-sm mx-auto lg:mx-0"
						>
							<Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
							<span>Rated #1 Online Learning Platform</span>
						</Badge>

						{/* Main Heading */}
						<div className="space-y-3 sm:space-y-4">
							<h1 className="text-3xl sm:text-4xl md:text-5xl  xl:text-7xl font-bold leading-tight">
								Learn Skills That{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
									Matter
								</span>
							</h1>
							<p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
								Transform your career with industry-relevant courses taught by
								world-class instructors. Start learning today and unlock your
								potential.
							</p>
						</div>

						{/* Features List */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-w-md mx-auto lg:mx-0">
							{features.map((feature, index) => (
								<div
									key={index}
									className="flex items-center space-x-2 justify-center lg:justify-start"
								>
									<CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
									<span className="text-sm sm:text-base text-gray-600">
										{feature}
									</span>
								</div>
							))}
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto lg:mx-0 w-full">
							{/* Primary CTA - Start Learning */}
							<Button
								size="lg"
								className="relative text-sm sm:text-base px-6 sm:px-8 h-12 sm:h-14 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:via-blue-800 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl font-semibold overflow-hidden group border-0 w-full sm:flex-1"
								asChild
							>
								<Link href={ROUTE_CONFIG.COURSES}>
									{/* Animated shine effect */}
									<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
									<span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
										Start Learning
									</span>
									<ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
								</Link>
							</Button>

							{/* Secondary CTA - Watch Demo */}
							<Button
								variant="ghost"
								size="lg"
								className="relative text-sm sm:text-base px-6 sm:px-8 h-12 sm:h-14 text-gray-700 hover:text-blue-600 transition-all duration-300 group hover:bg-gradient-to-br hover:from-blue-50 hover:via-blue-100/50 hover:to-purple-50 hover:shadow-xl hover:shadow-blue-200/25 rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-300 overflow-hidden w-full sm:flex-1"
								asChild
							>
								<Link
									href="https://www.youtube.com/watch?v=B1UvPId3hxY"
									target="_blank"
								>
									<div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-xl transition-all duration-300"></div>
									<SlSocialYoutube className="mr-2 h-4 w-4 sm:h-5 sm:w-5 relative z-10 group-hover:scale-110 transition-transform duration-300 fill-current" />
									<span className="relative z-10 group-hover:scale-105 transition-transform duration-300">
										Watch Demo
									</span>
								</Link>
							</Button>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-4 sm:gap-6 lg:gap-8 pt-2 sm:pt-4 justify-center lg:justify-start">
							{stats.map((stat, index) => {
								const Icon = stat.icon;
								return (
									<div
										key={index}
										className="flex items-center space-x-2 min-w-0"
									>
										<div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex-shrink-0">
											<Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
										</div>
										<div className="min-w-0">
											<div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
												<AnimatedCounter value={stat.value} duration={2000} />
											</div>
											<div className="text-xs sm:text-sm text-gray-600 truncate">
												{stat.label}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* Right Content - Hero Illustration */}
					<div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[550px] mx-auto lg:mx-0 order-first lg:order-last">
						{/* Beautiful Animated Stars */}
						<div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
							{/* Star 1 - Top Left Corner - Purple Gradient */}
							<div className="absolute top-2 sm:top-4 md:top-8 left-4 sm:left-8 md:left-16 animate-float-slow animate-twinkle-slow">
								<Star
									className="h-4 w-4 sm:h-5 sm:w-5 md:h-7 md:w-7 star-purple"
									fill="currentColor"
								/>
							</div>

							{/* Star 2 - Top Right Corner - Blue Gradient */}
							<div className="absolute top-3 sm:top-6 md:top-12 right-4 sm:right-8 md:right-16 animate-float-medium animate-twinkle-medium">
								<Star
									className="h-3 w-3 sm:h-4 sm:w-4 md:h-6 md:w-6 star-blue"
									fill="currentColor"
								/>
							</div>

							{/* Star 3 - Upper Left Area - Pink Gradient */}
							<div className="absolute top-8 sm:top-16 md:top-24 left-2 sm:left-4 md:left-8 animate-float-fast animate-twinkle-slow">
								<Star
									className="h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 star-pink opacity-80"
									fill="currentColor"
								/>
							</div>

							{/* Star 4 - Bottom Right Corner - Gold Gradient */}
							<div className="absolute bottom-4 sm:bottom-8 md:bottom-16 right-6 sm:right-12 md:right-20 animate-float-slow animate-twinkle-fast">
								<Star
									className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 star-gold"
									fill="currentColor"
								/>
							</div>

							{/* Star 5 - Upper Right Area - Cyan Gradient */}
							<div className="absolute top-10 sm:top-20 md:top-32 right-2 sm:right-4 md:right-6 animate-float-medium animate-twinkle-medium">
								<Star
									className="h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 star-cyan opacity-75"
									fill="currentColor"
								/>
							</div>

							{/* Star 6 - Bottom Left Area - Emerald Gradient */}
							<div className="absolute bottom-6 sm:bottom-12 md:bottom-20 left-4 sm:left-8 md:left-12 animate-float-fast animate-twinkle-slow">
								<Star
									className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 star-emerald"
									fill="currentColor"
								/>
							</div>

							{/* Star 7 - Mid Right Edge - Rose Gradient */}
							<div className="absolute top-16 sm:top-32 md:top-48 right-1 sm:right-2 md:right-4 animate-float-slow animate-twinkle-fast">
								<Star
									className="h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 star-rose opacity-70"
									fill="currentColor"
								/>
							</div>

							{/* Star 8 - Top Center Area - Violet Gradient */}
							<div className="absolute top-1 sm:top-2 md:top-4 left-1/3 md:left-1/4 animate-float-medium animate-twinkle-slow">
								<Star
									className="h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 star-violet opacity-85"
									fill="currentColor"
								/>
							</div>

							{/* Star 9 - Bottom Center Area - Amber Gradient */}
							<div className="absolute bottom-2 sm:bottom-4 md:bottom-8 right-1/3 md:right-1/4 animate-float-fast animate-twinkle-medium">
								<Star
									className="h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 star-amber opacity-90"
									fill="currentColor"
								/>
							</div>
						</div>

						{/* Hero Image */}
						<Image
							src="/images/hero.png"
							alt="Learning Student"
							fill
							fetchPriority="high"
							priority={true}
							quality={85}
							sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 550px"
							className="object-contain object-center relative z-10"
						/>
					</div>
				</div>
			</div>

			{/* Harmonious Bottom Wave */}
			<div className="absolute bottom-0 left-0 right-0">
				<svg viewBox="0 0 1440 80" className="w-full h-auto">
					<defs>
						<linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="#fef7ff" stopOpacity="0.6" />
							<stop offset="25%" stopColor="#f1f5f9" stopOpacity="0.8" />
							<stop offset="50%" stopColor="white" stopOpacity="1" />
							<stop offset="75%" stopColor="#eff6ff" stopOpacity="0.8" />
							<stop offset="100%" stopColor="#fef7ff" stopOpacity="0.6" />
						</linearGradient>
					</defs>
					<path
						fill="url(#waveGradient)"
						d="M0,40L48,45C96,50,192,60,288,65C384,70,480,70,576,65C672,60,768,50,864,50C960,50,1056,60,1152,65C1248,70,1344,70,1392,70L1440,70L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z"
					/>
				</svg>
			</div>
		</section>
	);
};

export default HeroSection;
