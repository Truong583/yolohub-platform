"use client";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {
	Award,
	BookOpen,
	Linkedin,
	Mail,
	MapPin,
	Star,
	Twitter,
	Users,
} from "lucide-react";
import Link from "next/link";

// Team section component - Arrow function
const TeamSection = () => {
	const teamMembers = [
		{
			name: "Sarah Johnson",
			role: "Founder & CEO",
			bio: "Former Google engineer with 15+ years in EdTech. Passionate about making quality education accessible worldwide.",
			avatar: "/api/placeholder/200/200",
			location: "San Francisco, CA",
			expertise: ["Leadership", "Product Strategy", "EdTech"],
			achievements: "Built 3 successful startups",
			rating: 4.9,
			courses: 5,
			students: "12K+",
			social: {
				linkedin: "#",
				twitter: "#",
				email: "sarah@yolohub.com",
			},
		},
		{
			name: "Dr. Michael Chen",
			role: "Chief Learning Officer",
			bio: "PhD in Educational Psychology from Stanford. Expert in curriculum design and online learning methodologies.",
			avatar: "/api/placeholder/200/200",
			location: "Seattle, WA",
			expertise: ["Curriculum Design", "Learning Science", "Psychology"],
			achievements: "Published 50+ research papers",
			rating: 4.8,
			courses: 12,
			students: "25K+",
			social: {
				linkedin: "#",
				twitter: "#",
				email: "michael@yolohub.com",
			},
		},
		{
			name: "Emily Rodriguez",
			role: "Head of Content",
			bio: "Award-winning content creator and former Netflix producer. Specializes in creating engaging educational experiences.",
			avatar: "/api/placeholder/200/200",
			location: "Los Angeles, CA",
			expertise: ["Content Creation", "Video Production", "UX Design"],
			achievements: "Emmy Award Winner",
			rating: 4.9,
			courses: 8,
			students: "18K+",
			social: {
				linkedin: "#",
				twitter: "#",
				email: "emily@yolohub.com",
			},
		},
		{
			name: "James Wilson",
			role: "CTO",
			bio: "Former Microsoft architect with expertise in scalable systems. Leading our technical innovation and platform development.",
			avatar: "/api/placeholder/200/200",
			location: "Austin, TX",
			expertise: ["System Architecture", "AI/ML", "Cloud Computing"],
			achievements: "20+ years in tech",
			rating: 4.7,
			courses: 3,
			students: "8K+",
			social: {
				linkedin: "#",
				twitter: "#",
				email: "james@yolohub.com",
			},
		},
		{
			name: "Dr. Priya Patel",
			role: "Head of Research",
			bio: "Leading researcher in adaptive learning technologies. PhD from MIT, focused on AI-powered personalized education.",
			avatar: "/api/placeholder/200/200",
			location: "Boston, MA",
			expertise: ["AI/ML", "Adaptive Learning", "Data Science"],
			achievements: "MIT Innovation Award",
			rating: 4.8,
			courses: 6,
			students: "15K+",
			social: {
				linkedin: "#",
				twitter: "#",
				email: "priya@yolohub.com",
			},
		},
		{
			name: "Alex Thompson",
			role: "Community Manager",
			bio: "Building vibrant learning communities. Expert in student engagement and global community building strategies.",
			avatar: "/api/placeholder/200/200",
			location: "New York, NY",
			expertise: ["Community Building", "Student Success", "Global Outreach"],
			achievements: "Built 100K+ communities",
			rating: 4.9,
			courses: 4,
			students: "22K+",
			social: {
				linkedin: "#",
				twitter: "#",
				email: "alex@yolohub.com",
			},
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
						<Users className="h-3 w-3" />
						<span>Meet Our Team</span>
					</Badge>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
						The{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
							Passionate People
						</span>{" "}
						Behind YoloHub
					</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
						Our diverse team of educators, technologists, and innovators is
						united by a shared mission: transforming lives through exceptional
						online education.
					</p>
				</div>

				{/* Team Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
					{teamMembers.map((member, index) => (
						<Card
							key={index}
							className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group"
						>
							{/* Background Gradient */}
							<div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-blue-50/0 group-hover:from-blue-50/100 group-hover:via-purple-50/50 group-hover:to-blue-50/100 transition-all duration-500" />

							<CardContent className="relative z-10 p-6 text-center">
								{/* Avatar */}
								<div className="relative mx-auto mb-6 w-24 h-24 group-hover:scale-110 transition-transform duration-300">
									<div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
									<div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
										<span className="text-white text-2xl font-bold">
											{member.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</span>
									</div>
									{/* Status Indicator */}
									<div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
										<div className="w-2 h-2 bg-white rounded-full animate-pulse" />
									</div>
								</div>

								{/* Basic Info */}
								<div className="space-y-3 mb-6">
									<h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
										{member.name}
									</h3>
									<p className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
										{member.role}
									</p>
									<p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
										{member.bio}
									</p>
								</div>

								{/* Location & Achievement */}
								<div className="space-y-2 mb-6 text-sm">
									<div className="flex items-center justify-center space-x-2 text-gray-500">
										<MapPin className="h-4 w-4" />
										<span>{member.location}</span>
									</div>
									<div className="flex items-center justify-center space-x-2 text-gray-500">
										<Award className="h-4 w-4" />
										<span className="line-clamp-1">{member.achievements}</span>
									</div>
								</div>

								{/* Stats */}
								<div className="grid grid-cols-3 gap-4 mb-6 p-3 bg-gray-50 rounded-lg group-hover:bg-white/80 transition-colors duration-300">
									<div className="text-center">
										<div className="flex items-center justify-center space-x-1">
											<Star className="h-3 w-3 text-yellow-500 fill-current" />
											<span className="text-sm font-bold text-gray-900">
												{member.rating}
											</span>
										</div>
										<p className="text-xs text-gray-600">Rating</p>
									</div>
									<div className="text-center">
										<div className="flex items-center justify-center space-x-1">
											<BookOpen className="h-3 w-3 text-blue-500" />
											<span className="text-sm font-bold text-gray-900">
												{member.courses}
											</span>
										</div>
										<p className="text-xs text-gray-600">Courses</p>
									</div>
									<div className="text-center">
										<div className="flex items-center justify-center space-x-1">
											<Users className="h-3 w-3 text-green-500" />
											<span className="text-sm font-bold text-gray-900">
												{member.students}
											</span>
										</div>
										<p className="text-xs text-gray-600">Students</p>
									</div>
								</div>

								{/* Expertise Tags */}
								<div className="flex flex-wrap gap-1 justify-center mb-6">
									{member.expertise.slice(0, 3).map((skill, skillIndex) => (
										<Badge
											key={skillIndex}
											variant="secondary"
											className="text-xs py-1 px-2 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
										>
											{skill}
										</Badge>
									))}
								</div>

								{/* Social Links */}
								<div className="flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<Button
										size="sm"
										variant="ghost"
										className="h-8 w-8 p-0"
										asChild
									>
										<Link href={member.social.linkedin}>
											<Linkedin className="h-4 w-4 text-blue-600" />
										</Link>
									</Button>
									<Button
										size="sm"
										variant="ghost"
										className="h-8 w-8 p-0"
										asChild
									>
										<Link href={member.social.twitter}>
											<Twitter className="h-4 w-4 text-blue-500" />
										</Link>
									</Button>
									<Button
										size="sm"
										variant="ghost"
										className="h-8 w-8 p-0"
										asChild
									>
										<Link href={`mailto:${member.social.email}`}>
											<Mail className="h-4 w-4 text-gray-600" />
										</Link>
									</Button>
								</div>
							</CardContent>

							{/* Decorative Elements */}
							<div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
							<div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
						</Card>
					))}
				</div>

				{/* Bottom CTA */}
				<div className="text-center">
					<div className="relative max-w-2xl mx-auto">
						<div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5 rounded-2xl transform -rotate-1" />
						<div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
							<h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
								Want to Join Our Team?
							</h3>
							<p className="text-gray-600 mb-6">
								We&apos;re always looking for passionate educators, developers,
								and innovators to help us transform online education.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" asChild>
									<Link href="/careers">View Open Positions</Link>
								</Button>
								<Button variant="outline" size="lg" asChild>
									<Link href="/contact">Get in Touch</Link>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default TeamSection;
