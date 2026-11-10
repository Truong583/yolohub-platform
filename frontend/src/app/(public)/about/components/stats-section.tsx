"use client";

import {AnimatedCounter} from "@/components/animated-counter";
import {Badge} from "@/components/ui/badge";
import {
	Users,
	BookOpen,
	Star,
	Globe,
	Award,
	Clock,
	TrendingUp,
} from "lucide-react";

// Stats section component - Arrow function
const StatsSection = () => {
	const mainStats = [
		{
			icon: Users,
			value: "50000",
			suffix: "+",
			label: "Active Students",
			description: "Learning worldwide",
		},
		{
			icon: BookOpen,
			value: "1200",
			suffix: "+",
			label: "Expert Courses",
			description: "Across multiple domains",
		},
		{
			icon: Star,
			value: "4.9",
			suffix: "/5",
			label: "Average Rating",
			description: "From student reviews",
		},
		{
			icon: Globe,
			value: "150",
			suffix: "+",
			label: "Countries",
			description: "Students from",
		},
	];

	const additionalStats = [
		{
			icon: Award,
			value: "95",
			suffix: "%",
			label: "Completion Rate",
		},
		{
			icon: Clock,
			value: "10000",
			suffix: "+",
			label: "Hours of Content",
		},
		{
			icon: TrendingUp,
			value: "98",
			suffix: "%",
			label: "Career Growth",
		},
	];

	return (
		<section className="py-20 bg-white">
			<div className="container mx-auto px-6">
				{/* Section Header */}
				<div className="text-center mb-16">
					<Badge
						variant="secondary"
						className="inline-flex items-center space-x-2 mb-4"
					>
						<TrendingUp className="h-3 w-3" />
						<span>Our Impact in Numbers</span>
					</Badge>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
						Trusted by{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
							Thousands
						</span>{" "}
						Worldwide
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
						Our commitment to quality education has created a global community
						of learners, achieving remarkable outcomes and transforming careers.
					</p>
				</div>

				{/* Main Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
					{mainStats.map((stat, index) => {
						const Icon = stat.icon;
						return (
							<div
								key={index}
								className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 border border-gray-100"
							>
								{/* Background Gradient on Hover */}
								<div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-300"></div>

								{/* Icon */}
								<div className="relative z-10 flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
									<Icon className="h-8 w-8 text-white" />
								</div>

								{/* Stats */}
								<div className="relative z-10 space-y-2">
									<div className="flex items-center justify-center">
										<span className="text-4xl md:text-5xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
											<AnimatedCounter value={stat.value} duration={2500} />
										</span>
										<span className="text-2xl md:text-3xl font-bold text-blue-600 ml-1">
											{stat.suffix}
										</span>
									</div>
									<h3 className="text-xl font-semibold text-gray-800">
										{stat.label}
									</h3>
									<p className="text-gray-600">{stat.description}</p>
								</div>

								{/* Decorative Elements */}
								<div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								<div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
							</div>
						);
					})}
				</div>

				{/* Additional Stats */}
				<div className="relative">
					{/* Background Design */}
					<div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 rounded-3xl"></div>

					<div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-lg p-8">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{additionalStats.map((stat, index) => {
								const Icon = stat.icon;
								return (
									<div
										key={index}
										className="flex items-center space-x-4 group"
									>
										<div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl group-hover:from-blue-100 group-hover:to-purple-100 transition-all duration-300">
											<Icon className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
										</div>
										<div>
											<div className="flex items-baseline">
												<span className="text-2xl md:text-3xl font-bold text-gray-900">
													<AnimatedCounter value={stat.value} duration={2000} />
												</span>
												<span className="text-lg font-bold text-blue-600 ml-1">
													{stat.suffix}
												</span>
											</div>
											<p className="text-gray-600 text-sm">{stat.label}</p>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Bottom CTA */}
				<div className="text-center mt-12">
					<p className="text-lg text-gray-600 mb-4">
						Join thousands of successful learners who have transformed their
						careers with us.
					</p>
					<div className="inline-flex items-center space-x-2 text-blue-600">
						<Star className="h-5 w-5 fill-current" />
						<span className="font-medium">Rated 4.9/5 by 15,000+ students</span>
						<Star className="h-5 w-5 fill-current" />
					</div>
				</div>
			</div>
		</section>
	);
};

export default StatsSection;
