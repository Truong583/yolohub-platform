"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {
	Monitor,
	Server,
	Database,
	Zap,
	Lock,
	CreditCard,
	Cloud,
	Video,
} from "lucide-react";

interface TechCategory {
	icon: React.ComponentType<{className?: string}>;
	title: string;
	color: string;
	technologies: {name: string; variant?: "default" | "secondary" | "outline"}[];
}

const techStack: TechCategory[] = [
	{
		icon: Monitor,
		title: "Frontend",
		color: "text-blue-500",
		technologies: [
			{name: "Next.js 15"},
			{name: "Redux Toolkit"},
			{name: "React Query"},
			{name: "TailwindCSS"},
			{name: "Zustand"},
			{name: "Shadcn/UI"},
			{name: "Hero UI"},
		],
	},
	{
		icon: Server,
		title: "Backend",
		color: "text-green-500",
		technologies: [
			{name: "NestJS"},
			{name: "Express.js"},
			{name: "Socket.IO"},
			{name: "Bull Queue"},
			{name: "Redis"},
		],
	},
	{
		icon: Database,
		title: "Database & Cache",
		color: "text-purple-500",
		technologies: [
			{name: "MongoDB"},
			{name: "Redis Cache"},
			{name: "Mongoose"},
		],
	},
	{
		icon: Lock,
		title: "Authentication",
		color: "text-red-500",
		technologies: [
			{name: "Access Token"},
			{name: "Refresh Token"},
			{name: "OAuth2"},
			{name: "RBAC"},
		],
	},
	{
		icon: CreditCard,
		title: "Payment",
		color: "text-yellow-500",
		technologies: [{name: "VietQR"}, {name: "Stripe"}, {name: "Coupon System"}],
	},
	{
		icon: Cloud,
		title: "DevOps & Deploy",
		color: "text-cyan-500",
		technologies: [
			{name: "Docker"},
			{name: "PM2"},
			{name: "Nginx"},
			{name: "GitHub Actions"},
			{name: "Cloudflare"},
			{name: "aapanel"},
		],
	},
	{
		icon: Video,
		title: "Upload & Video",
		color: "text-pink-500",
		technologies: [
			{name: "UploadThing"},
			{name: "AWS S3"},
			{name: "MUX"},
			{name: "HLS Streaming"},
		],
	},
	{
		icon: Zap,
		title: "AI & Automation",
		color: "text-orange-500",
		technologies: [
			{name: "Gemini AI"},
			{name: "Bull Queue"},
			{name: "Email Auto"},
		],
	},
];

function TechStackSection() {
	return (
		<section className="py-12 md:py-16" id="tech-stack">
			<div className="container mx-auto px-4">
				<div className="mb-8 text-center">
					<Badge className="mb-4" variant="outline">
						Công nghệ
					</Badge>
					<h2 className="mb-4 text-3xl font-bold md:text-4xl">
						Tech Stack Hiện Đại
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Sử dụng những công nghệ tiên tiến nhất để xây dựng một nền tảng mạnh
						mẽ, scalable và maintainable
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					{techStack.map((category) => {
						const Icon = category.icon;
						return (
							<Card
								key={category.title}
								className="group transition-shadow hover:shadow-lg"
							>
								<CardHeader>
									<div className="mb-3 flex items-center gap-3">
										<div className="rounded-lg bg-primary/10 p-2">
											<Icon className={`h-5 w-5 ${category.color}`} />
										</div>
										<CardTitle className="text-lg">{category.title}</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<div className="flex flex-wrap gap-2">
										{category.technologies.map((tech) => (
											<Badge
												key={tech.name}
												variant={tech.variant || "secondary"}
												className="font-normal"
											>
												{tech.name}
											</Badge>
										))}
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
}

export default TechStackSection;
