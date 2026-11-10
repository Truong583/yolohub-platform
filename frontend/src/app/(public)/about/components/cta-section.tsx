"use client";

import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {
	ArrowRight,
	BookOpen,
	Users,
	Star,
	Sparkles,
	Heart,
	CheckCircle,
} from "lucide-react";
import Link from "next/link";

// Call to action section component - Arrow function
const CallToActionSection = () => {
	const benefits = [
		"Access to 1,200+ premium courses",
		"Learn from industry experts",
		"Flexible learning schedules",
		"Certificate of completion",
		"Lifetime access to content",
		"24/7 community support",
	];

	return (
		<section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-50" />

			{/* Animated Background Elements */}
			<div className="absolute inset-0 overflow-hidden">
				{/* Floating Orbs */}
				<div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float-slow" />
				<div className="absolute top-40 right-20 w-24 h-24 bg-purple-300/20 rounded-full blur-2xl animate-float-medium" />
				<div className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-300/15 rounded-full blur-3xl animate-float-fast" />
				<div className="absolute bottom-20 right-10 w-28 h-28 bg-white/10 rounded-full blur-xl animate-float-slow" />

				{/* Animated Stars */}
				{[...Array(20)].map((_, i) => (
					<div
						key={i}
						className="absolute animate-twinkle-slow"
						style={{
							top: `${Math.random() * 100}%`,
							left: `${Math.random() * 100}%`,
							animationDelay: `${i * 0.3}s`,
						}}
					>
						<Star className="h-2 w-2 text-white/30 fill-current" />
					</div>
				))}
			</div>

			<div className="container mx-auto px-6 relative z-10">
				{/* Section Header */}
				<div className="text-center mb-12">
					<Badge
						variant="secondary"
						className="inline-flex items-center space-x-2 mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30"
					>
						<Sparkles className="h-3 w-3" />
						<span>Start Your Journey Today</span>
					</Badge>

					<h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
						Ready to{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
							Transform
						</span>{" "}
						Your Future?
					</h2>

					<p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
						Join over 50,000 students who have already started their learning
						journey with us. Don&apos;t just dream about your goals – achieve
						them with YoloHub.
					</p>

					{/* Trust Indicators */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
						<div className="flex items-center space-x-2 text-white/90">
							<Star className="h-5 w-5 fill-current text-yellow-400" />
							<span className="font-semibold">4.9/5 Rating</span>
						</div>
						<div className="flex items-center space-x-2 text-white/90">
							<Users className="h-5 w-5" />
							<span className="font-semibold">50,000+ Students</span>
						</div>
						<div className="flex items-center space-x-2 text-white/90">
							<BookOpen className="h-5 w-5" />
							<span className="font-semibold">1,200+ Courses</span>
						</div>
					</div>
				</div>

				{/* Main Content Grid */}
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* Left Content - Benefits */}
					<div className="space-y-8">
						<div>
							<h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
								What You&apos;ll Get:
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{benefits.map((benefit, index) => (
									<div
										key={index}
										className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-all duration-300"
									>
										<div className="flex-shrink-0">
											<CheckCircle className="h-5 w-5 text-green-400" />
										</div>
										<span className="text-white text-sm font-medium">
											{benefit}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Special Offer */}
						<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
							<div className="flex items-center space-x-2 mb-3">
								<Heart className="h-5 w-5 text-red-400 fill-current" />
								<span className="text-yellow-300 font-semibold">
									Limited Time Offer
								</span>
							</div>
							<p className="text-white mb-4">
								Get 50% off your first course when you sign up this month. Start
								learning with the world&apos;s best instructors today!
							</p>
							<div className="text-2xl font-bold text-white">
								<span className="line-through text-white/60 text-lg">$99</span>{" "}
								<span className="text-yellow-300">$49</span>
								<span className="text-sm font-normal text-white/80 ml-2">
									for first course
								</span>
							</div>
						</div>
					</div>

					{/* Right Content - CTA */}
					<div className="text-center lg:text-left">
						<div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
							<div className="mb-8">
								<div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6 shadow-lg animate-pulse">
									<BookOpen className="h-10 w-10 text-white" />
								</div>

								<h3 className="text-3xl font-bold text-white mb-4">
									Start Learning Today
								</h3>

								<p className="text-blue-100 mb-8 leading-relaxed">
									Choose from thousands of courses across technology, business,
									design, and more. Your journey to success starts with a single
									click.
								</p>
							</div>

							{/* Action Buttons */}
							<div className="space-y-4">
								<Button
									size="lg"
									className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-orange-600 text-gray-900 font-bold text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300 border-0 group"
									asChild
								>
									<Link href="/courses">
										{/* Animated shine effect */}
										<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 rounded-lg"></div>
										<span className="relative z-10 flex items-center justify-center">
											Explore Courses Now
											<ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
										</span>
									</Link>
								</Button>

								<Button
									variant="outline"
									size="lg"
									className="w-full border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold py-6 backdrop-blur-sm"
									asChild
								>
									<Link href="/auth/sign-up">Create Free Account</Link>
								</Button>
							</div>

							{/* Money Back Guarantee */}
							<div className="mt-6 text-center">
								<div className="inline-flex items-center space-x-2 text-green-300 text-sm">
									<CheckCircle className="h-4 w-4" />
									<span>30-day money-back guarantee</span>
								</div>
							</div>
						</div>

						{/* Bottom Trust Signal */}
						<div className="mt-8 text-center lg:text-left">
							<p className="text-white/80 text-sm">
								Trusted by learners from{" "}
								<span className="text-yellow-300 font-semibold">
									150+ countries
								</span>
							</p>
							<div className="flex items-center justify-center lg:justify-start space-x-1 mt-2">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className="h-4 w-4 text-yellow-400 fill-current"
									/>
								))}
								<span className="text-white/90 text-sm ml-2">
									15,000+ five-star reviews
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CallToActionSection;
