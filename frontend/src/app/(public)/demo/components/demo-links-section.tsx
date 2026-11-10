"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {ExternalLink, Github, Rocket} from "lucide-react";

interface DemoLink {
	title: string;
	version: string;
	description: string;
	liveUrl: string;
	githubUrl?: string;
	status: "active" | "legacy";
}

const demoLinks: DemoLink[] = [
	{
		title: "YoloHub V2",
		version: "2.0",
		description:
			"Phiên bản production hiện tại với đầy đủ tính năng AI, realtime, và payment",
		liveUrl: "https://yolohub.vercel.app",
		status: "active",
	},
	{
		title: "YoloHub V1",
		version: "1.0",
		description: "Phiên bản foundation với các tính năng cơ bản",
		liveUrl: "https://yolo-ui-v1.vercel.app",
		githubUrl: "https://github.com/tinphancr7/yolo-client-v1",
		status: "legacy",
	},
];

const repositories = [
	{
		title: "Frontend V1",
		url: "https://github.com/tinphancr7/yolo-client-v1",
		description: "Next.js client application V1",
	},
	{
		title: "Backend V1",
		url: "https://github.com/tinphancr7/yolo-server-v1",
		description: "NestJS server application V1",
	},
];

function DemoLinksSection() {
	return (
		<section className="py-12 md:py-16" id="demo-links">
			<div className="container mx-auto px-4">
				<div className="mb-8 text-center">
					<Badge className="mb-4" variant="outline">
						Live Demo
					</Badge>
					<h2 className="mb-4 text-3xl font-bold md:text-4xl">
						Trải Nghiệm Ngay
					</h2>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Khám phá các phiên bản demo trực tiếp và source code trên GitHub
					</p>
				</div>

				{/* Live Demos */}
				<div className="mb-8 grid gap-6 md:grid-cols-2">
					{demoLinks.map((demo) => (
						<Card
							key={demo.title}
							className={`group transition-all hover:shadow-xl ${
								demo.status === "active" ? "border-primary/50 bg-primary/5" : ""
							}`}
						>
							<CardHeader>
								<div className="mb-2 flex items-center justify-between">
									<Badge
										variant={demo.status === "active" ? "default" : "secondary"}
										className="gap-1"
									>
										{demo.status === "active" && <Rocket className="h-3 w-3" />}
										Version {demo.version}
									</Badge>
									{demo.status === "active" && (
										<span className="relative flex h-3 w-3">
											<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
											<span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
										</span>
									)}
								</div>
								<CardTitle className="text-xl">{demo.title}</CardTitle>
								<CardDescription>{demo.description}</CardDescription>
							</CardHeader>
							<CardContent className="space-y-3">
								<Button
									className="w-full gap-2"
									variant={demo.status === "active" ? "default" : "outline"}
									asChild
								>
									<a
										href={demo.liveUrl}
										target="_blank"
										rel="noopener noreferrer"
									>
										<ExternalLink className="h-4 w-4" />
										Xem Demo Trực Tiếp
									</a>
								</Button>
								{demo.githubUrl && (
									<Button className="w-full gap-2" variant="outline" asChild>
										<a
											href={demo.githubUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Github className="h-4 w-4" />
											View on GitHub
										</a>
									</Button>
								)}
							</CardContent>
						</Card>
					))}
				</div>

				{/* GitHub Repositories */}
				<div>
					<h3 className="mb-6 text-center text-2xl font-bold">
						Source Code Repositories
					</h3>
					<div className="grid gap-4 md:grid-cols-2">
						{repositories.map((repo) => (
							<Card
								key={repo.title}
								className="transition-shadow hover:shadow-lg"
							>
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg">
										<Github className="h-5 w-5" />
										{repo.title}
									</CardTitle>
									<CardDescription>{repo.description}</CardDescription>
								</CardHeader>
								<CardContent>
									<Button className="w-full gap-2" variant="outline" asChild>
										<a
											href={repo.url}
											target="_blank"
											rel="noopener noreferrer"
										>
											<ExternalLink className="h-4 w-4" />
											View Repository
										</a>
									</Button>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export default DemoLinksSection;
