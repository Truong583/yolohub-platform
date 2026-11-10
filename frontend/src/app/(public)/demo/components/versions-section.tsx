"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {CheckCircle2, Sparkles} from "lucide-react";

interface Version {
	version: string;
	title: string;
	status: "completed" | "current" | "upcoming";
	description: string;
	features: string[];
	badge?: string;
}

const versions: Version[] = [
	{
		version: "V1",
		title: "Foundation",
		status: "completed",
		description:
			"Xây dựng nền tảng cơ bản với CRUD operations và authentication",
		features: [
			"Basic CRUD operations",
			"User authentication & authorization",
			"Course management",
			"Simple payment integration",
			"Basic admin dashboard",
		],
	},
	{
		version: "V2",
		title: "Production Ready",
		status: "current",
		badge: "Đang chạy",
		description:
			"Nâng cấp lên production với AI, realtime, và advanced features",
		features: [
			"AI Chatbot integration (Gemini)",
			"Realtime features (Socket.IO)",
			"Advanced RBAC system",
			"Multiple payment gateways",
			"Video streaming (HLS + MUX)",
			"Bull Queue automation",
			"Redis caching",
			"CI/CD pipeline",
		],
	},
	{
		version: "V3",
		title: "Enterprise Scale",
		status: "upcoming",
		badge: "Sắp ra mắt",
		description:
			"Mở rộng lên quy mô enterprise với microservices và advanced analytics",
		features: [
			"Microservices architecture",
			"Advanced analytics & reporting",
			"Machine learning recommendations",
			"Multi-tenant support",
			"Advanced monitoring & logging",
			"GraphQL API",
			"Kubernetes deployment",
		],
	},
];

function VersionsSection() {
	function getStatusColor(status: Version["status"]) {
		switch (status) {
			case "completed":
				return "bg-green-500/10 text-green-500 border-green-200 dark:border-green-900";
			case "current":
				return "bg-blue-500/10 text-blue-500 border-blue-200 dark:border-blue-900";
			case "upcoming":
				return "bg-purple-500/10 text-purple-500 border-purple-200 dark:border-purple-900";
		}
	}

	return (
		<section className="bg-muted/30 py-12 md:py-16" id="versions">
			<div className="container mx-auto px-4">
				<div className="mb-8 text-center">
					<Badge className="mb-4" variant="outline">
						Lộ trình
					</Badge>
					<h2 className="mb-4 text-3xl font-bold md:text-4xl">
						3 Phiên Bản Tiến Hoá
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Dự án được phát triển theo 3 giai đoạn, mỗi phiên bản nâng cao kỹ
						năng và tư duy xây dựng hệ thống
					</p>
				</div>

				<div className="grid gap-8 lg:grid-cols-3">
					{versions.map((version, index) => (
						<Card
							key={version.version}
							className={`relative transition-all hover:shadow-lg ${getStatusColor(
								version.status
							)}`}
						>
							<CardHeader>
								<div className="mb-2 flex items-center justify-between">
									<Badge variant="outline" className="font-bold">
										{version.version}
									</Badge>
									{version.badge && (
										<Badge className="gap-1">
											<Sparkles className="h-3 w-3" />
											{version.badge}
										</Badge>
									)}
								</div>
								<CardTitle className="text-2xl">{version.title}</CardTitle>
								<CardDescription className="text-sm">
									{version.description}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									{version.features.map((feature) => (
										<div key={feature} className="flex items-start gap-2">
											<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
											<span className="text-sm text-muted-foreground">
												{feature}
											</span>
										</div>
									))}
								</div>
							</CardContent>

							{/* Connection line */}
							{index < versions.length - 1 && (
								<div className="absolute right-0 top-1/2 hidden h-0.5 w-8 -translate-y-1/2 translate-x-full bg-border lg:block" />
							)}
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

export default VersionsSection;
