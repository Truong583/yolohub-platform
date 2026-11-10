"use client";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
	ArrowRight,
	Clock,
	HeadphonesIcon,
	Mail,
	MessageCircle,
	Phone,
	Star,
	Users,
} from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
	const contactMethods = [
		{
			icon: Phone,
			title: "Phone Support",
			description: "Mon-Fri 9AM-6PM EST",
			value: "+1 (555) 123-4567",
			action: "Call Now",
			href: "tel:+15551234567",
			color: "text-blue-600",
			bgColor: "bg-blue-100",
		},
		{
			icon: Mail,
			title: "Email Support",
			description: "Get response within 2 hours",
			value: "support@yolohub.com",
			action: "Send Email",
			href: "mailto:support@yolohub.com",
			color: "text-green-600",
			bgColor: "bg-green-100",
		},
		{
			icon: MessageCircle,
			title: "Live Chat",
			description: "Available 24/7",
			value: "Chat with our team",
			action: "Start Chat",
			href: "#chat",
			color: "text-purple-600",
			bgColor: "bg-purple-100",
		},
	];

	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
			{/* Background Pattern */}
			<div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

			{/* Floating Elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-xl animate-float-slow" />
				<div className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl animate-float-medium" />
				<div className="absolute bottom-32 left-1/4 w-40 h-40 bg-green-200/15 rounded-full blur-3xl animate-float-fast" />

				{/* Animated Icons */}
				<div className="absolute top-16 right-1/4 animate-float-medium">
					<div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center rotate-12">
						<HeadphonesIcon className="h-6 w-6 text-blue-500" />
					</div>
				</div>
				<div className="absolute bottom-20 right-8 animate-float-slow">
					<div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center -rotate-12">
						<MessageCircle className="h-5 w-5 text-purple-500" />
					</div>
				</div>
			</div>

			<div className="container mx-auto px-6 py-20">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					{/* Left Content */}
					<div className="space-y-8">
						{/* Badge */}
						<Badge
							variant="secondary"
							className="inline-flex items-center space-x-2"
						>
							<HeadphonesIcon className="h-3 w-3" />
							<span>We&apos;re Here to Help</span>
						</Badge>

						{/* Main Heading */}
						<div className="space-y-4">
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
								Get in{" "}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
									Touch
								</span>{" "}
								with Us
							</h1>
							<p className="text-xl text-gray-600 leading-relaxed max-w-lg">
								Have questions about our courses? Need technical support? Our
								friendly team is ready to help you succeed on your learning
								journey.
							</p>
						</div>

						{/* Trust Indicators */}
						<div className="flex flex-wrap gap-6">
							<div className="flex items-center space-x-2 text-gray-600">
								<Clock className="h-5 w-5 text-blue-600" />
								<span className="text-sm font-medium">
									Response within 2 hours
								</span>
							</div>
							<div className="flex items-center space-x-2 text-gray-600">
								<Star className="h-5 w-5 text-yellow-500 fill-current" />
								<span className="text-sm font-medium">
									4.9/5 Support Rating
								</span>
							</div>
							<div className="flex items-center space-x-2 text-gray-600">
								<Users className="h-5 w-5 text-green-600" />
								<span className="text-sm font-medium">24/7 Community Help</span>
							</div>
						</div>

						{/* CTA Button */}
						<div className="flex flex-col sm:flex-row gap-4">
							<Button size="lg" className="text-base px-8" asChild>
								<Link href="#contact-form">
									Send us a Message
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="text-base px-8"
								asChild
							>
								<Link href="/help">
									<HeadphonesIcon className="mr-2 h-4 w-4" />
									Browse Help Center
								</Link>
							</Button>
						</div>
					</div>

					{/* Right Content - Contact Methods */}
					<div className="space-y-6">
						<div className="text-center lg:text-left mb-8">
							<h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
								Choose Your Preferred Way to Connect
							</h2>
							<p className="text-gray-600">
								Multiple ways to reach us - pick what works best for you.
							</p>
						</div>

						<div className="space-y-4">
							{contactMethods.map((method, index) => {
								const Icon = method.icon;
								return (
									<div
										key={index}
										className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
									>
										{/* Background Gradient on Hover */}
										<div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/30 rounded-2xl transition-all duration-300" />

										<div className="relative z-10 flex items-center justify-between">
											<div className="flex items-center space-x-4">
												<div
													className={`w-12 h-12 ${method.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
												>
													<Icon className={`h-6 w-6 ${method.color}`} />
												</div>
												<div>
													<h3 className="text-lg font-semibold text-gray-900">
														{method.title}
													</h3>
													<p className="text-sm text-gray-600 mb-1">
														{method.description}
													</p>
													<p className={`text-sm font-medium ${method.color}`}>
														{method.value}
													</p>
												</div>
											</div>

											<Button
												variant="ghost"
												size="sm"
												className={`opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-50 ${method.color}`}
												asChild
											>
												<Link href={method.href}>
													{method.action}
													<ArrowRight className="ml-2 h-4 w-4" />
												</Link>
											</Button>
										</div>

										{/* Decorative Element */}
										<div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									</div>
								);
							})}
						</div>

						{/* Emergency Contact */}
						<div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
							<div className="flex items-center space-x-3">
								<div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
									<Phone className="h-5 w-5 text-red-600" />
								</div>
								<div>
									<h4 className="font-semibold text-gray-900">
										Emergency Support
									</h4>
									<p className="text-sm text-gray-600">
										For urgent technical issues:{" "}
										<span className="font-medium text-red-600">
											+1 (555) 999-0000
										</span>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
